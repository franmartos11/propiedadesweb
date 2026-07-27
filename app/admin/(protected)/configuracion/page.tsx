import { requireAuth } from '@/lib/auth/session';
import { getSettings } from '@/lib/data/settings';
import { SettingsForm } from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  await requireAuth();
  const settings = await getSettings();

  return (
    <div className="p-8">
      <div className="mb-10">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-white/30 mb-2">Sistema</p>
        <h1 className="font-serif text-4xl text-white">Configuración Global</h1>
      </div>

      <div className="mb-8 max-w-2xl">
        <p className="font-sans text-white/60 text-sm leading-relaxed">
          Los datos que modifiques aquí se actualizarán automáticamente en toda la página web (botones de WhatsApp, enlaces sociales y el pie de página).
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
