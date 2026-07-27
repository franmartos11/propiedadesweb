import { requireAuth } from '@/lib/auth/session';
import { PropertyForm } from '@/components/admin/PropertyForm';
import { getPropertyById } from '@/lib/data/db';
import { notFound } from 'next/navigation';

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();

  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="mb-10">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-white/30 mb-2">Catálogo</p>
        <h1 className="font-serif text-4xl text-white">Editar Propiedad</h1>
      </div>
      
      <PropertyForm initialData={property} isEdit />
    </div>
  );
}
