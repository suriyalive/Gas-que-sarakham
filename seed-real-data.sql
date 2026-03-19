-- =============================================================
-- ข้อมูลจริงจากสำนักงานพลังงานจังหวัดเชียงราย (18 มี.ค. 2026)
-- =============================================================

-- Insert ปั๊มจริง (ถ้ามี osm_id ซ้ำจะข้าม)
INSERT INTO stations (name, brand, district_id, subdistrict, is_open, osm_id) VALUES
  -- แม่สาย (district_id = 9)
  ('PT สาขาแม่สาย', 'PT', 9, 'โป่งผา', true, 'real/maesai-pt1'),
  ('PTT ปิยะพรเจริญกิจ สาขา4', 'PTT', 9, 'โป่งงาม', true, 'real/maesai-ptt1'),
  ('PT สาขาแม่สาย2 เกาะช้าง', 'PT', 9, 'เกาะช้าง', true, 'real/maesai-pt2'),
  ('Cosmo ยอดเหนือปิโตรเลียม', 'Cosmo', 9, 'แม่สาย', true, 'real/maesai-cosmo1'),
  ('PTT ปิยะพรเจริญกิจ (สาขา 2)', 'PTT', 9, 'แม่สาย', true, 'real/maesai-ptt2'),
  ('Cosmo (ต.เวียงพางคำ)', 'Cosmo', 9, 'เวียงพางคำ', true, 'real/maesai-cosmo2'),
  ('PTT แยกห้วยน้ำริน', 'PTT', 9, 'แม่สาย', true, 'real/maesai-ptt3'),
  ('Bangchak แม่สาย', 'Bangchak', 9, 'แม่สาย', true, 'real/maesai-bcp1'),
  ('PTT ปิยะพรเจริญกิจ (แม่สาย)', 'PTT', 9, 'แม่สาย', true, 'real/maesai-ptt4'),
  ('PT แม่สาย (1) ต.บ้านจ้อง', 'PT', 9, 'บ้านจ้อง', true, 'real/maesai-pt3'),
  ('PTT ปิยะพรเจริญกิจ สาขา4 ต.ศรีเมืองชุม', 'PTT', 9, 'ศรีเมืองชุม', true, 'real/maesai-ptt5'),
  ('Bangchak สหกรณ์แม่สาย (ศรีเมืองชุม)', 'Bangchak', 9, 'ศรีเมืองชุม', true, 'real/maesai-bcp2'),
  ('Bangchak สหกรณ์แม่สาย (ตำบลแม่สาย)', 'Bangchak', 9, 'แม่สาย', true, 'real/maesai-bcp3'),
  ('Cosmo ยอดเหนือ สาขา00007 (เวียงหอม)', 'Cosmo', 9, 'แม่สาย', true, 'real/maesai-cosmo3'),

  -- เมืองเชียงราย (district_id = 1)
  ('Bangchak ศรีราชา ต.สันทราย', 'Bangchak', 1, 'สันทราย', true, 'real/muang-bcp1'),
  ('PT สหกรณ์เมืองเชียงราย (สันทราย)', 'PT', 1, 'สันทราย', true, 'real/muang-pt1'),
  ('PT ปิโตรเลียมไทย (ต.สันทราย)', 'PT', 1, 'สันทราย', true, 'real/muang-pt2'),
  ('Cosmo ยอดเหนือปิโตรเลียม ต.บ้านดู่', 'Cosmo', 1, 'บ้านดู่', true, 'real/muang-cosmo1'),
  ('Caltex เติมสุข ออยล์ ต.บ้านดู่', 'Caltex', 1, 'บ้านดู่', true, 'real/muang-caltex1'),
  ('โอลิมปัส ออยล์ ต.บ้านดู่', 'Other', 1, 'บ้านดู่', true, 'real/muang-olympus1'),
  ('PT โอลิมปัส ออยล์ ต.บ้านดู่', 'PT', 1, 'บ้านดู่', true, 'real/muang-pt3'),
  ('Bangchak (ดอยลาน)', 'Bangchak', 1, 'ดอยลาน', true, 'real/muang-bcp2'),
  ('PT (สาขาเชียงราย 5) ต.ดอยลาน', 'PT', 1, 'ดอยลาน', true, 'real/muang-pt4'),
  ('PTT Station ริมกก', 'PTT', 1, 'รอบเวียง', true, 'real/muang-ptt1'),
  ('Cosmo ท่าสุด หน้า ม.แม่ฟ้าหลวง', 'Cosmo', 1, 'ท่าสุด', true, 'real/muang-cosmo2'),
  ('PT Station เชียงราย 4 ต.รอบเวียง', 'PT', 1, 'รอบเวียง', true, 'real/muang-pt5'),
  ('Susco ดอยลาน', 'Susco', 1, 'ดอยลาน', true, 'real/muang-susco1'),

  -- แม่จัน (district_id = 7)
  ('Bangchak หาญสกุลปิโตรเลียม', 'Bangchak', 7, 'ป่าซาง', true, 'real/maechan-bcp1'),
  ('PT Station สาขาแม่จัน 3', 'PT', 7, 'ป่าซาง', true, 'real/maechan-pt1'),
  ('Bangchak สหกรณ์แม่จัน ถ.พหลโยธิน', 'Bangchak', 7, 'แม่จัน', true, 'real/maechan-bcp2'),
  ('PT Station แม่จัน 5 ต.ป่าตึง', 'PT', 7, 'ป่าตึง', true, 'real/maechan-pt2'),

  -- เชียงแสน (district_id = 8)
  ('PT สาขาเชียงแสน', 'PT', 8, 'เวียง', true, 'real/chiangsaen-pt1'),
  ('PTT Station เชียงแสน', 'PTT', 8, 'เวียง', true, 'real/chiangsaen-ptt1'),
  ('Cosmo หจก.เชียงรายกิจขจร ต.ป่าสัก', 'Cosmo', 8, 'ป่าสัก', true, 'real/chiangsaen-cosmo1'),

  -- เชียงของ (district_id = 3)
  ('PTT เชียงของเอ็นเนอร์จี999', 'PTT', 3, 'เวียง', true, 'real/chiangkhong-ptt1'),
  ('Bangchak สหกรณ์เชียงของ', 'Bangchak', 3, 'เวียง', true, 'real/chiangkhong-bcp1'),

  -- เทิง (district_id = 4)
  ('Bangchak สหกรณ์เมืองเทิง', 'Bangchak', 4, 'เวียง', true, 'real/thoeng-bcp1'),
  ('Bangchak พรรณ์คำ', 'Bangchak', 4, 'เวียง', true, 'real/thoeng-bcp2'),
  ('Caltex (อ.เทิง)', 'Caltex', 4, 'เวียง', true, 'real/thoeng-caltex1'),
  ('PTT ดอยปุยปิโตรเลียม', 'PTT', 4, 'งิ้ว', true, 'real/thoeng-ptt1'),
  ('PT สาขาเทิง', 'PT', 4, 'งิ้ว', true, 'real/thoeng-pt1'),
  ('PTT จอมทองปิโตรเลียม', 'PTT', 4, 'ปล้อง', true, 'real/thoeng-ptt2'),
  ('PT เทิง 3 ต.หงาว', 'PT', 4, 'หงาว', true, 'real/thoeng-pt2'),
  ('PTT Station เทิง สามแยกไปภูชี้ฟ้า', 'PTT', 4, 'เวียง', true, 'real/thoeng-ptt3'),
  ('Cosmo เทิง', 'Cosmo', 4, 'เวียง', true, 'real/thoeng-cosmo1'),

  -- พาน (district_id = 5)
  ('Caltex ก.รุ่งเรือง ถ.พหลโยธิน', 'Caltex', 5, 'เมืองพาน', true, 'real/phan-caltex1'),
  ('PT Station พาน 3', 'PT', 5, 'เมืองพาน', true, 'real/phan-pt1'),

  -- เวียงชัย (district_id = 2)
  ('Cosmo ธวัชชัย ออยล์', 'Cosmo', 2, 'เวียงเหนือ', true, 'real/wiangchai-cosmo1'),
  ('PT (สาขาเวียงชัย 2)', 'PT', 2, 'เวียงชัย', true, 'real/wiangchai-pt1'),

  -- ป่าแดด (district_id = 6)
  ('PTT พีดับเบิ้ลยู สเตชั่น', 'PTT', 6, 'ป่าแดด', true, 'real/padaet-ptt1'),
  ('PT ไทยคอร์ปอเรชั่น (ป่าแดด 2)', 'PT', 6, 'ป่าแงะ', true, 'real/padaet-pt1'),
  ('Bangchak สหกรณ์ป่าแดด (ป่าแงะ)', 'Bangchak', 6, 'ป่าแงะ', true, 'real/padaet-bcp1'),
  ('Bangchak สหกรณ์ป่าแดด (สันมะค่า)', 'Bangchak', 6, 'สันมะค่า', true, 'real/padaet-bcp2'),
  ('Bangchak สหกรณ์ป่าแดด (สาขาป่าแดด)', 'Bangchak', 6, 'ป่าแดด', true, 'real/padaet-bcp3'),
  ('Caltex แพนด้า สตาร์ ออยล์', 'Caltex', 6, 'ป่าแดด', true, 'real/padaet-caltex1'),

  -- เวียงป่าเป้า (district_id = 11)
  ('PTT Station เวียงป่าเป้า', 'PTT', 11, 'เวียงป่าเป้า', true, 'real/wiangpapao-ptt1'),
  ('Bangchak รุ่งรวย 95 ต.สันสลี', 'Bangchak', 11, 'สันสลี', true, 'real/wiangpapao-bcp1'),

  -- แม่สรวย (district_id = 10)
  ('PTT Station แม่สรวย', 'PTT', 10, 'แม่สรวย', true, 'real/maesuai-ptt1'),
  ('PT Station แม่สรวย', 'PT', 10, 'แม่สรวย', true, 'real/maesuai-pt1'),

  -- แม่ลาว (district_id = 16)
  ('PTT Station ป่าก่อดำ', 'PTT', 16, 'ป่าก่อดำ', true, 'real/maelao-ptt1'),

  -- พญาเม็งราย (district_id = 12)
  ('PTT Station พญาเม็งราย', 'PTT', 12, 'เม็งราย', true, 'real/phaya-ptt1'),

  -- ขุนตาล (district_id = 14)
  ('PT Station ขุนตาล', 'PT', 14, 'ต้ากว๋าง', true, 'real/khuntan-pt1'),

  -- เวียงแก่น (district_id = 13)
  ('ปั๊มเวียงแก่นปิโตรเลียม', 'Other', 13, 'ม่วงยาย', true, 'real/wiangkaen-other1'),

  -- แม่ฟ้าหลวง (district_id = 15)
  ('ปั๊มพิธิวัฒน์วงศ์ ดอยเทอดไทย', 'Other', 15, 'เทอดไทย', true, 'real/maefa-other1'),

  -- ดอยหลวง (district_id = 18)
  ('PT Station ดอยหลวง', 'PT', 18, 'ปงน้อย', true, 'real/doiluang-pt1'),

  -- เวียงเชียงรุ้ง (district_id = 17)
  ('Bangchak เวียงเชียงรุ้ง', 'Bangchak', 17, 'ทุ่งก่อ', true, 'real/wiangrung-bcp1')

