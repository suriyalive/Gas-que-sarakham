const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`⛽ Gas Queue Server running on port ${PORT}`));
