const express = require('express');
const path = require('path');
const multer = require('multer');
const pdfParse = require('pdf-parse');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// =============================================================
// Fuel Price Scraper — ดึงราคาน้ำมันจาก motorist.co.th (ฟรี)
// =============================================================
let fuelPriceCache = { data: null, fetchedAt: 0 };
const FUEL_CACHE_MS = 60 * 60 * 1000;

async function fetchFuelPrices() {
  const now = Date.now();
  if (fuelPriceCache.data && now - fuelPriceCache.fetchedAt < FUEL_CACHE_MS) {
    return fuelPriceCache.data;
  }
  try {
    const res = await fetch('https://www.motorist.co.th/en/petrol-prices', {
      headers: { 'User-Agent': 'GasQueueApp/1.0' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const prices = parseFuelPriceHTML(html);
    fuelPriceCache = { data: prices, fetchedAt: now };
    return prices;
  } catch (err) {
    console.error('Fuel price fetch error:', err.message);
    return fuelPriceCache.data || getFallbackPrices();
  }
}

function parseFuelPriceHTML(html) {
  const prices = [];
  const fuelTypes = [
    { key: 'gasohol_91', name: 'แก๊สโซฮอล์ 91', pattern: /gasohol\s*91/i },
    { key: 'gasohol_95', name: 'แก๊สโซฮอล์ 95', pattern: /gasohol\s*95(?!\s*pre)/i },
    { key: 'gasohol_e20', name: 'แก๊สโซฮอล์ E20', pattern: /gasohol\s*e\s*20/i },
    { key: 'gasohol_e85', name: 'แก๊สโซฮอล์ E85', pattern: /gasohol\s*e\s*85/i },
    { key: 'diesel_b7', name: 'ดีเซล B7', pattern: /diesel\s*b\s*7(?!\s*pre)/i },
  ];
  for (const ft of fuelTypes) {
    const regex = new RegExp(ft.pattern.source + '[\\s\\S]*?(\\d{2}\\.\\d{2})', 'i');
    const match = html.match(regex);
    if (match) prices.push({ key: ft.key, name: ft.name, price: parseFloat(match[1]) });
  }
  return prices.length > 0 ? prices : getFallbackPrices();
}

function getFallbackPrices() {
  return [
    { key: 'gasohol_91', name: 'แก๊สโซฮอล์ 91', price: 30.68 },
    { key: 'gasohol_95', name: 'แก๊สโซฮอล์ 95', price: 31.05 },
    { key: 'gasohol_e20', name: 'แก๊สโซฮอล์ E20', price: 27.84 },
    { key: 'gasohol_e85', name: 'แก๊สโซฮอล์ E85', price: 25.79 },
    { key: 'diesel_b7', name: 'ดีเซล B7', price: 29.94 },
  ];
}

// =============================================================
// OSM Proxy — ดึงปั๊มจาก OpenStreetMap (เลี่ยง CORS)
// =============================================================
app.post('/api/osm-search', async (req, res) => {
  const { lat, lng, radiusKm = 15 } = req.body;
  if (!lat || !lng) return res.status(400).json({ error: 'lat, lng required' });

  const query = `
    [out:json][timeout:30];
    (node["amenity"="fuel"](around:${radiusKm * 1000},${lat},${lng});
     way["amenity"="fuel"](around:${radiusKm * 1000},${lat},${lng}););
    out center tags;
  `;
  try {
    const r = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'data=' + encodeURIComponent(query),
    });
    if (!r.ok) throw new Error(`Overpass ${r.status}`);
    const data = await r.json();

    const stations = data.elements.map(el => {
      const tags = el.tags || {};
      const brand = detectBrand(tags);
      return {
        osm_id: `${el.type}/${el.id}`,
        name: buildStationName(tags, brand),
        brand,
        lat: el.lat || el.center?.lat,
        lng: el.lon || el.center?.lon,
      };
    });

    // Deduplicate names
    const seen = {};
    for (const s of stations) seen[s.name] = (seen[s.name] || 0) + 1;
    const counter = {};
    for (const s of stations) {
      if (seen[s.name] > 1) {
        counter[s.name] = (counter[s.name] || 0) + 1;
        s.name = `${s.name} #${counter[s.name]}`;
      }
    }
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function detectBrand(tags) {
  const name = (tags.name || '') + ' ' + (tags.brand || '') + ' ' + (tags.operator || '');
  if (/ปตท|PTT|พีทีที/i.test(name)) return 'PTT';
  if (/เชลล์|Shell/i.test(name)) return 'Shell';
  if (/บางจาก|Bangchak/i.test(name)) return 'Bangchak';
  if (/คาลเท็กซ์|Caltex/i.test(name)) return 'Caltex';
  if (/เอสโซ่|Esso/i.test(name)) return 'Esso';
  if (/ซัสโก้|Susco/i.test(name)) return 'Susco';
  if (/PT\b/i.test(name)) return 'PT';
  return tags.brand || 'Other';
}

function buildStationName(tags, brand) {
  const nameTh = tags['name:th'] || '';
  const nameRaw = tags.name || '';
  const brandNames = [brand, tags.brand || '', tags['brand:th'] || '', tags['brand:en'] || '']
    .map(s => s.toLowerCase().trim());
  for (const n of [nameTh, nameRaw]) {
    if (n && !brandNames.includes(n.toLowerCase().trim())) return n;
  }
  const parts = [brand];
  const street = tags['addr:street'] || tags['addr:road'] || '';
  const city = tags['addr:city'] || tags['addr:subdistrict'] || tags['addr:district'] || '';
  if (street) { parts.push(street); }
  else if (city) { parts.push(city); }
  return parts.length === 1 ? brand : parts.join(' ');
}

// GET /api/fuel-prices
app.get('/api/fuel-prices', async (req, res) => {
  try {
    const prices = await fetchFuelPrices();
    res.json({ prices, updatedAt: new Date(fuelPriceCache.fetchedAt).toISOString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/refresh-prices — ดึงราคาล่าสุดแล้ว insert ลง Supabase
app.post('/api/refresh-prices', async (req, res) => {
  try {
    const prices = await fetchFuelPrices();
    if (!prices.length) return res.status(500).json({ error: 'No prices' });

    const SUPABASE_URL = 'https://tekcyzixbsuankaiuncs.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_7VRgnntgw8VyGVgC8mTLrA_rnaE2vm0';

    // ดึง stations ที่เป็นข้อมูลจริง
    const stRes = await fetch(`${SUPABASE_URL}/rest/v1/stations?osm_id=like.real/*&select=id,brand,name`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
    });
    const stations = await stRes.json();
    if (!Array.isArray(stations) || !stations.length) return res.json({ updated: 0 });

    const brandDiscount = { 'Cosmo': -0.20, 'Susco': -0.40, 'Other': -0.30 };
    const rows = [];
    for (const s of stations) {
      const discount = brandDiscount[s.brand] || 0;
      for (const p of prices) {
        rows.push({
          station_id: s.id,
          fuel_type: p.key,
          status: 'available',
          price: +(p.price + discount).toFixed(2),
        });
      }
    }

    // Batch insert (Supabase REST API)
    const insRes = await fetch(`${SUPABASE_URL}/rest/v1/fuel_reports`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rows),
    });

    if (!insRes.ok) {
      const err = await insRes.text();
      return res.status(500).json({ error: err });
    }

    res.json({ updated: stations.length, reports: rows.length, prices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================
// PDF Import — อัพโหลด PDF แล้วดึงข้อมูลปั๊ม
// =============================================================
const DISTRICT_MAP = {
  'เมือง': 1, 'เมืองเชียงราย': 1, 'เวียงชัย': 2, 'เชียงของ': 3,
  'เทิง': 4, 'พาน': 5, 'ป่าแดด': 6, 'แม่จัน': 7, 'เชียงแสน': 8,
  'แม่สาย': 9, 'เเม่สาย': 9, 'แม่สรวย': 10, 'เวียงป่าเป้า': 11,
  'พญาเม็งราย': 12, 'เวียงแก่น': 13, 'ขุนตาล': 14, 'แม่ฟ้าหลวง': 15,
  'แม่ลาว': 16, 'เวียงเชียงรุ้ง': 17, 'ดอยหลวง': 18,
};

const BRAND_PATTERNS = [
  [/PTT|ปตท|ป\.ต\.ท/i, 'PTT'],
  [/\bPT\b|พีที|ปิโตรเลียมไทย/i, 'PT'],
  [/Bangchak|บางจาก|สหกรณ์/i, 'Bangchak'],
  [/Shell|เชลล์/i, 'Shell'],
  [/Caltex|คาลเท็กซ์/i, 'Caltex'],
  [/Esso|เอสโซ่/i, 'Esso'],
  [/Susco|ซัสโก้/i, 'Susco'],
  [/Cosmo|คอสโม/i, 'Cosmo'],
];

function detectBrandFromText(text) {
  for (const [pattern, brand] of BRAND_PATTERNS) {
    if (pattern.test(text)) return brand;
  }
  return 'Other';
}

function parsePdfText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const results = [];
  let currentDistrict = null;

  for (const line of lines) {
    // ตรวจหาอำเภอ
    for (const [name, id] of Object.entries(DISTRICT_MAP)) {
      if (line.includes(name) && (line.includes('อำเภอ') || line.includes('อ.') || Object.keys(DISTRICT_MAP).some(d => line.startsWith(d)))) {
        currentDistrict = id;
        break;
      }
    }

    // ตรวจหาชื่อปั๊ม + สถานะน้ำมัน
    const hasStatus = /มีขาย|หมด|ไม่มี|เหลือน้อย/.test(line);
    const hasBrand = BRAND_PATTERNS.some(([p]) => p.test(line));

    if (hasBrand || hasStatus) {
      const brand = detectBrandFromText(line);

      // ดึงสถานะน้ำมันแต่ละชนิด
      const fuel = {};
      const fuelKeys = ['gasohol_95', 'gasohol_91', 'gasohol_e20', 'gasohol_e85', 'diesel_b7'];

      // นับคำว่า "มีขาย" ในบรรทัด
      const availCount = (line.match(/มีขาย/g) || []).length;
      const outCount = (line.match(/หมด/g) || []).length;

      // ถ้ามีข้อมูลสถานะ
      if (availCount > 0 || outCount > 0) {
        // ลองจับตำแหน่งของแต่ละสถานะ
        let idx = 0;
        for (const key of fuelKeys) {
          if (idx < availCount) {
            fuel[key] = 'available';
          }
          idx++;
        }
      }

      // ดึง district จากบรรทัด
      let distId = currentDistrict;
      for (const [name, id] of Object.entries(DISTRICT_MAP)) {
        if (line.includes(name)) { distId = id; break; }
      }

      // ดึงชื่อปั๊ม
      let stationName = line
        .replace(/มีขาย|หมด|ไม่มี|เหลือน้อย/g, '')
        .replace(/\d{1,2}\/\d{1,2}\/\d{4}/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (stationName.length > 5 && distId) {
        results.push({
          name: stationName.substring(0, 100),
          brand,
          district_id: distId,
          fuel,
        });
      }
    }
  }

  return results;
}

app.post('/api/import-pdf', upload.single('pdf'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'กรุณาเลือกไฟล์ PDF' });

  try {
    const data = await pdfParse(req.file.buffer);
    const parsed = parsePdfText(data.text);

    if (!parsed.length) {
      return res.json({ success: false, message: 'ไม่พบข้อมูลปั๊มใน PDF', rawText: data.text.substring(0, 2000) });
    }

    const SUPABASE_URL = 'https://tekcyzixbsuankaiuncs.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_7VRgnntgw8VyGVgC8mTLrA_rnaE2vm0';

    let added = 0, updated = 0;

    for (const station of parsed) {
      // Insert or find station
      const findRes = await fetch(
        `${SUPABASE_URL}/rest/v1/stations?name=eq.${encodeURIComponent(station.name)}&select=id`,
        { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
      );
      const existing = await findRes.json();

      let stationId;
      if (existing.length > 0) {
        stationId = existing[0].id;
      } else {
        // Insert new station
        const insRes = await fetch(`${SUPABASE_URL}/rest/v1/stations`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json', 'Prefer': 'return=representation',
          },
          body: JSON.stringify({
            name: station.name, brand: station.brand,
            district_id: station.district_id,
            osm_id: 'pdf/' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
            is_open: true,
          }),
        });
        if (!insRes.ok) continue;
        const ins = await insRes.json();
        stationId = ins[0]?.id;
        if (!stationId) continue;
        added++;
      }

      // Insert fuel reports
      if (Object.keys(station.fuel).length > 0) {
        const reports = Object.entries(station.fuel).map(([type, status]) => ({
          station_id: stationId, fuel_type: type, status,
        }));
        await fetch(`${SUPABASE_URL}/rest/v1/fuel_reports`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reports),
        });
        updated++;
      }
    }

    res.json({
      success: true,
      message: `พบ ${parsed.length} ปั๊ม, เพิ่มใหม่ ${added}, อัพเดทสถานะ ${updated}`,
      stations: parsed.map(s => ({ name: s.name, brand: s.brand, fuel: s.fuel })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`⛽ Gas Queue Server running on port ${PORT}`));