ON CONFLICT (osm_id) DO NOTHING;

-- =============================================================
-- Insert สถานะน้ำมัน (fuel_reports) จากข้อมูลจริง 18/3/2026
-- ใช้ station_id จาก osm_id ที่เพิ่ง insert
-- =============================================================

-- Helper: insert fuel reports สำหรับแต่ละปั๊ม
-- status: available = มีขาย, none = ไม่มีข้อมูล

-- PT สาขาแม่สาย (ทุกชนิดมีขาย)
INSERT INTO fuel_reports (station_id, fuel_type, status, note) SELECT id, 'gasohol_95', 'available', 'ข้อมูลจากสนง.พลังงานจังหวัด 18/3/2026' FROM stations WHERE osm_id = 'real/maesai-pt1';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_91', 'available' FROM stations WHERE osm_id = 'real/maesai-pt1';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_e20', 'available' FROM stations WHERE osm_id = 'real/maesai-pt1';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_e85', 'available' FROM stations WHERE osm_id = 'real/maesai-pt1';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'diesel_b7', 'available' FROM stations WHERE osm_id = 'real/maesai-pt1';

-- PTT ปิยะพรเจริญกิจ (สาขา 2) ทุกชนิดมีขาย
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_95', 'available' FROM stations WHERE osm_id = 'real/maesai-ptt2';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_91', 'available' FROM stations WHERE osm_id = 'real/maesai-ptt2';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_e20', 'available' FROM stations WHERE osm_id = 'real/maesai-ptt2';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_e85', 'available' FROM stations WHERE osm_id = 'real/maesai-ptt2';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'diesel_b7', 'available' FROM stations WHERE osm_id = 'real/maesai-ptt2';

