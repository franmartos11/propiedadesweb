import 'server-only';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Property } from '@/lib/data/properties';
import { properties as staticProperties } from '@/lib/data/properties';

export type LeadStatus = 'Nuevo' | 'Contactado' | 'En seguimiento' | 'Cerrado';

export interface Lead {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  servicio: string;
  mensaje: string;
  estado: LeadStatus;
  notas?: string;
  creadoEn: string;
}

export type { Property };

// ─── Leads ────────────────────────────────────────────────────────────────────

export async function getLeads(): Promise<Lead[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('creadoEn', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
  return data as Lead[];
}

export async function saveLead(lead: Omit<Lead, 'id' | 'estado' | 'creadoEn'>): Promise<Lead> {
  const supabase = createServerSupabaseClient();
  const newLead: Lead = {
    ...lead,
    id: crypto.randomUUID(),
    estado: 'Nuevo',
    creadoEn: new Date().toISOString(),
  };

  const { error } = await supabase.from('leads').insert([newLead]);
  if (error) {
    console.error('Error inserting lead:', error);
    throw new Error('No se pudo guardar el lead en la base de datos');
  }

  return newLead;
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    console.error('Error updating lead:', error);
    return null;
  }
  return data as Lead;
}

// ─── Properties ───────────────────────────────────────────────────────────────

export async function getProperties(): Promise<Property[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('updatedAt', { ascending: false });

  if (error) {
    console.error('Error fetching properties from Supabase, falling back to static:', error);
    return staticProperties as Property[]; // Fallback for local testing if table is empty
  }

  // If table is empty, we return static as fallback during the migration phase
  if (!data || data.length === 0) {
    return staticProperties as Property[];
  }

  return data as Property[];
}

export async function createProperty(data: Omit<Property, 'id' | 'slug' | 'updatedAt'>): Promise<Property> {
  const supabase = createServerSupabaseClient();
  const id = `p${Date.now()}`;
  const slug = `propiedad-${id}`;
  const newProp: Property = {
    ...data,
    id,
    slug,
    updatedAt: new Date().toISOString(),
  };

  const { error } = await supabase.from('properties').insert([newProp]);
  if (error) {
    console.error('Error creating property:', error);
    throw new Error('No se pudo crear la propiedad');
  }

  return newProp;
}

export async function updateProperty(id: string, data: Partial<Property>): Promise<Property | null> {
  const supabase = createServerSupabaseClient();
  const { data: updated, error } = await supabase
    .from('properties')
    .update({ ...data, updatedAt: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error || !updated) {
    console.error('Error updating property:', error);
    return null;
  }
  return updated as Property;
}

export async function deleteProperty(id: string): Promise<boolean> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting property:', error);
    return false;
  }
  return true;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    // Fallback to static just in case
    return (staticProperties as Property[]).find((p) => p.id === id) ?? null;
  }
  return data as Property;
}
