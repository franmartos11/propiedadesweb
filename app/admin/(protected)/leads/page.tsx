import { requireAuth } from '@/lib/auth/session';
import { getLeads } from '@/lib/data/db';
import { LeadsTable } from '@/components/admin/LeadsTable';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  await requireAuth();
  
  const leads = await getLeads();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-white/30 mb-2">CRM</p>
        <h1 className="font-serif text-4xl text-white">Bandeja de Leads</h1>
      </div>
      
      <LeadsTable initialLeads={leads} />
    </div>
  );
}