-- PTT ปิยะพร (แม่สาย) - G95, G91, B7 มีขาย
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_95', 'available' FROM stations WHERE osm_id = 'real/maesai-ptt4';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_91', 'available' FROM stations WHERE osm_id = 'real/maesai-ptt4';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'diesel_b7', 'available' FROM stations WHERE osm_id = 'real/maesai-ptt4';

-- Bangchak สหกรณ์แม่สาย (ศรีเมืองชุม) - G91 มีขาย
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_91', 'available' FROM stations WHERE osm_id = 'real/maesai-bcp2';

-- Bangchak สหกรณ์แม่สาย (ตำบลแม่สาย) - G91, E20, B7 มีขาย
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_91', 'available' FROM stations WHERE osm_id = 'real/maesai-bcp3';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_e20', 'available' FROM stations WHERE osm_id = 'real/maesai-bcp3';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'diesel_b7', 'available' FROM stations WHERE osm_id = 'real/maesai-bcp3';

-- PT ปิโตรเลียมไทย (ต.สันทราย) - G95, G91 มีขาย
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_95', 'available' FROM stations WHERE osm_id = 'real/muang-pt2';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_91', 'available' FROM stations WHERE osm_id = 'real/muang-pt2';

-- Bangchak หาญสกุลปิโตรเลียม แม่จัน - G95, G91 มีขาย
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_95', 'available' FROM stations WHERE osm_id = 'real/maechan-bcp1';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_91', 'available' FROM stations WHERE osm_id = 'real/maechan-bcp1';

