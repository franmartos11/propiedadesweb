import 'server-only';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { unstable_cache, revalidateTag } from 'next/cache';

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

export const getSettings = unstable_cache(
  async (): Promise<GlobalSettings> => {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('settings')
      .select('whatsapp, email, instagram, address')
      .eq('id', 'global')
      .single();

    if (error || !data) {
      return DEFAULT_SETTINGS;
    }
    return data as GlobalSettings;
  },
  ['global-settings'],
  { tags: ['settings'], revalidate: 3600 }
);

export async function updateSettings(updates: Partial<GlobalSettings>): Promise<GlobalSettings> {
  const supabase = createServerSupabaseClient();
  const current = await getSettings();
  const next = { ...current, ...updates };

  const { error } = await supabase
    .from('settings')
    .upsert({ id: 'global', ...next });

  if (error) {
    console.error('Error updating settings in Supabase:', error);
    throw new Error('Could not update settings');
  }

  revalidateTag('settings', 'max');
  return next;
}
