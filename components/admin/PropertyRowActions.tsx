'use client';

import * as React from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Eye, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function PropertyRowActions({ id, slug }: { id: string, slug: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que querés eliminar esta propiedad?')) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/propiedades/${slug}`}
        target="_blank"
        className="p-2 text-white/30 hover:text-white transition-colors rounded-lg hover:bg-white/10"
        title="Ver en el sitio"
      >
        <Eye size={14} />
      </Link>
      <Link
        href={`/propiedades/${slug}/ficha`}
        target="_blank"
        className="p-2 text-white/30 hover:text-white transition-colors rounded-lg hover:bg-white/10"
        title="Ver Ficha PDF"
      >
        <FileText size={14} />
      </Link>
      <Link
        href={`/admin/propiedades/${id}/editar`}
        className="p-2 text-white/30 hover:text-white transition-colors rounded-lg hover:bg-white/10"
        title="Editar"
      >
        <Pencil size={14} />
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 text-white/30 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10 disabled:opacity-50"
        title="Eliminar"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
