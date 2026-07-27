import 'server-only';
import path from 'path';
import fs from 'fs';

export type AnalyticsEventType = 'property_view' | 'property_inquiry';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  propertyId: string;
  propertyType: 'Venta' | 'Arriendo';
  timestamp: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

function ensureFile() {
  if (!fs.existsSync(ANALYTICS_FILE)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(ANALYTICS_FILE, '[]', 'utf-8');
  }
}

export function getAnalyticsEvents(): AnalyticsEvent[] {
  ensureFile();
  return JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf-8')) as AnalyticsEvent[];
}

export function trackEvent(data: Omit<AnalyticsEvent, 'id' | 'timestamp'>): AnalyticsEvent {
  const events = getAnalyticsEvents();
  const newEvent: AnalyticsEvent = {
    ...data,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  events.push(newEvent);
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(events, null, 2), 'utf-8');
  return newEvent;
}
