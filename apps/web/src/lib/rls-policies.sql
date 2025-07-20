-- PetBook Row-Level Security (RLS) Policies
-- Comprehensive security policies for role-based access control
-- Ensures users can only access data they're authorized to see

-- =====================================================
-- HELPER FUNCTIONS FOR RLS POLICIES
-- =====================================================

-- Function to check if current user has a specific role
CREATE OR REPLACE FUNCTION auth.user_has_role(role_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    AND r.name = role_name
    AND r.is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user has a specific permission
CREATE OR REPLACE FUNCTION auth.user_has_permission(permission_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    AND p.name = permission_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user's shop_id (for future multi-shop support)
CREATE OR REPLACE FUNCTION auth.current_user_shop_id()
RETURNS uuid AS $$
BEGIN
  -- For now, return a default shop_id since we're single-shop
  -- This can be enhanced for multi-shop support later
  RETURN '00000000-0000-0000-0000-000000000001'::uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- USER MANAGEMENT POLICIES
-- =====================================================

-- Users table policies
CREATE POLICY users_owner_policy ON users
  FOR ALL USING (
    auth.user_has_role('owner')
  );

CREATE POLICY users_admin_policy ON users
  FOR ALL USING (
    auth.user_has_role('admin')
  );

CREATE POLICY users_self_policy ON users
  FOR SELECT USING (
    id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY users_self_update_policy ON users
  FOR UPDATE USING (
    id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Roles table policies (only admins and owners can manage)
CREATE POLICY roles_admin_policy ON roles
  FOR ALL USING (
    auth.user_has_role('admin') OR auth.user_has_role('owner')
  );

-- User roles table policies
CREATE POLICY user_roles_admin_policy ON user_roles
  FOR ALL USING (
    auth.user_has_role('admin') OR auth.user_has_role('owner')
  );

-- Permissions table policies
CREATE POLICY permissions_admin_policy ON permissions
  FOR ALL USING (
    auth.user_has_role('admin') OR auth.user_has_role('owner')
  );

-- Role permissions table policies
CREATE POLICY role_permissions_admin_policy ON role_permissions
  FOR ALL USING (
    auth.user_has_role('admin') OR auth.user_has_role('owner')
  );

-- =====================================================
-- CLIENT & PET MANAGEMENT POLICIES
-- =====================================================

-- Clients table policies
CREATE POLICY clients_owner_policy ON clients
  FOR ALL USING (
    auth.user_has_role('owner')
  );

CREATE POLICY clients_admin_policy ON clients
  FOR ALL USING (
    auth.user_has_role('admin')
  );

CREATE POLICY clients_staff_policy ON clients
  FOR SELECT USING (
    auth.user_has_role('groomer') OR auth.user_has_role('attendant')
  );

CREATE POLICY clients_staff_insert_policy ON clients
  FOR INSERT WITH CHECK (
    auth.user_has_role('groomer') OR auth.user_has_role('attendant')
  );

CREATE POLICY clients_staff_update_policy ON clients
  FOR UPDATE USING (
    auth.user_has_role('groomer') OR auth.user_has_role('attendant')
  );

-- Pets table policies
CREATE POLICY pets_owner_policy ON pets
  FOR ALL USING (
    auth.user_has_role('owner')
  );

CREATE POLICY pets_admin_policy ON pets
  FOR ALL USING (
    auth.user_has_role('admin')
  );

CREATE POLICY pets_staff_policy ON pets
  FOR SELECT USING (
    auth.user_has_role('groomer') OR auth.user_has_role('attendant')
  );

CREATE POLICY pets_staff_insert_policy ON pets
  FOR INSERT WITH CHECK (
    auth.user_has_role('groomer') OR auth.user_has_role('attendant')
  );

CREATE POLICY pets_staff_update_policy ON pets
  FOR UPDATE USING (
    auth.user_has_role('groomer') OR auth.user_has_role('attendant')
  );

-- Pet species and breeds (read-only for all staff)
CREATE POLICY pet_species_read_policy ON pet_species
  FOR SELECT USING (
    auth.user_has_role('owner') OR auth.user_has_role('admin') OR 
    auth.user_has_role('groomer') OR auth.user_has_role('attendant')
  );

CREATE POLICY pet_breeds_read_policy ON pet_breeds
  FOR SELECT USING (
    auth.user_has_role('owner') OR auth.user_has_role('admin') OR 
    auth.user_has_role('groomer') OR auth.user_has_role('attendant')
  );

-- =====================================================
-- SERVICE MANAGEMENT POLICIES
-- =====================================================

-- Service categories policies
CREATE POLICY service_categories_owner_policy ON service_categories
  FOR ALL USING (
    auth.user_has_role('owner')
  );

CREATE POLICY service_categories_admin_policy ON service_categories
  FOR ALL USING (
    auth.user_has_role('admin')
  );

CREATE POLICY service_categories_read_policy ON service_categories
  FOR SELECT USING (
    auth.user_has_role('groomer') OR auth.user_has_role('attendant')
  );

-- Services table policies
CREATE POLICY services_owner_policy ON services
  FOR ALL USING (
    auth.user_has_role('owner')
  );

CREATE POLICY services_admin_policy ON services
  FOR ALL USING (
    auth.user_has_role('admin')
  );

CREATE POLICY services_read_policy ON services
  FOR SELECT USING (
    auth.user_has_role('groomer') OR auth.user_has_role('attendant')
  );

-- Service packages policies
CREATE POLICY service_packages_owner_policy ON service_packages
  FOR ALL USING (
    auth.user_has_role('owner')
  );

CREATE POLICY service_packages_admin_policy ON service_packages
  FOR ALL USING (
    auth.user_has_role('admin')
  );

CREATE POLICY service_packages_read_policy ON service_packages
  FOR SELECT USING (
    auth.user_has_role('groomer') OR auth.user_has_role('attendant')
  );

-- Package services policies
CREATE POLICY package_services_owner_policy ON package_services
  FOR ALL USING (
    auth.user_has_role('owner')
  );

CREATE POLICY package_services_admin_policy ON package_services
  FOR ALL USING (
    auth.user_has_role('admin')
  );

CREATE POLICY package_services_read_policy ON package_services
  FOR SELECT USING (
    auth.user_has_role('groomer') OR auth.user_has_role('attendant')
  );

-- =====================================================
-- APPOINTMENT SYSTEM POLICIES
-- =====================================================

-- Appointments table policies
CREATE POLICY appointments_owner_policy ON appointments
  FOR ALL USING (
    auth.user_has_role('owner')
  );

CREATE POLICY appointments_admin_policy ON appointments
  FOR ALL USING (
    auth.user_has_role('admin')
  );

-- Groomers can see and manage their own appointments
CREATE POLICY appointments_groomer_policy ON appointments
  FOR ALL USING (
    auth.user_has_role('groomer') AND 
    groomer_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Attendants can see all appointments and create new ones
CREATE POLICY appointments_attendant_policy ON appointments
  FOR SELECT USING (
    auth.user_has_role('attendant')
  );

CREATE POLICY appointments_attendant_insert_policy ON appointments
  FOR INSERT WITH CHECK (
    auth.user_has_role('attendant')
  );

CREATE POLICY appointments_attendant_update_policy ON appointments
  FOR UPDATE USING (
    auth.user_has_role('attendant')
  );

-- Appointment services policies
CREATE POLICY appointment_services_owner_policy ON appointment_services
  FOR ALL USING (
    auth.user_has_role('owner')
  );

CREATE POLICY appointment_services_admin_policy ON appointment_services
  FOR ALL USING (
    auth.user_has_role('admin')
  );

CREATE POLICY appointment_services_staff_policy ON appointment_services
  FOR ALL USING (
    auth.user_has_role('groomer') OR auth.user_has_role('attendant')
  );

-- Appointment notes policies
CREATE POLICY appointment_notes_owner_policy ON appointment_notes
  FOR ALL USING (
    auth.user_has_role('owner')
  );

CREATE POLICY appointment_notes_admin_policy ON appointment_notes
  FOR ALL USING (
    auth.user_has_role('admin')
  );

CREATE POLICY appointment_notes_staff_policy ON appointment_notes
  FOR ALL USING (
    auth.user_has_role('groomer') OR auth.user_has_role('attendant')
  );

-- =====================================================
-- QUEUE MANAGEMENT POLICIES
-- =====================================================

-- Queue entries policies
CREATE POLICY queue_entries_owner_policy ON queue_entries
  FOR ALL USING (
    auth.user_has_role('owner')
  );

CREATE POLICY queue_entries_admin_policy ON queue_entries
  FOR ALL USING (
    auth.user_has_role('admin')
  );

-- All staff can manage queue entries
CREATE POLICY queue_entries_staff_policy ON queue_entries
  FOR ALL USING (
    auth.user_has_role('groomer') OR auth.user_has_role('attendant')
  );

-- Queue assignments policies
CREATE POLICY queue_assignments_owner_policy ON queue_assignments
  FOR ALL USING (
    auth.user_has_role('owner')
  );

CREATE POLICY queue_assignments_admin_policy ON queue_assignments
  FOR ALL USING (
    auth.user_has_role('admin')
  );

CREATE POLICY queue_assignments_staff_policy ON queue_assignments
  FOR ALL USING (
    auth.user_has_role('groomer') OR auth.user_has_role('attendant')
  );

-- =====================================================
-- GROOMING RECORDS POLICIES
-- =====================================================

-- Grooming records policies
CREATE POLICY grooming_records_owner_policy ON grooming_records
  FOR ALL USING (
    auth.user_has_role('owner')
  );

CREATE POLICY grooming_records_admin_policy ON grooming_records
  FOR ALL USING (
    auth.user_has_role('admin')
  );

-- Groomers can only see their own grooming records
CREATE POLICY grooming_records_groomer_policy ON grooming_records
  FOR ALL USING (
    auth.user_has_role('groomer') AND 
    groomer_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Attendants can view grooming records for their shop
CREATE POLICY grooming_records_attendant_policy ON grooming_records
  FOR SELECT USING (
    auth.user_has_role('attendant')
  );

-- Grooming photos policies
CREATE POLICY grooming_photos_owner_policy ON grooming_photos
  FOR ALL USING (
    auth.user_has_role('owner')
  );

CREATE POLICY grooming_photos_admin_policy ON grooming_photos
  FOR ALL USING (
    auth.user_has_role('admin')
  );

CREATE POLICY grooming_photos_groomer_policy ON grooming_photos
  FOR ALL USING (
    auth.user_has_role('groomer') AND 
    grooming_record_id IN (
      SELECT id FROM grooming_records 
      WHERE groomer_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY grooming_photos_attendant_policy ON grooming_photos
  FOR SELECT USING (
    auth.user_has_role('attendant')
  );

-- Grooming signatures policies
CREATE POLICY grooming_signatures_owner_policy ON grooming_signatures
  FOR ALL USING (
    auth.user_has_role('owner')
  );

CREATE POLICY grooming_signatures_admin_policy ON grooming_signatures
  FOR ALL USING (
    auth.user_has_role('admin')
  );

CREATE POLICY grooming_signatures_groomer_policy ON grooming_signatures
  FOR ALL USING (
    auth.user_has_role('groomer') AND 
    grooming_record_id IN (
      SELECT id FROM grooming_records 
      WHERE groomer_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY grooming_signatures_attendant_policy ON grooming_signatures
  FOR SELECT USING (
    auth.user_has_role('attendant')
  );

-- Grooming forms policies
CREATE POLICY grooming_forms_owner_policy ON grooming_forms
  FOR ALL USING (
    auth.user_has_role('owner')
  );

CREATE POLICY grooming_forms_admin_policy ON grooming_forms
  FOR ALL USING (
    auth.user_has_role('admin')
  );

CREATE POLICY grooming_forms_groomer_policy ON grooming_forms
  FOR ALL USING (
    auth.user_has_role('groomer') AND 
    grooming_record_id IN (
      SELECT id FROM grooming_records 
      WHERE groomer_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY grooming_forms_attendant_policy ON grooming_forms
  FOR SELECT USING (
    auth.user_has_role('attendant')
  );

-- =====================================================
-- AUDIT & LOGGING POLICIES
-- =====================================================

-- Audit logs policies (only owners and admins)
CREATE POLICY audit_logs_owner_policy ON audit_logs
  FOR SELECT USING (
    auth.user_has_role('owner')
  );

CREATE POLICY audit_logs_admin_policy ON audit_logs
  FOR SELECT USING (
    auth.user_has_role('admin')
  );

-- Activity logs policies (only owners and admins)
CREATE POLICY activity_logs_owner_policy ON activity_logs
  FOR SELECT USING (
    auth.user_has_role('owner')
  );

CREATE POLICY activity_logs_admin_policy ON activity_logs
  FOR SELECT USING (
    auth.user_has_role('admin')
  );

-- Users can see their own activity
CREATE POLICY activity_logs_self_policy ON activity_logs
  FOR SELECT USING (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- =====================================================
-- POLICY VALIDATION
-- =====================================================

-- Verify all tables have RLS enabled and policies created
DO $$
DECLARE
    table_record RECORD;
    policy_count INTEGER;
BEGIN
    FOR table_record IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'pg_%'
        AND tablename NOT LIKE 'sql_%'
    LOOP
        -- Check if RLS is enabled
        IF NOT EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE tablename = table_record.tablename 
            AND rowsecurity = true
        ) THEN
            RAISE NOTICE 'Table % does not have RLS enabled', table_record.tablename;
        END IF;
        
        -- Count policies for this table
        SELECT COUNT(*) INTO policy_count
        FROM pg_policies 
        WHERE tablename = table_record.tablename;
        
        IF policy_count = 0 THEN
            RAISE NOTICE 'Table % has no RLS policies', table_record.tablename;
        END IF;
    END LOOP;
END $$;

-- =====================================================
-- POLICY TESTING FUNCTIONS
-- =====================================================

-- Function to test RLS policies
CREATE OR REPLACE FUNCTION test_rls_policies()
RETURNS TABLE(table_name text, policy_name text, policy_type text) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.tablename::text,
        p.policyname::text,
        p.cmd::text
    FROM pg_policies p
    WHERE p.schemaname = 'public'
    ORDER BY p.tablename, p.policyname;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permissions()
RETURNS TABLE(role_name text, permissions text[]) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.name::text,
        ARRAY_AGG(p.name)::text[]
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    GROUP BY r.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 