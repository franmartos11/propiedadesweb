'use client';

import * as React from 'react';
import type { Property } from '@/lib/data/db';
import { Search } from 'lucide-react';
import { PropertyRowActions } from '@/components/admin/PropertyRowActions';

export function PropertiesTable({ initialProperties }: { initialProperties: Property[] }) {
  const [properties, setProperties] = React.useState(initialProperties);
  const [search, setSearch] = React.useState('');
  const [filterTipo, setFilterTipo] = React.useState<'Todos' | 'Venta' | 'Arriendo'>('Todos');
  const [updating, setUpdating] = React.useState<string | null>(null);

  const filtered = properties.filter((p) => {
    const matchesSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) || 
                          p.barrio.toLowerCase().includes(search.toLowerCase()) ||
                          p.id.toLowerCase().includes(search.toLowerCase());
    const matchesTipo = filterTipo === 'Todos' || p.tipo === filterTipo;
    return matchesSearch && matchesTipo;
  });

  const handleToggleDestacada = async (id: string, current: boolean) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destacada: !current }),
      });
      if (res.ok) {
        setProperties((prev) => prev.map((p) => p.id === id ? { ...p, destacada: !current } : p));
      }
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[700px]">
      {/* Search & Filters */}
      <div className="p-5 border-b border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 bg-black/20 border border-white/10 rounded-lg px-3 py-2 w-full md:w-96">
          <Search size={16} className="text-white/30 shrink-0" />
          <input
            type="text"
            placeholder="Buscar por nombre, barrio o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white font-sans w-full placeholder:text-white/30"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {(['Todos', 'Venta', 'Arriendo'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterTipo(t)}
              className={`px-3 py-1.5 rounded-full font-sans text-xs transition-colors border ${
                filterTipo === t 
                  ? 'bg-white/10 text-white border-white/20' 
                  : 'bg-transparent text-white/40 border-white/5 hover:bg-white/5'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[40px_1fr_80px_120px_120px_100px_80px] gap-4 px-5 py-3 border-b border-white/5 shrink-0 bg-white/5">
        {['#', 'Propiedad', 'Tipo', 'Precio', 'Barrio', 'Destacada', 'Acción'].map((h) => (
          <p key={h} className="font-sans text-xs text-white/30 uppercase tracking-widest">{h}</p>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5 overflow-y-auto flex-1">
        {filtered.map((prop, idx) => (
          <div
            key={prop.id}
            className="grid grid-cols-[40px_1fr_80px_120px_120px_100px_80px] gap-4 items-center px-5 py-3 hover:bg-white/5 transition-colors"
          >
            {/* Index */}
            <p className="font-sans text-xs text-white/20">{idx + 1}</p>

            {/* Nombre + slug */}
            <div className="min-w-0 pr-4">
              <p className="font-sans text-sm text-white truncate font-medium">{prop.nombre}</p>
              <p className="font-sans text-[10px] text-white/30 truncate">{prop.id}</p>
            </div>

            {/* Tipo */}
            <span className={`px-2 py-1 rounded-full text-[10px] font-sans font-medium w-fit ${
              prop.tipo === 'Venta'
                ? 'bg-blue-500/10 text-blue-400'
                : 'bg-green-500/10 text-green-400'
            }`}>
              {prop.tipo}
            </span>

            {/* Precio */}
            <p className="font-sans text-xs text-white/60 whitespace-nowrap">
              {prop.moneda} {prop.precio.toLocaleString('es-AR')}
            </p>

            {/* Barrio */}
            <p className="font-sans text-xs text-white/40 truncate">
              {prop.barrio}
            </p>

            {/* Toggle Destacada */}
            <div className="flex items-center">
              <button
                onClick={() => handleToggleDestacada(prop.id, prop.destacada || false)}
                disabled={updating === prop.id}
                className={`w-10 h-5 rounded-full relative transition-colors disabled:opacity-50 ${
                  prop.destacada ? 'bg-brand' : 'bg-white/10'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all ${
                  prop.destacada ? 'left-[22px]' : 'left-[3px]'
                }`} />
              </button>
            </div>

            {/* Acción */}
            <div className="flex items-center gap-2">
              <PropertyRowActions id={prop.id} slug={prop.slug} />
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-10 text-center">
            <p className="font-sans text-white/30 text-sm">No se encontraron propiedades.</p>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-white/5 text-center shrink-0">
        <p className="font-sans text-[10px] text-white/30 uppercase tracking-widest">
          Mostrando {filtered.length} propiedades
        </p>
      </div>
    </div>
  );
}
