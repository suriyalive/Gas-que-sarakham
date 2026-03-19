-- =============================================================
-- ราคาน้ำมันแต่ละปั๊ม (ตัวอย่างข้อมูล มี.ค. 2026)
-- =============================================================

-- แม่สาย
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_95', 'available', 31.05 FROM stations WHERE osm_id = 'real/maesai-pt1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_91', 'available', 30.68 FROM stations WHERE osm_id = 'real/maesai-pt1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'diesel_b7', 'available', 29.94 FROM stations WHERE osm_id = 'real/maesai-pt1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_e20', 'available', 27.84 FROM stations WHERE osm_id = 'real/maesai-pt1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_e85', 'available', 25.79 FROM stations WHERE osm_id = 'real/maesai-pt1';

INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_95', 'available', 31.05 FROM stations WHERE osm_id = 'real/maesai-ptt2';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_91', 'available', 30.68 FROM stations WHERE osm_id = 'real/maesai-ptt2';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'diesel_b7', 'available', 29.94 FROM stations WHERE osm_id = 'real/maesai-ptt2';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_e20', 'available', 27.84 FROM stations WHERE osm_id = 'real/maesai-ptt2';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_e85', 'available', 25.79 FROM stations WHERE osm_id = 'real/maesai-ptt2';

INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_95', 'available', 31.05 FROM stations WHERE osm_id = 'real/maesai-ptt4';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_91', 'available', 30.68 FROM stations WHERE osm_id = 'real/maesai-ptt4';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'diesel_b7', 'available', 29.94 FROM stations WHERE osm_id = 'real/maesai-ptt4';

INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_95', 'available', 30.88 FROM stations WHERE osm_id = 'real/maesai-cosmo1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_91', 'available', 30.48 FROM stations WHERE osm_id = 'real/maesai-cosmo1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'diesel_b7', 'available', 29.74 FROM stations WHERE osm_id = 'real/maesai-cosmo1';

INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_91', 'available', 30.68 FROM stations WHERE osm_id = 'real/maesai-bcp2';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_91', 'available', 30.68 FROM stations WHERE osm_id = 'real/maesai-bcp3';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_e20', 'available', 27.84 FROM stations WHERE osm_id = 'real/maesai-bcp3';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'diesel_b7', 'available', 29.94 FROM stations WHERE osm_id = 'real/maesai-bcp3';

-- เมืองเชียงราย
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_95', 'available', 31.05 FROM stations WHERE osm_id = 'real/muang-ptt1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_91', 'available', 30.68 FROM stations WHERE osm_id = 'real/muang-ptt1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_e20', 'available', 27.84 FROM stations WHERE osm_id = 'real/muang-ptt1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_e85', 'available', 25.79 FROM stations WHERE osm_id = 'real/muang-ptt1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'diesel_b7', 'available', 29.94 FROM stations WHERE osm_id = 'real/muang-ptt1';

INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_95', 'available', 30.88 FROM stations WHERE osm_id = 'real/muang-cosmo2';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_91', 'available', 30.48 FROM stations WHERE osm_id = 'real/muang-cosmo2';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_e20', 'available', 27.64 FROM stations WHERE osm_id = 'real/muang-cosmo2';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'diesel_b7', 'available', 29.74 FROM stations WHERE osm_id = 'real/muang-cosmo2';

INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_95', 'available', 31.05 FROM stations WHERE osm_id = 'real/muang-pt2';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_91', 'available', 30.68 FROM stations WHERE osm_id = 'real/muang-pt2';

INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_95', 'available', 31.05 FROM stations WHERE osm_id = 'real/muang-caltex1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_91', 'available', 30.68 FROM stations WHERE osm_id = 'real/muang-caltex1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'diesel_b7', 'available', 29.94 FROM stations WHERE osm_id = 'real/muang-caltex1';

INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_95', 'available', 30.68 FROM stations WHERE osm_id = 'real/muang-susco1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_91', 'available', 30.28 FROM stations WHERE osm_id = 'real/muang-susco1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_e20', 'available', 27.44 FROM stations WHERE osm_id = 'real/muang-susco1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'diesel_b7', 'available', 29.94 FROM stations WHERE osm_id = 'real/muang-susco1';

INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_95', 'available', 31.05 FROM stations WHERE osm_id = 'real/muang-bcp2';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_91', 'available', 30.68 FROM stations WHERE osm_id = 'real/muang-bcp2';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'diesel_b7', 'available', 29.94 FROM stations WHERE osm_id = 'real/muang-bcp2';

-- เทิง
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_95', 'available', 31.05 FROM stations WHERE osm_id = 'real/thoeng-ptt1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_91', 'available', 30.68 FROM stations WHERE osm_id = 'real/thoeng-ptt1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'diesel_b7', 'available', 29.94 FROM stations WHERE osm_id = 'real/thoeng-ptt1';

INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_95', 'available', 31.05 FROM stations WHERE osm_id = 'real/thoeng-pt1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_91', 'available', 30.68 FROM stations WHERE osm_id = 'real/thoeng-pt1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_e20', 'available', 27.84 FROM stations WHERE osm_id = 'real/thoeng-pt1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'diesel_b7', 'available', 29.94 FROM stations WHERE osm_id = 'real/thoeng-pt1';

INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_95', 'available', 30.88 FROM stations WHERE osm_id = 'real/thoeng-cosmo1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_91', 'available', 30.48 FROM stations WHERE osm_id = 'real/thoeng-cosmo1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'diesel_b7', 'available', 29.74 FROM stations WHERE osm_id = 'real/thoeng-cosmo1';

-- เวียงชัย
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_95', 'available', 30.88 FROM stations WHERE osm_id = 'real/wiangchai-cosmo1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'diesel_b7', 'available', 29.74 FROM stations WHERE osm_id = 'real/wiangchai-cosmo1';

INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_95', 'available', 31.05 FROM stations WHERE osm_id = 'real/wiangchai-pt1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_91', 'available', 30.68 FROM stations WHERE osm_id = 'real/wiangchai-pt1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'diesel_b7', 'available', 29.94 FROM stations WHERE osm_id = 'real/wiangchai-pt1';

-- ป่าแดด
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_95', 'available', 31.05 FROM stations WHERE osm_id = 'real/padaet-ptt1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_91', 'available', 30.68 FROM stations WHERE osm_id = 'real/padaet-ptt1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_e20', 'available', 27.84 FROM stations WHERE osm_id = 'real/padaet-ptt1';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'diesel_b7', 'available', 29.94 FROM stations WHERE osm_id = 'real/padaet-ptt1';

INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_95', 'available', 31.05 FROM stations WHERE osm_id = 'real/padaet-bcp3';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_91', 'available', 30.68 FROM stations WHERE osm_id = 'real/padaet-bcp3';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'gasohol_e20', 'available', 27.84 FROM stations WHERE osm_id = 'real/padaet-bcp3';
INSERT INTO fuel_reports (station_id, fuel_type, status, price) SELECT id, 'diesel_b7', 'available', 29.94 FROM stations WHERE osm_id = 'real/padaet-bcp3';
