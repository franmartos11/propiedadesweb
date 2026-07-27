import { requireAuth } from '@/lib/auth/session';
import { getProperties, getLeads } from '@/lib/data/db';
import { Building2, TrendingUp, Home, Eye, Users } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'red',
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color?: 'red' | 'blue' | 'green' | 'amber';
}) {
  const colors = {
    red: 'bg-red-500/10 text-red-400',
    blue: 'bg-blue-500/10 text-blue-400',
    green: 'bg-green-500/10 text-green-400',
    amber: 'bg-amber-500/10 text-amber-400',
  };
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="font-serif text-3xl text-white mb-1">{value}</p>
      <p className="font-sans text-sm font-semibold text-white/70 mb-1">{title}</p>
      <p className="font-sans text-xs text-white/30">{subtitle}</p>
    </div>
  );
}

export default async function AdminDashboard() {
  await requireAuth();

  const properties = await getProperties();
  const leads = await getLeads();

  const totalProps = properties.length;
  const enVenta = properties.filter((p) => p.tipo === 'Venta').length;
  const enAlquiler = properties.filter((p) => p.tipo === 'Arriendo').length;
  const destacadas = properties.filter((p) => p.destacada).length;
  const leadsNuevos = leads.filter((l) => l.estado === 'Nuevo').length;

  const recientes = [...properties]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-white/30 mb-2">Panel de Control</p>
        <h1 className="font-serif text-4xl text-white">Dashboard</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 mb-10">
        <KpiCard
          title="Total Propiedades"
          value={totalProps}
          subtitle="En el catálogo activo"
          icon={Building2}
          color="red"
        />
        <KpiCard
          title="En Venta"
          value={enVenta}
          subtitle="Propiedades de venta"
          icon={Home}
          color="blue"
        />
        <KpiCard
          title="En Alquiler"
          value={enAlquiler}
          subtitle="Propiedades de alquiler"
          icon={TrendingUp}
          color="green"
        />
        <KpiCard
          title="Destacadas"
          value={destacadas}
          subtitle="Visibles en el home"
          icon={Eye}
          color="amber"
        />
        <KpiCard
          title="Leads Nuevos"
          value={leadsNuevos}
          subtitle="Sin contactar"
          icon={Users}
          color="blue"
        />
      </div>

      {/* Propiedades recientes */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-sans text-sm font-semibold text-white uppercase tracking-widest">
            Propiedades Recientes
          </h2>
          <Link
            href="/admin/propiedades"
            className="font-sans text-xs text-[#C1121F] hover:text-red-300 transition-colors uppercase tracking-widest"
          >
            Ver todas →
          </Link>
        </div>

        <div className="divide-y divide-white/5">
          {recientes.map((prop) => (
            <div key={prop.id} className="flex items-center gap-4 p-5 hover:bg-white/5 transition-colors">
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/10 shrink-0">
                {prop.imagenes?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={prop.imagenes[0]}
                    alt={prop.nombre}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm text-white font-medium truncate">{prop.nombre}</p>
                <p className="font-sans text-xs text-white/40 truncate">{prop.barrio} · {prop.comuna}</p>
              </div>

              {/* Tipo */}
              <span className={`px-2 py-1 rounded-full text-xs font-sans font-medium shrink-0 ${
                prop.tipo === 'Venta'
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'bg-green-500/10 text-green-400'
              }`}>
                {prop.tipo}
              </span>

              {/* Precio */}
              <p className="font-serif text-sm text-white shrink-0 hidden md:block">
                {prop.moneda === 'USD' ? 'USD' : 'ARS'} {prop.precio.toLocaleString('es-AR')}
              </p>

              {/* Acciones */}
              <Link
                href={`/admin/propiedades/${prop.id}/editar`}
                className="font-sans text-xs text-white/30 hover:text-white transition-colors shrink-0"
              >
                Editar
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
