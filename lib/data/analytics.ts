import 'server-only';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export type AnalyticsEventType = 'property_view' | 'property_inquiry';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  propertyId: string;
  propertyType: 'Venta' | 'Arriendo';
  timestamp: string;
}

export async function getAnalyticsEvents(): Promise<AnalyticsEvent[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('analytics')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error || !data) {
    console.error('Error fetching analytics from Supabase:', error);
    return [];
  }
  return data as AnalyticsEvent[];
}

export async function trackEvent(data: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<AnalyticsEvent> {
  const supabase = createServerSupabaseClient();
  const newEvent: AnalyticsEvent = {
    ...data,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('analytics')
    .insert([newEvent]);

  if (error) {
    console.error('Error inserting analytics to Supabase:', error);
    // Don't throw to avoid crashing the user flow, just log it.
  }
  
  return newEvent;
}
