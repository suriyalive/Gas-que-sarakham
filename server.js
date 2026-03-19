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
  // รวมบรรทัดที่ถูกตัดกลางคัน (URL ยาว)
  const rawLines = text.split('\n');
  const merged = [];
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();
    if (!line) continue;
    // ถ้าเป็น header ข้าม
    if (/อําเภอ.*ชื.*สถานี|อำเภอ.*ชื.*สถานี/.test(line)) continue;
    // ถ้าบรรทัดเริ่มด้วย district name → บรรทัดใหม่
    let startsWithDistrict = false;
    for (const name of Object.keys(DISTRICT_MAP)) {
      if (line.startsWith(name) || line.startsWith('เเ' + name.slice(1))) { startsWithDistrict = true; break; }
    }
    if (startsWithDistrict) {
      merged.push(line);
    } else if (merged.length > 0) {
      merged[merged.length - 1] += ' ' + line;
    }
  }

  const FUEL_CODES = { 'G95': 'gasohol_95', 'G91': 'gasohol_91', 'E20': 'gasohol_e20', 'E85': 'gasohol_e85', 'B7': 'diesel_b7' };
  const results = [];

  for (const line of merged) {
    // หา district
    let distId = 1;
    let restLine = line;
    for (const [name, id] of Object.entries(DISTRICT_MAP)) {
      // จับทั้ง แม่สาย และ เเม่สาย (ตัว แ ซ้ำ)
      if (line.startsWith(name) || line.startsWith('เเ' + name.slice(1))) {
        distId = id;
        restLine = line.slice(line.indexOf(name) + name.length).trim();
        if (line.startsWith('เเ')) restLine = line.slice(line.startsWith('เเม่') ? name.length + 1 : name.length).trim();
        break;
      }
    }

    // หา brand
    const brand = detectBrandFromText(restLine);

    // หา fuel types ที่กล่าวถึง (G95, G91, E20, E85, B7)
    const fuel = {};
    for (const [code, key] of Object.entries(FUEL_CODES)) {
      if (new RegExp('\\b' + code + '\\b', 'i').test(line)) {
        fuel[key] = 'available';
      }
    }

    // ดึง Google Maps URL
    const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
    let lat = null, lng = null;
    if (urlMatch) {
      const coordMatch = urlMatch[1].match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordMatch) { lat = +coordMatch[1]; lng = +coordMatch[2]; }
    }

    // ดึงชื่อปั๊ม: ตัด district, fuel codes, URL, dates ออก
    let stationName = restLine
      .replace(/(https?:\/\/\S+)/g, '')
      .replace(/\b(G95|G91|E20|E85|B7|Premium)\b/gi, '')
      .replace(/\d{1,2}\/\d{1,2}\/\d{4}[,\s\d:]*/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // ตัดชื่อไม่ให้ยาวเกิน
    if (stationName.length > 100) stationName = stationName.substring(0, 100);

    if (stationName.length >= 3 && brand !== 'skip') {
      results.push({
        name: stationName,
        brand,
        district_id: distId,
        fuel,
        lat, lng,
      });
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

    // กรองซ้ำ: ถ้าชื่อเหมือนกัน เอาแค่อันแรก
    const seen = new Set();
    const unique = parsed.filter(s => {
      const key = s.name.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const SUPABASE_URL = 'https://tekcyzixbsuankaiuncs.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_7VRgnntgw8VyGVgC8mTLrA_rnaE2vm0';

    let added = 0, updated = 0, skipped = 0;

    for (const station of unique) {
      // ค้นหาปั๊มที่ชื่อตรงหรือคล้ายกัน
      const findRes = await fetch(
        `${SUPABASE_URL}/rest/v1/stations?name=ilike.*${encodeURIComponent(station.name.substring(0, 30))}*&select=id,name`,
        { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
      );
      const existing = await findRes.json();

      let stationId;
      if (Array.isArray(existing) && existing.length > 0) {
        // มีอยู่แล้ว ใช้ ID เดิม
        stationId = existing[0].id;
        skipped++;
      } else {
        // Insert ปั๊มใหม่
        const insRes = await fetch(`${SUPABASE_URL}/rest/v1/stations`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json', 'Prefer': 'return=representation',
          },
          body: JSON.stringify({
            name: station.name, brand: station.brand,
            district_id: station.district_id,
            lat: station.lat, lng: station.lng,
            osm_id: 'pdf/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
            is_open: true,
          }),
        });
        if (!insRes.ok) continue;
        const ins = await insRes.json();
        stationId = ins[0]?.id;
        if (!stationId) continue;
        added++;
      }

      // Insert fuel reports (ถ้ามีข้อมูล)
      if (stationId && Object.keys(station.fuel).length > 0) {
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
      message: `พบ ${parsed.length} รายการ (ซ้ำ ${parsed.length - unique.length}), เพิ่มใหม่ ${added}, อัพเดท ${updated}, มีอยู่แล้ว ${skipped}`,
      stations: unique.map(s => ({ name: s.name, brand: s.brand, fuel: s.fuel })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/cleanup-duplicates — ลบปั๊มซ้ำ (เก็บอันแรก)
app.delete('/api/cleanup-duplicates', async (req, res) => {
  try {
    const SUPABASE_URL = 'https://tekcyzixbsuankaiuncs.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_7VRgnntgw8VyGVgC8mTLrA_rnaE2vm0';

    // ดึงปั๊มทั้งหมด
    const stRes = await fetch(`${SUPABASE_URL}/rest/v1/stations?select=id,name&order=id`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
    });
    const stations = await stRes.json();
    if (!Array.isArray(stations)) return res.json({ removed: 0 });

    // หา duplicates (ชื่อซ้ำ เก็บ id แรก ลบที่เหลือ)
    const seen = {};
    const toDelete = [];
    for (const s of stations) {
      const key = s.name.toLowerCase().trim();
      if (seen[key]) {
        toDelete.push(s.id);
      } else {
        seen[key] = s.id;
      }
    }

    if (!toDelete.length) return res.json({ removed: 0, message: 'ไม่มีข้อมูลซ้ำ' });

    // ลบ fuel_reports ของปั๊มซ้ำก่อน
    for (const id of toDelete) {
      await fetch(`${SUPABASE_URL}/rest/v1/fuel_reports?station_id=eq.${id}`, {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
      });
      await fetch(`${SUPABASE_URL}/rest/v1/stations?id=eq.${id}`, {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
      });
    }

    res.json({ removed: toDelete.length, message: `ลบปั๊มซ้ำ ${toDelete.length} รายการ` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================
// CSV Import — อัพโหลด CSV/TSV แล้วดึงข้อมูลปั๊ม
// =============================================================
app.post('/api/import-csv', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'กรุณาเลือกไฟล์' });

  try {
    const text = req.file.buffer.toString('utf-8');
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return res.json({ success: false, message: 'ไฟล์ว่างหรือข้อมูลไม่เพียงพอ' });

    // ตรวจ delimiter (tab หรือ comma)
    const delim = lines[0].includes('\t') ? '\t' : ',';
    const header = lines[0].split(delim).map(h => h.trim().toLowerCase());

    // หา column index
    const colMap = {};
    header.forEach((h, i) => {
      if (/อำเภอ|อําเภอ|district/.test(h)) colMap.district = i;
      if (/ชื่อ|สถานี|station|name/.test(h)) colMap.name = i;
      if (/น้ำมัน.*มี|มีจำหน่าย|available/.test(h)) colMap.available = i;
      if (/น้ำมัน.*หมด|ชนิด.*หมด|out/.test(h)) colMap.outOfStock = i;
      if (/google|map|ลิงก์|link/.test(h)) colMap.mapLink = i;
      if (/อัปเดท|update|ประทับ|เวลา/.test(h)) colMap.updated = i;
      if (/กำหนด|เข้า|delivery/.test(h)) colMap.delivery = i;
    });

    // ถ้าหา column ไม่ได้ ลองใช้ตำแหน่งตามรูปแบบที่เห็น
    if (!colMap.name && header.length >= 3) {
      colMap.district = 0;
      colMap.name = 1;
      colMap.available = 2;
      colMap.outOfStock = header.length > 3 ? 3 : undefined;
      colMap.mapLink = header.length > 4 ? 4 : undefined;
    }

    const SUPABASE_URL = 'https://tekcyzixbsuankaiuncs.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_7VRgnntgw8VyGVgC8mTLrA_rnaE2vm0';

    const FUEL_MAP = {
      'g95': 'gasohol_95', '95': 'gasohol_95', 'gasohol 95': 'gasohol_95',
      'g91': 'gasohol_91', '91': 'gasohol_91', 'gasohol 91': 'gasohol_91',
      'e20': 'gasohol_e20', 'gasohol e20': 'gasohol_e20',
      'e85': 'gasohol_e85', 'เบนซิน': 'gasohol_e85', 'benzene': 'gasohol_e85', 'gasohol e85': 'gasohol_e85',
      'b7': 'diesel_b7', 'ดีเซล': 'diesel_b7', 'diesel': 'diesel_b7',
      'premium': 'premium',
    };

    function parseFuelList(text) {
      if (!text) return {};
      const fuel = {};
      const parts = text.split(/[\s,;]+/).map(p => p.trim().toLowerCase());
      for (const p of parts) {
        const key = FUEL_MAP[p];
        if (key) fuel[key] = 'available';
      }
      return fuel;
    }

    function parseFuelOutList(text) {
      if (!text) return {};
      const fuel = {};
      const parts = text.split(/[\s,;]+/).map(p => p.trim().toLowerCase());
      for (const p of parts) {
        const key = FUEL_MAP[p];
        if (key) fuel[key] = 'out';
      }
      return fuel;
    }

    let added = 0, updated = 0, skipped = 0;
    const seen = new Set();

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(delim).map(c => c.trim());
      const districtName = cols[colMap.district] || '';
      const stationName = cols[colMap.name] || '';
      const availText = cols[colMap.available] || '';
      const outText = colMap.outOfStock !== undefined ? (cols[colMap.outOfStock] || '') : '';
      const mapLink = colMap.mapLink !== undefined ? (cols[colMap.mapLink] || '') : '';

      if (!stationName || stationName.length < 3) continue;

      // กรองซ้ำ
      const key = stationName.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      // หา district_id
      let distId = 1;
      for (const [name, id] of Object.entries(DISTRICT_MAP)) {
        if (districtName.includes(name)) { distId = id; break; }
      }

      // หา brand
      const brand = detectBrandFromText(stationName);

      // หา fuel status
      const fuelAvail = parseFuelList(availText);
      const fuelOut = parseFuelOutList(outText);
      const fuel = { ...fuelAvail, ...fuelOut };

      // ดึงพิกัดจาก Google Maps link
      let lat = null, lng = null;
      if (mapLink) {
        const m = mapLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
                  mapLink.match(/query=(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (m) { lat = +m[1]; lng = +m[2]; }
      }

      // ค้นหาปั๊มที่มีอยู่
      const findRes = await fetch(
        `${SUPABASE_URL}/rest/v1/stations?name=ilike.*${encodeURIComponent(stationName.substring(0, 25))}*&select=id`,
        { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
      );
      const existing = await findRes.json();

      let stationId;
      if (Array.isArray(existing) && existing.length > 0) {
        stationId = existing[0].id;
        // อัพเดทพิกัดถ้ามี
        if (lat && lng) {
          await fetch(`${SUPABASE_URL}/rest/v1/stations?id=eq.${stationId}`, {
            method: 'PATCH',
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng }),
          });
        }
        skipped++;
      } else {
        const insRes = await fetch(`${SUPABASE_URL}/rest/v1/stations`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json', 'Prefer': 'return=representation',
          },
          body: JSON.stringify({
            name: stationName.substring(0, 100), brand, district_id: distId,
            lat, lng,
            osm_id: 'csv/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
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
      if (stationId && Object.keys(fuel).length > 0) {
        const reports = Object.entries(fuel).map(([type, status]) => ({
          station_id: stationId, fuel_type: type, status,
        }));
        await fetch(`${SUPABASE_URL}/rest/v1/fuel_reports`, {
          method: 'POST',
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(reports),
        });
        updated++;
      }
    }

    res.json({
      success: true,
      message: `อ่านได้ ${lines.length - 1} แถว, เพิ่มใหม่ ${added}, อัพเดท ${updated}, มีอยู่แล้ว ${skipped}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH support for stations
app.patch('/api/stations/:id', async (req, res) => {
  // proxy to supabase - not needed since we use REST directly
  res.json({ ok: true });
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`⛽ Gas Queue Server running on port ${PORT}`));
