import { requireAuth } from '@/lib/auth/session';
import { PropertyForm } from '@/components/admin/PropertyForm';

export default async function NewPropertyPage() {
  await requireAuth();

  return (
    <div className="p-8">
      <div className="mb-10">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-white/30 mb-2">Catálogo</p>
        <h1 className="font-serif text-4xl text-white">Nueva Propiedad</h1>
      </div>
      
      <PropertyForm />
    </div>
  );
}
