-- ==========================================
-- SELECTION HOUSE — SEED DATA
-- Sample categories + products for development/testing
-- ==========================================

-- ==========================================
-- CATEGORIES (matching your real category list)
-- ==========================================
insert into categories (name, slug, display_order) values
('Hockey', 'hockey', 1),
('Cricket Items', 'cricket-items', 2),
('Basketball', 'basketball', 3),
('Running Shoes', 'running-shoes', 4),
('School Bags and Trolley Bags', 'school-bags-trolley-bags', 5),
('Skating', 'skating', 6),
('Knee Cap and Support', 'knee-cap-support', 7),
('Sublimation/Printing Items', 'sublimation-printing-items', 8),
('Table Tennis', 'table-tennis', 9),
('Bikes and Treadmill', 'bikes-treadmill', 10),
('Primary School Items', 'primary-school-items', 11),
('Indoor Games', 'indoor-games', 12),
('Gym Equipment and Weight', 'gym-equipment-weight', 13),
('Boxing', 'boxing', 14),
('Baby Products', 'baby-products', 15),
('Athletic Equipment', 'athletic-equipment', 16),
('Toys and Games', 'toys-games', 17),
('Shuttlecock', 'shuttlecock', 18),
('Yonex', 'yonex', 19),
('Carrom Board', 'carrom-board', 20),
('Skipping Ropes', 'skipping-ropes', 21),
('Kits', 'kits', 22),
('Ladies Sports Wear', 'ladies-sports-wear', 23);

-- ==========================================
-- SAMPLE PRODUCTS (a few per category for dev/testing)
-- ==========================================
insert into products (category_id, name, slug, description, brand, base_price, moq, sku, is_featured)
select id, 'Professional Hockey Stick', 'professional-hockey-stick', 'Fiberglass composite hockey stick, tournament grade.', 'Selection House', 850.00, 10, 'HOC-001', true
from categories where slug = 'hockey';

insert into products (category_id, name, slug, description, brand, base_price, moq, sku, is_featured)
select id, 'Leather Cricket Ball (Set of 6)', 'leather-cricket-ball-set-6', 'Match-quality red leather cricket balls, box of 6.', 'Selection House', 1200.00, 5, 'CRK-001', true
from categories where slug = 'cricket-items';

insert into products (category_id, name, slug, description, brand, base_price, moq, sku)
select id, 'Basketball Size 7', 'basketball-size-7', 'Official size rubber basketball, indoor/outdoor.', 'Selection House', 450.00, 12, 'BSK-001'
from categories where slug = 'basketball';

insert into products (category_id, name, slug, description, brand, base_price, moq, sku, is_featured)
select id, 'Men Running Shoes', 'men-running-shoes', 'Lightweight breathable running shoes, sizes 6-11.', 'Selection House', 699.00, 20, 'RUN-001', true
from categories where slug = 'running-shoes';

insert into products (category_id, name, slug, description, brand, base_price, moq, sku)
select id, 'School Trolley Bag 18 inch', 'school-trolley-bag-18', 'Durable wheeled school bag with padded straps.', 'Selection House', 950.00, 10, 'BAG-001'
from categories where slug = 'school-bags-trolley-bags';

insert into products (category_id, name, slug, description, brand, base_price, moq, sku)
select id, 'Yonex Badminton Racket', 'yonex-badminton-racket', 'Lightweight aluminum frame, beginner to intermediate.', 'Yonex', 550.00, 15, 'YNX-001'
from categories where slug = 'yonex';

insert into products (category_id, name, slug, description, brand, base_price, moq, sku)
select id, 'Nylon Shuttlecock (Tube of 6)', 'nylon-shuttlecock-tube-6', 'Durable nylon shuttlecocks for regular play.', 'Selection House', 280.00, 24, 'SHT-001'
from categories where slug = 'shuttlecock';

insert into products (category_id, name, slug, description, brand, base_price, moq, sku)
select id, 'Wooden Carrom Board', 'wooden-carrom-board', 'Full size tournament carrom board with coins and striker.', 'Selection House', 1450.00, 5, 'CAR-001'
from categories where slug = 'carrom-board';

-- ==========================================
-- PRICING TIERS (bulk discounts for the featured/sample products)
-- ==========================================
insert into pricing_tiers (product_id, min_quantity, discount_percent)
select id, 25, 5.00 from products where slug = 'professional-hockey-stick'
union all
select id, 50, 10.00 from products where slug = 'professional-hockey-stick'
union all
select id, 20, 5.00 from products where slug = 'men-running-shoes'
union all
select id, 50, 12.00 from products where slug = 'men-running-shoes'
union all
select id, 10, 4.00 from products where slug = 'leather-cricket-ball-set-6'
union all
select id, 25, 8.00 from products where slug = 'leather-cricket-ball-set-6';
