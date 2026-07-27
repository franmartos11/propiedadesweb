import 'server-only';
import path from 'path';
import fs from 'fs';
import type { Property } from '@/lib/data/properties';

// ─── Tipos ────────────────────────────────────────────────────────────────────

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

// ─── Rutas de archivos ────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const PROPERTIES_FILE = path.join(DATA_DIR, 'properties.json');

function ensureFile(filePath: string, defaultContent: string) {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(filePath, defaultContent, 'utf-8');
  }
}

// ─── Leads ────────────────────────────────────────────────────────────────────

export function getLeads(): Lead[] {
  ensureFile(LEADS_FILE, '[]');
  return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8')) as Lead[];
}

export function saveLead(lead: Omit<Lead, 'id' | 'estado' | 'creadoEn'>): Lead {
  const leads = getLeads();
  const newLead: Lead = {
    ...lead,
    id: crypto.randomUUID(),
    estado: 'Nuevo',
    creadoEn: new Date().toISOString(),
  };
  leads.unshift(newLead);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  return newLead;
}

export function updateLead(id: string, updates: Partial<Lead>): Lead | null {
  const leads = getLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  leads[idx] = { ...leads[idx], ...updates };
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  return leads[idx];
}

// ─── Properties ───────────────────────────────────────────────────────────────

import { properties as staticProperties } from '@/lib/data/properties';
const staticPropertiesLoader = () => staticProperties as Property[];

export function getProperties(): Property[] {
  if (!fs.existsSync(PROPERTIES_FILE)) {
    return staticPropertiesLoader();
  }
  return JSON.parse(fs.readFileSync(PROPERTIES_FILE, 'utf-8')) as Property[];
}

export function seedPropertiesIfNeeded(): void {
  if (!fs.existsSync(PROPERTIES_FILE)) {
    const props = staticPropertiesLoader();
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(PROPERTIES_FILE, JSON.stringify(props, null, 2), 'utf-8');
  }
}

export function createProperty(data: Omit<Property, 'id' | 'slug' | 'updatedAt'>): Property {
  seedPropertiesIfNeeded();
  const props = getProperties();
  const id = `p${Date.now()}`;
  const slug = `propiedad-${id}`;
  const newProp: Property = {
    ...data,
    id,
    slug,
    updatedAt: new Date().toISOString(),
  };
  props.unshift(newProp);
  fs.writeFileSync(PROPERTIES_FILE, JSON.stringify(props, null, 2), 'utf-8');
  return newProp;
}

export function updateProperty(id: string, data: Partial<Property>): Property | null {
  seedPropertiesIfNeeded();
  const props = getProperties();
  const idx = props.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  props[idx] = { ...props[idx], ...data, updatedAt: new Date().toISOString() };
  fs.writeFileSync(PROPERTIES_FILE, JSON.stringify(props, null, 2), 'utf-8');
  return props[idx];
}

export function deleteProperty(id: string): boolean {
  seedPropertiesIfNeeded();
  const props = getProperties();
  const filtered = props.filter((p) => p.id !== id);
  if (filtered.length === props.length) return false;
  fs.writeFileSync(PROPERTIES_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}

export function getPropertyById(id: string): Property | null {
  return getProperties().find((p) => p.id === id) ?? null;
}
