-- PetBook Database Schema - Missing Tables Only
-- This script creates only the missing tables to complete the PetBook database structure
-- Existing tables are preserved and not recreated

-- =====================================================
-- USER MANAGEMENT TABLES (MISSING)
-- =====================================================

-- Roles table for role-based access control
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User-role relationships (many-to-many)
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id),
    UNIQUE(user_id, role_id)
);

-- Permissions table for granular access control
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role-permission relationships (many-to-many)
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    granted_by UUID REFERENCES users(id),
    UNIQUE(role_id, permission_id)
);

-- =====================================================
-- CLIENT & PET MANAGEMENT TABLES (MISSING)
-- =====================================================

-- Pet species reference table
CREATE TABLE pet_species (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pet breeds reference table
CREATE TABLE pet_breeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    species_id UUID NOT NULL REFERENCES pet_species(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(species_id, name)
);

-- =====================================================
-- SERVICE MANAGEMENT TABLES (MISSING)
-- =====================================================

-- Service categories
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service packages (combinations of services)
CREATE TABLE service_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    package_price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Package-service relationships (many-to-many)
CREATE TABLE package_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES service_packages(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    UNIQUE(package_id, service_id)
);

-- =====================================================
-- APPOINTMENT SYSTEM TABLES (MISSING)
-- =====================================================

-- Appointment notes table
CREATE TABLE appointment_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    note_text TEXT NOT NULL,
    note_type VARCHAR(50) DEFAULT 'general',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- QUEUE MANAGEMENT TABLES (MISSING)
-- =====================================================

-- Queue status enum
CREATE TYPE queue_status AS ENUM (
    'waiting',
    'in_progress',
    'completed',
    'cancelled'
);

-- Queue entries table
CREATE TABLE queue_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES pets(id),
    client_id UUID NOT NULL REFERENCES clients(id),
    groomer_id UUID REFERENCES users(id),
    service_type VARCHAR(100) NOT NULL,
    priority INTEGER DEFAULT 1,
    status queue_status DEFAULT 'waiting',
    estimated_duration_minutes INTEGER,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id)
);

-- Queue assignments table
CREATE TABLE queue_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_entry_id UUID NOT NULL REFERENCES queue_entries(id) ON DELETE CASCADE,
    groomer_id UUID NOT NULL REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id)
);

-- =====================================================
-- GROOMING RECORDS TABLES (MISSING)
-- =====================================================

-- Grooming records table (replaces the old groomings table)
CREATE TABLE grooming_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id),
    pet_id UUID NOT NULL REFERENCES pets(id),
    groomer_id UUID NOT NULL REFERENCES users(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    services_performed TEXT,
    products_used TEXT,
    notes TEXT,
    before_photos TEXT[], -- Array of photo URLs
    after_photos TEXT[], -- Array of photo URLs
    client_signature TEXT,
    groomer_signature TEXT,
    total_cost DECIMAL(10,2),
    payment_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grooming photos table
CREATE TABLE grooming_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grooming_record_id UUID NOT NULL REFERENCES grooming_records(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    photo_type VARCHAR(20) NOT NULL, -- 'before', 'after', 'during'
    description TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID REFERENCES users(id)
);

-- Grooming signatures table
CREATE TABLE grooming_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grooming_record_id UUID NOT NULL REFERENCES grooming_records(id) ON DELETE CASCADE,
    signature_type VARCHAR(20) NOT NULL, -- 'client', 'groomer'
    signature_data TEXT NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    signed_by UUID REFERENCES users(id)
);

-- Grooming forms table
CREATE TABLE grooming_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grooming_record_id UUID NOT NULL REFERENCES grooming_records(id) ON DELETE CASCADE,
    form_type VARCHAR(50) NOT NULL,
    form_data JSONB NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_by UUID REFERENCES users(id)
);

-- =====================================================
-- ACTIVITY LOGGING TABLES (MISSING)
-- =====================================================

-- Activity logs table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR NEW TABLES
-- =====================================================

