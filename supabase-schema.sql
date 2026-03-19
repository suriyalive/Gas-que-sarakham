-- =============================================================
-- Gas Queue เชียงราย — Supabase Schema
-- รันใน Supabase Dashboard > SQL Editor > New query
-- =============================================================

-- 1. อำเภอ
CREATE TABLE IF NOT EXISTS districts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  name_en TEXT
);

-- 2. ปั๊มน้ำมัน
CREATE TABLE IF NOT EXISTS stations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'Other',
  district_id INTEGER REFERENCES districts(id),
  subdistrict TEXT,
  pumps INTEGER NOT NULL DEFAULT 4,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  osm_id TEXT UNIQUE,
  is_open BOOLEAN NOT NULL DEFAULT true,
  note TEXT
);

-- 3. รายงานสถานะน้ำมัน (แต่ละชนิด)
CREATE TABLE IF NOT EXISTS fuel_reports (
  id SERIAL PRIMARY KEY,
  station_id INTEGER NOT NULL REFERENCES stations(id),
  user_id UUID REFERENCES auth.users(id),
  fuel_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('available','low','out','none')),
  price NUMERIC(6,2),
  remaining_liters INTEGER,
  queue_cars INTEGER DEFAULT 0,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fuel_reports_station ON fuel_reports(station_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stations_district ON stations(district_id);

-- =============================================================
-- Row Level Security
-- =============================================================
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "districts_public_read" ON districts FOR SELECT USING (true);

ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stations_public_read" ON stations FOR SELECT USING (true);
CREATE POLICY "stations_public_insert" ON stations FOR INSERT WITH CHECK (true);

ALTER TABLE fuel_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports_public_read" ON fuel_reports FOR SELECT USING (true);
CREATE POLICY "reports_auth_insert" ON fuel_reports FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- =============================================================
-- Seed อำเภอเชียงราย (18 อำเภอ)
-- =============================================================
INSERT INTO districts (name, name_en) VALUES
  ('เมืองเชียงราย', 'Mueang Chiang Rai'),
  ('เวียงชัย', 'Wiang Chai'),
  ('เชียงของ', 'Chiang Khong'),
  ('เทิง', 'Thoeng'),
  ('พาน', 'Phan'),
  ('ป่าแดด', 'Pa Daet'),
  ('แม่จัน', 'Mae Chan'),
  ('เชียงแสน', 'Chiang Saen'),
  ('แม่สาย', 'Mae Sai'),
  ('แม่สรวย', 'Mae Suai'),
  ('เวียงป่าเป้า', 'Wiang Pa Pao'),
  ('พญาเม็งราย', 'Phaya Mengrai'),
  ('เวียงแก่น', 'Wiang Kaen'),
  ('ขุนตาล', 'Khun Tan'),
  ('แม่ฟ้าหลวง', 'Mae Fa Luang'),
  ('แม่ลาว', 'Mae Lao'),
  ('เวียงเชียงรุ้ง', 'Wiang Chiang Rung'),
  ('ดอยหลวง', 'Doi Luang')
ON CONFLICT (name) DO NOTHING;
