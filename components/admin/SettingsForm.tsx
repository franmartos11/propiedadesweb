'use client';

import * as React from 'react';
import type { GlobalSettings } from '@/lib/data/settings';
import { Save, CheckCircle2 } from 'lucide-react';

export function SettingsForm({ initialSettings }: { initialSettings: GlobalSettings }) {
  const [settings, setSettings] = React.useState<GlobalSettings>(initialSettings);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl">
      <div className="flex flex-col gap-6">
        <div>
          <label className="block font-sans text-xs font-semibold text-gray uppercase tracking-wider mb-2">
            Número de WhatsApp
          </label>
          <input
            type="text"
            value={settings.whatsapp}
            onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white font-sans text-sm focus:outline-none focus:border-brand transition-colors"
            placeholder="Ej: 5493513200152"
          />
          <p className="font-sans text-xs text-white/30 mt-1">
            Usar formato internacional sin el "+" (Ej: 54 para Argentina).
          </p>
        </div>

        <div>
          <label className="block font-sans text-xs font-semibold text-gray uppercase tracking-wider mb-2">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white font-sans text-sm focus:outline-none focus:border-brand transition-colors"
          />
        </div>

        <div>
          <label className="block font-sans text-xs font-semibold text-gray uppercase tracking-wider mb-2">
            Enlace de Instagram
          </label>
          <input
            type="url"
            value={settings.instagram}
            onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white font-sans text-sm focus:outline-none focus:border-brand transition-colors"
          />
        </div>

        <div>
          <label className="block font-sans text-xs font-semibold text-gray uppercase tracking-wider mb-2">
            Dirección Física (Footer)
          </label>
          <input
            type="text"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white font-sans text-sm focus:outline-none focus:border-brand transition-colors"
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
        {saved ? (
          <span className="flex items-center gap-2 text-green-400 font-sans text-sm font-medium">
            <CheckCircle2 size={18} /> Guardado exitosamente
          </span>
        ) : <span />}
        
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-hover text-white font-sans text-sm uppercase tracking-widest rounded-lg transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
}
