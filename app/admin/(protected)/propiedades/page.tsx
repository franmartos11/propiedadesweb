import { requireAuth } from '@/lib/auth/session';
import { getProperties } from '@/lib/data/db';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { PropertiesTable } from '@/components/admin/PropertiesTable';

export const dynamic = 'force-dynamic';

export default async function AdminPropertiesPage() {
  await requireAuth();

  const properties = getProperties();

  const enVenta = properties.filter((p) => p.tipo === 'Venta').length;
  const enAlquiler = properties.filter((p) => p.tipo === 'Arriendo').length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-white/30 mb-2">Gestión</p>
          <h1 className="font-serif text-4xl text-white">Propiedades</h1>
        </div>
        <Link
          href="/admin/propiedades/nueva"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#C1121F] hover:bg-[#A00F18] text-white font-sans text-sm uppercase tracking-widest rounded-xl transition-all"
        >
          <Plus size={16} />
          Nueva Propiedad
        </Link>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total', value: properties.length, color: 'text-white' },
          { label: 'Venta', value: enVenta, color: 'text-blue-400' },
          { label: 'Alquiler', value: enAlquiler, color: 'text-green-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className={`font-serif text-2xl ${stat.color}`}>{stat.value}</p>
            <p className="font-sans text-xs text-white/40 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <PropertiesTable initialProperties={properties} />
    </div>
  );
}
