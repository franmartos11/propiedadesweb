import 'server-only';
import path from 'path';
import fs from 'fs';

export interface GlobalSettings {
  whatsapp: string;
  email: string;
  instagram: string;
  address: string;
}

const DEFAULT_SETTINGS: GlobalSettings = {
  whatsapp: '5493513200152',
  email: 'villalbamartinezprop@gmail.com',
  instagram: 'https://www.instagram.com/villalba.martinez.inmobiliaria/',
  address: 'Córdoba, Argentina'
};

const DATA_DIR = path.join(process.cwd(), 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

function ensureFile() {
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
  }
}

export function getSettings(): GlobalSettings {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8')) as GlobalSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function updateSettings(updates: Partial<GlobalSettings>): GlobalSettings {
  const current = getSettings();
  const next = { ...current, ...updates };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(next, null, 2), 'utf-8');
  return next;
}
