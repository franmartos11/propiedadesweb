import { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SearchLayout } from '@/components/sections/SearchLayout';
import { properties } from '@/lib/data/properties';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Propiedades en Venta | Villalba Martinez',
  description: 'Catálogo de propiedades exclusivas en venta en Córdoba y alrededores.',
};

export default function VentaPage() {
  const ventaProperties = properties.filter(p => p.tipo === 'Venta');

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-[72px]">
        <Suspense fallback={<div className="flex-1 min-h-[500px] flex items-center justify-center font-sans text-gray">Cargando buscador...</div>}>
          <SearchLayout initialProperties={ventaProperties} title="Propiedades en Venta" from="venta" />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
