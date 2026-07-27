'use client';

import * as React from 'react';
import type { Lead, LeadStatus } from '@/lib/data/db';

const STATUS_OPTIONS: LeadStatus[] = ['Nuevo', 'Contactado', 'En seguimiento', 'Cerrado'];

const STATUS_STYLES: Record<LeadStatus, string> = {
  Nuevo: 'bg-red-500/10 text-red-400 border-red-500/20',
  Contactado: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'En seguimiento': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Cerrado: 'bg-green-500/10 text-green-400 border-green-500/20',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {

  const [leads, setLeads] = React.useState(initialLeads);
  const [filter, setFilter] = React.useState<LeadStatus | 'Todos'>('Todos');
  const [updating, setUpdating] = React.useState<string | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [notesDraft, setNotesDraft] = React.useState<string>('');

  const filtered = filter === 'Todos' ? leads : leads.filter((l) => l.estado === filter);

  const handleStatusChange = async (id: string, estado: LeadStatus) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, estado } : l)));
      }
    } finally {
      setUpdating(null);
    }
  };

  const handleSaveNotes = async (id: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notas: notesDraft }),
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notas: notesDraft } : l)));
        setExpandedId(null);
      }
    } finally {
      setUpdating(null);
    }
  };

  const toggleNotes = (id: string, currentNotes: string | undefined) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setNotesDraft(currentNotes || '');
    }
  };

  return (
    <div>
      {/* Filtros por estado */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['Todos', ...STATUS_OPTIONS] as const).map((s) => {
          const count = s === 'Todos' ? leads.length : leads.filter((l) => l.estado === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full font-sans text-xs font-semibold transition-all border ${
                filter === s
                  ? 'bg-white/10 text-white border-white/20'
                  : 'text-white/30 border-white/5 hover:text-white/60 hover:border-white/10'
              }`}
            >
              {s} <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center">
          <p className="font-sans text-white/20 text-sm">No hay leads en esta categoría todavía.</p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {filtered.map((lead) => (
              <div key={lead.id} className="p-5 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  {/* Info del lead */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-sans text-sm text-white font-semibold">{lead.nombre}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider border ${STATUS_STYLES[lead.estado]}`}>
                        {lead.estado}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-sans text-white/40">
                      <span>📱 {lead.telefono}</span>
                      {lead.email && <span>✉ {lead.email}</span>}
                      <span>🏷 {lead.servicio}</span>
                      <span>🕐 {formatDate(lead.creadoEn)}</span>
                    </div>
                    {lead.mensaje && (
                      <p className="mt-2 font-sans text-xs text-white/30 leading-relaxed line-clamp-2">
                        &quot;{lead.mensaje}&quot;
                      </p>
                    )}
                  </div>

                  {/* Cambiar estado y acciones */}
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <select
                      value={lead.estado}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                      disabled={updating === lead.id}
                      className="bg-white/5 border border-white/10 text-white/60 font-sans text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-white/30 disabled:opacity-40 cursor-pointer"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-[#111] text-white">{s}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => toggleNotes(lead.id, lead.notas)}
                      className="text-xs font-sans text-white/30 hover:text-white transition-colors"
                    >
                      {lead.notas ? '📝 Ver notas' : '+ Agregar nota'}
                    </button>
                  </div>
                </div>

                {/* Editor de Notas */}
                {expandedId === lead.id && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <label className="block font-sans text-xs uppercase tracking-widest text-white/40 mb-2">
                      Notas Internas
                    </label>
                    <textarea
                      value={notesDraft}
                      onChange={(e) => setNotesDraft(e.target.value)}
                      placeholder="Ej: Lo llamé y le interesó la propiedad de Nueva Córdoba..."
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white font-sans focus:outline-none focus:border-brand min-h-[80px]"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleSaveNotes(lead.id)}
                        disabled={updating === lead.id}
                        className="bg-white/10 hover:bg-white/20 text-white text-xs font-sans px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                      >
                        {updating === lead.id ? 'Guardando...' : 'Guardar notas'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
