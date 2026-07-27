import { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SearchLayout } from '@/components/sections/SearchLayout';
import { properties } from '@/lib/data/properties';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alquileres | Villalba Martinez',
  description: 'Propiedades en alquiler en Córdoba. Residencial y comercial.',
};

export default function AlquilerPage() {
  const alquilerProperties = properties.filter(p => p.tipo === 'Arriendo');

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-[72px]">
        <Suspense fallback={<div className="flex-1 min-h-[500px] flex items-center justify-center font-sans text-gray">Cargando buscador...</div>}>
          <SearchLayout initialProperties={alquilerProperties} title="Alquileres" from="alquiler" />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
