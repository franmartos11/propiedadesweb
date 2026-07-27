import { notFound } from 'next/navigation';
import { getProperties } from '@/lib/data/db';
import Image from 'next/image';
import { Ruler, Bed, Bath, Car, Printer } from 'lucide-react';

export default async function FichaPropiedadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = getProperties().find(p => p.slug === slug);

  if (!property) {
    notFound();
  }

  const features = [
    { label: 'Superficie', value: `${property.m2Total} m²`, icon: Ruler },
    { label: 'Dormitorios', value: property.habitaciones, icon: Bed },
    { label: 'Baños', value: property.banos, icon: Bath },
    { label: 'Cocheras', value: property.estacionamientos, icon: Car },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Botón flotante para imprimir (solo pantalla, oculto en impresión) */}
      <div className="fixed bottom-8 right-8 print:hidden z-50">
        <button 
          onClick={() => window.print()} 
          className="flex items-center gap-2 bg-[#C1121F] text-white px-6 py-3 rounded-full font-sans text-sm shadow-xl hover:bg-red-700 transition-colors"
        >
          <Printer size={18} />
          Imprimir / Guardar PDF
        </button>
      </div>

      <div className="max-w-[21cm] mx-auto bg-white min-h-[29.7cm] p-12 print:p-0 print:m-0 shadow-2xl print:shadow-none">
        
        {/* Header con Logo */}
        <header className="flex justify-between items-end border-b-2 border-[#C1121F] pb-6 mb-8">
          <div className="relative w-48 h-16">
            <Image
              src="/logo-negro.jpg"
              alt="Villalba Martinez"
              fill
              className="object-contain object-left"
            />
          </div>
          <div className="text-right">
            <p className="font-serif text-2xl text-[#C1121F]">{property.tipo}</p>
            <p className="font-sans text-sm text-gray-500 uppercase tracking-widest">{property.barrio}, {property.comuna}</p>
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Título y Precio */}
          <div>
            <h1 className="font-serif text-4xl text-gray-900 mb-2 leading-tight">{property.nombre}</h1>
            <p className="font-serif text-3xl text-gray-700">
              {property.moneda} {property.precio.toLocaleString('es-AR')}
            </p>
          </div>

          {/* Imagen Principal */}
          {property.imagenes[0] && (
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 print:rounded-none">
              <Image
                src={property.imagenes[0]}
                alt={property.nombre}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Grilla de Características */}
          <div className="grid grid-cols-4 gap-4 py-6 border-y border-gray-200">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="flex flex-col items-center justify-center text-center">
                  <Icon size={24} className="text-[#C1121F] mb-2" />
                  <p className="font-sans text-xs uppercase tracking-widest text-gray-500 mb-1">{feat.label}</p>
                  <p className="font-serif text-xl text-gray-900">{feat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Descripción */}
          <div>
            <h2 className="font-sans text-sm uppercase tracking-widest text-[#C1121F] mb-4 font-bold">Descripción</h2>
            <div className="font-sans text-sm text-gray-700 leading-relaxed whitespace-pre-wrap columns-1 print:columns-2 gap-8">
              {property.descripcion}
            </div>
          </div>
        </div>

        {/* Footer / Contacto */}
        <div className="mt-12 pt-8 border-t-2 border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl text-gray-900 mb-3">Contacto Comercial</h3>
            <p className="font-sans text-sm text-gray-600 mb-1">📱 +54 9 351 320-0152 (WhatsApp)</p>
            <p className="font-sans text-sm text-gray-600 mb-1">📍 25 de Mayo 1040, B° General Paz, Córdoba</p>
            <p className="font-sans text-sm text-gray-600">✉ info@villalbamartinez.com</p>
          </div>
          
          <div className="text-right">
            {/* Si tuvieran un QR dinámico acá iría */}
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 mb-2">
              <p className="text-[10px] text-gray-400 text-center px-2">Escaneá para ver online</p>
            </div>
            <p className="font-sans text-[10px] uppercase text-gray-400 font-bold">CPI 7295</p>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 0; size: A4; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
          .print\\:hidden { display: none !important; }
        }
      `}} />
    </div>
  );
}
