-- ==========================================
-- SELECTION HOUSE — REMOVE APPROVAL GATE
-- New businesses are approved automatically. Signup is meant to be
-- low-friction for shop owners and schools. Admins can still block a
-- specific business later if genuinely needed.
-- ==========================================

alter table businesses alter column status set default 'approved';
update businesses set status = 'approved' where status = 'pending';
