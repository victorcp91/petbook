import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      shops: {
        Row: {
          id: string;
          name: string;
          address: string;
          phone: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          phone: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          phone?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          shop_id: string;
          email: string;
          role: "owner" | "admin" | "groomer" | "attendant";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          email: string;
          role: "owner" | "admin" | "groomer" | "attendant";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          shop_id?: string;
          email?: string;
          role?: "owner" | "admin" | "groomer" | "attendant";
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          shop_id: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          shop_id?: string;
          name?: string;
          email?: string;
          phone?: string;
          address?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      pets: {
        Row: {
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
        };
        Insert: {
          id?: string;
          client_id: string;
          name: string;
          species: string;
          breed: string;
          birth_date: string;
          weight: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          name?: string;
          species?: string;
          breed?: string;
          birth_date?: string;
          weight?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          shop_id: string;
          pet_id: string;
          groomer_id: string;
          date: string;
          time: string;
          status: "scheduled" | "in_progress" | "completed" | "cancelled";
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          pet_id: string;
          groomer_id: string;
          date: string;
          time: string;
          status?: "scheduled" | "in_progress" | "completed" | "cancelled";
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          shop_id?: string;
          pet_id?: string;
          groomer_id?: string;
          date?: string;
          time?: string;
          status?: "scheduled" | "in_progress" | "completed" | "cancelled";
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      groomings: {
        Row: {
          id: string;
          appointment_id: string;
          services: string[];
          total_price: number;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          appointment_id: string;
          services: string[];
          total_price: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          appointment_id?: string;
          services?: string[];
          total_price?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          shop_id: string;
          user_id: string;
          action: string;
          table_name: string;
          record_id: string;
          old_values: any;
          new_values: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          user_id: string;
          action: string;
          table_name: string;
          record_id: string;
          old_values?: any;
          new_values?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          shop_id?: string;
          user_id?: string;
          action?: string;
          table_name?: string;
          record_id?: string;
          old_values?: any;
          new_values?: any;
          created_at?: string;
        };
      };
    };
  };
}
