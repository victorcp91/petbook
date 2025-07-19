import { supabase } from "./client";
import type { User } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email: string;
  role: "owner" | "admin" | "groomer" | "attendant";
  shop_id: string;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get user details from our users table
  const { data: userData, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !userData) return null;

  return {
    id: userData.id,
    email: userData.email,
    role: userData.role,
    shop_id: userData.shop_id,
  };
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({
    password,
  });
  if (error) throw error;
}