-- PTT เชียงของเอ็นเนอร์จี999 - G95, B7 มีขาย
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_95', 'available' FROM stations WHERE osm_id = 'real/chiangkhong-ptt1';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'diesel_b7', 'available' FROM stations WHERE osm_id = 'real/chiangkhong-ptt1';

-- Caltex เติมสุข ออยล์ เมืองเชียงราย - G95, G91 มีขาย
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_95', 'available' FROM stations WHERE osm_id = 'real/muang-caltex1';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_91', 'available' FROM stations WHERE osm_id = 'real/muang-caltex1';

-- Bangchak ดอยลาน - G95, G91, B7 มีขาย
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_95', 'available' FROM stations WHERE osm_id = 'real/muang-bcp2';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_91', 'available' FROM stations WHERE osm_id = 'real/muang-bcp2';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'diesel_b7', 'available' FROM stations WHERE osm_id = 'real/muang-bcp2';

-- PTT ดอยปุยปิโตรเลียม เทิง - G95 มีขาย
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_95', 'available' FROM stations WHERE osm_id = 'real/thoeng-ptt1';

-- PT สาขาเทิง - E20 มีขาย
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_e20', 'available' FROM stations WHERE osm_id = 'real/thoeng-pt1';

-- Cosmo ธวัชชัย ออยล์ เวียงชัย - G95, B7 มีขาย
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_95', 'available' FROM stations WHERE osm_id = 'real/wiangchai-cosmo1';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'diesel_b7', 'available' FROM stations WHERE osm_id = 'real/wiangchai-cosmo1';

-- PT เวียงชัย 2 - G95, G91, B7 มีขาย
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_95', 'available' FROM stations WHERE osm_id = 'real/wiangchai-pt1';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_91', 'available' FROM stations WHERE osm_id = 'real/wiangchai-pt1';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'diesel_b7', 'available' FROM stations WHERE osm_id = 'real/wiangchai-pt1';

-- PTT พีดับเบิ้ลยู ป่าแดด - G95, G91, E20 มีขาย
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_95', 'available' FROM stations WHERE osm_id = 'real/padaet-ptt1';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_91', 'available' FROM stations WHERE osm_id = 'real/padaet-ptt1';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_e20', 'available' FROM stations WHERE osm_id = 'real/padaet-ptt1';

-- PT ป่าแดด 2 - G95, G91 มีขาย
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_95', 'available' FROM stations WHERE osm_id = 'real/padaet-pt1';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_91', 'available' FROM stations WHERE osm_id = 'real/padaet-pt1';

-- Bangchak สหกรณ์ป่าแดด ป่าแงะ - G95, G91 มีขาย
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_95', 'available' FROM stations WHERE osm_id = 'real/padaet-bcp1';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_91', 'available' FROM stations WHERE osm_id = 'real/padaet-bcp1';

-- Bangchak สหกรณ์ป่าแดด สันมะค่า - G95, B7 มีขาย
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_95', 'available' FROM stations WHERE osm_id = 'real/padaet-bcp2';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'diesel_b7', 'available' FROM stations WHERE osm_id = 'real/padaet-bcp2';

-- Bangchak สหกรณ์ป่าแดด (สาขาป่าแดด) - G95, G91, E20, B7 มีขาย
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_95', 'available' FROM stations WHERE osm_id = 'real/padaet-bcp3';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_91', 'available' FROM stations WHERE osm_id = 'real/padaet-bcp3';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_e20', 'available' FROM stations WHERE osm_id = 'real/padaet-bcp3';
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'diesel_b7', 'available' FROM stations WHERE osm_id = 'real/padaet-bcp3';

-- Caltex แพนด้า สตาร์ ออยล์ ป่าแดด - G95 มีขาย
INSERT INTO fuel_reports (station_id, fuel_type, status) SELECT id, 'gasohol_95', 'available' FROM stations WHERE osm_id = 'real/padaet-caltex1';
