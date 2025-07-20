-- PetBook Database Cleanup Script
-- Remove outdated tables and prepare for new schema implementation

-- =====================================================
-- BACKUP EXISTING DATA (OPTIONAL)
-- =====================================================

-- Create backup tables for important data before cleanup
-- Uncomment these lines if you want to backup existing data

/*
-- Backup grooming data
CREATE TABLE grooming_backup AS 
SELECT * FROM groomings;

-- Backup any other important data
-- Add more backup tables as needed
*/

-- =====================================================
-- DROP OUTDATED TABLES
-- =====================================================

-- Drop temporary table
DROP TABLE IF EXISTS temp_shop_data CASCADE;

-- Drop outdated grooming table (will be replaced with grooming_records)
-- Note: This table has different structure than our planned grooming_records
DROP TABLE IF EXISTS groomings CASCADE;

-- =====================================================
-- VERIFY CLEANUP
-- =====================================================

-- List remaining tables to confirm cleanup
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- =====================================================
-- CLEANUP COMPLETION NOTES
-- =====================================================

/*
Tables removed:
- temp_shop_data (temporary table, no longer needed)
- groomings (outdated structure, will be replaced with grooming_records)

Remaining tables (11):
- audit_logs ✅
- services ✅
- users ✅
- reports ✅
- pets ✅
- products ✅
- clients ✅
- shops ✅
- appointment_services ✅
- appointments ✅
- notifications ✅

Next steps:
1. Apply the new schema from database-schema.sql
2. This will create the missing 16 tables
3. Total final schema will have 27 tables
4. All tables will have proper RLS policies
5. All tables will have audit triggers
6. All tables will have proper indexes

The cleanup is now complete and ready for the new schema implementation.
*/ 