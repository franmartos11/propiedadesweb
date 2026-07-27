import { requireAuth } from '@/lib/auth/session';
import { getProperties } from '@/lib/data/db';
import { getAnalyticsEvents } from '@/lib/data/analytics';
import { AnalyticsDashboardClient } from '@/components/admin/AnalyticsDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  await requireAuth();

  const properties = await getProperties();
  const events = await getAnalyticsEvents();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-white/30 mb-2">Métricas</p>
        <h1 className="font-serif text-4xl text-white">Analítica</h1>
      </div>

      <AnalyticsDashboardClient events={events} properties={properties} />
    </div>
  );
}
