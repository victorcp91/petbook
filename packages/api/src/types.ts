// Common types used across the API package

export interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  shop_id: string;
  email: string;
  role: 'owner' | 'admin' | 'groomer' | 'attendant';
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  shop_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface Pet {
  id: string;
  client_id: string;
  name: string;
  species: string;
  breed: string;
  birth_date: string;
  weight: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  shop_id: string;
  pet_id: string;
  groomer_id: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Grooming {
  id: string;
  appointment_id: string;
  services: string[];
  total_price: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  shop_id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id: string;
  old_values: any;
  new_values: any;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types
export interface CreateShopData {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface CreateUserData {
  shop_id: string;
  email: string;
  role: 'owner' | 'admin' | 'groomer' | 'attendant';
}

export interface CreateClientData {
  shop_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface CreatePetData {
  client_id: string;
  name: string;
  species: string;
  breed: string;
  birth_date: string;
  weight: number;
  notes?: string;
}

export interface CreateAppointmentData {
  shop_id: string;
  pet_id: string;
  groomer_id: string;
  date: string;
  time: string;
  notes?: string;
}

export interface CreateGroomingData {
  appointment_id: string;
  services: string[];
  total_price: number;
  notes?: string;
}