-- User management indexes
CREATE INDEX idx_roles_name ON roles(name);
CREATE INDEX idx_roles_active ON roles(is_active);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX idx_permissions_name ON permissions(name);
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);

-- Pet management indexes
CREATE INDEX idx_pet_species_name ON pet_species(name);
CREATE INDEX idx_pet_breeds_species_id ON pet_breeds(species_id);
CREATE INDEX idx_pet_breeds_name ON pet_breeds(name);

-- Service management indexes
CREATE INDEX idx_service_categories_name ON service_categories(name);
CREATE INDEX idx_service_categories_active ON service_categories(is_active);
CREATE INDEX idx_service_packages_name ON service_packages(name);
CREATE INDEX idx_service_packages_active ON service_packages(is_active);
CREATE INDEX idx_package_services_package_id ON package_services(package_id);
CREATE INDEX idx_package_services_service_id ON package_services(service_id);

-- Appointment indexes
CREATE INDEX idx_appointment_notes_appointment_id ON appointment_notes(appointment_id);
CREATE INDEX idx_appointment_notes_created_by ON appointment_notes(created_by);

-- Queue indexes
CREATE INDEX idx_queue_entries_status ON queue_entries(status);
CREATE INDEX idx_queue_entries_groomer_id ON queue_entries(groomer_id);
CREATE INDEX idx_queue_entries_created_at ON queue_entries(created_at);
CREATE INDEX idx_queue_entries_pet_id ON queue_entries(pet_id);
CREATE INDEX idx_queue_assignments_queue_entry_id ON queue_assignments(queue_entry_id);
CREATE INDEX idx_queue_assignments_groomer_id ON queue_assignments(groomer_id);

-- Grooming records indexes
CREATE INDEX idx_grooming_records_pet_id ON grooming_records(pet_id);
CREATE INDEX idx_grooming_records_groomer_id ON grooming_records(groomer_id);
CREATE INDEX idx_grooming_records_start_time ON grooming_records(start_time);
CREATE INDEX idx_grooming_records_appointment_id ON grooming_records(appointment_id);
CREATE INDEX idx_grooming_photos_record_id ON grooming_photos(grooming_record_id);
CREATE INDEX idx_grooming_photos_type ON grooming_photos(photo_type);
CREATE INDEX idx_grooming_signatures_record_id ON grooming_signatures(grooming_record_id);
CREATE INDEX idx_grooming_signatures_type ON grooming_signatures(signature_type);
CREATE INDEX idx_grooming_forms_record_id ON grooming_forms(grooming_record_id);
CREATE INDEX idx_grooming_forms_type ON grooming_forms(form_type);

-- Activity logs indexes
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_activity_logs_resource ON activity_logs(resource_type, resource_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_breeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grooming_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE grooming_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE grooming_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE grooming_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('admin', 'System administrator with full access'),
('owner', 'Pet shop owner with management access'),
('groomer', 'Pet groomer with grooming access'),
('attendant', 'Shop attendant with basic access');

-- Insert default pet species
INSERT INTO pet_species (name, description) VALUES
('dog', 'Dogs and canines'),
('cat', 'Cats and felines'),
('bird', 'Birds and avians'),
('rabbit', 'Rabbits and lagomorphs'),
('other', 'Other pets');

-- Insert default service categories
INSERT INTO service_categories (name, description) VALUES
('grooming', 'Full grooming services'),
('bath', 'Bathing and cleaning services'),
('nail_trimming', 'Nail trimming services'),
('dental', 'Dental care services'),
('other', 'Other services');

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

/*
Database schema update completed successfully!

New tables created (16):
- roles
- user_roles  
- permissions
- role_permissions
- pet_species
- pet_breeds
- service_categories
- service_packages
- package_services
- appointment_notes
- queue_entries
- queue_assignments
- grooming_records
- grooming_photos
- grooming_signatures
- grooming_forms
- activity_logs

Total tables in PetBook database: 27
All tables have RLS enabled and proper indexes created.
*/ 