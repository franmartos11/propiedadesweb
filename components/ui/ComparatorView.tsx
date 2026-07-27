'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useComparatorStore } from '@/store/comparator';
import type { Property } from '@/lib/data/db';
import { X, Bed, Bath, Maximize2, Car, MapPin } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';

export function ComparatorView({ allProperties }: { allProperties: Property[] }) {
  const { propertyIds, removeProperty } = useComparatorStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const properties = propertyIds
    .map((id) => allProperties.find((p) => p.id === id))
    .filter((p): p is Property => p !== undefined);

  if (properties.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-4xl mb-4">No hay propiedades seleccionadas</h1>
        <p className="font-sans text-gray mb-8">Navega por nuestro catálogo y selecciona las propiedades que deseas comparar.</p>
        <Link href="/venta" className="px-6 py-3 bg-brand text-white font-sans text-sm font-semibold rounded-lg hover:bg-brand-hover transition-colors">
          Explorar Propiedades
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-12 py-12">
      <div className="mb-10">
        <BackButton label="Volver atrás" />
        <h1 className="font-serif text-4xl md:text-5xl font-bold mt-6">Comparativa de Propiedades</h1>
        <p className="font-sans text-gray mt-2">Analiza detalladamente las opciones que seleccionaste.</p>
      </div>

      <div className="overflow-x-auto pb-8">
        <div className="min-w-[800px] flex gap-4 md:gap-8">
          {/* Columna de etiquetas (Headers de la tabla) */}
          <div className="w-48 shrink-0 flex flex-col justify-end pb-8 border-r border-border gap-y-6 pt-[250px]">
            <div className="h-10 font-sans text-sm font-semibold text-gray uppercase tracking-widest flex items-center">Precio</div>
            <div className="h-10 font-sans text-sm font-semibold text-gray uppercase tracking-widest flex items-center">Superficie Total</div>
            <div className="h-10 font-sans text-sm font-semibold text-gray uppercase tracking-widest flex items-center">Superficie Útil</div>
            <div className="h-10 font-sans text-sm font-semibold text-gray uppercase tracking-widest flex items-center">Dormitorios</div>
            <div className="h-10 font-sans text-sm font-semibold text-gray uppercase tracking-widest flex items-center">Baños</div>
            <div className="h-10 font-sans text-sm font-semibold text-gray uppercase tracking-widest flex items-center">Cocheras</div>
            <div className="h-10 font-sans text-sm font-semibold text-gray uppercase tracking-widest flex items-center">Barrio</div>
          </div>

          {/* Columnas de propiedades */}
          {properties.map((prop) => (
            <div key={prop.id} className="w-72 shrink-0 flex flex-col bg-white border border-border rounded-2xl overflow-hidden relative group">
              <button
                onClick={() => removeProperty(prop.id)}
                className="absolute top-2 right-2 p-1.5 bg-white/90 text-foreground hover:bg-brand hover:text-white rounded-full z-10 transition-colors shadow-sm cursor-pointer"
                title="Quitar"
              >
                <X size={16} />
              </button>

              <Link href={`/propiedades/${prop.slug}`} className="block relative w-full h-48 bg-surface-hover overflow-hidden">
                <Image
                  src={prop.imagenes?.[0] || '/bg-1.jpg'}
                  alt={prop.nombre}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              
              <div className="p-5 border-b border-border min-h-[100px]">
                <Link href={`/propiedades/${prop.slug}`}>
                  <h3 className="font-sans font-bold text-foreground text-lg leading-tight hover:text-brand transition-colors line-clamp-2">
                    {prop.nombre}
                  </h3>
                </Link>
                <span className={`inline-block mt-2 px-2 py-1 text-[10px] font-sans font-bold tracking-[0.2em] uppercase rounded-full ${prop.tipo === 'Venta' ? 'bg-brand/10 text-brand' : 'bg-foreground/10 text-foreground'}`}>
                  {prop.tipo}
                </span>
              </div>

              {/* Atributos */}
              <div className="flex flex-col gap-y-6 p-5">
                <div className="h-10 font-sans text-xl font-bold text-brand flex items-center">
                  {prop.moneda === 'USD' ? 'U$S' : '$'} {prop.precio.toLocaleString('es-AR')}
                </div>
                <div className="h-10 font-sans text-base flex items-center gap-2">
                  <Maximize2 size={16} className="text-gray" /> {prop.m2Total > 0 ? `${prop.m2Total} m²` : '-'}
                </div>
                <div className="h-10 font-sans text-base flex items-center gap-2">
                  <Maximize2 size={16} className="text-gray" /> {prop.m2Util > 0 ? `${prop.m2Util} m²` : '-'}
                </div>
                <div className="h-10 font-sans text-base flex items-center gap-2">
                  <Bed size={16} className="text-gray" /> {prop.habitaciones > 0 ? prop.habitaciones : '-'}
                </div>
                <div className="h-10 font-sans text-base flex items-center gap-2">
                  <Bath size={16} className="text-gray" /> {prop.banos > 0 ? prop.banos : '-'}
                </div>
                <div className="h-10 font-sans text-base flex items-center gap-2">
                  <Car size={16} className="text-gray" /> {prop.estacionamientos > 0 ? prop.estacionamientos : '0'}
                </div>
                <div className="h-10 font-sans text-sm flex items-center gap-2 text-foreground">
                  <MapPin size={16} className="text-brand shrink-0" /> <span className="line-clamp-1">{prop.barrio}</span>
                </div>
              </div>

              <div className="p-5 mt-auto border-t border-border bg-gray-50/50">
                <Link
                  href={`/propiedades/${prop.slug}#contact`}
                  className="block w-full text-center py-3 bg-brand text-white font-sans text-sm font-semibold rounded-lg hover:bg-brand-hover transition-colors"
                >
                  Consultar
                </Link>
              </div>
            </div>
          ))}

          {properties.length < 3 && (
            <div className="w-72 shrink-0 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-6 text-center bg-gray-50/30">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-gray">
                +
              </div>
              <p className="font-sans font-semibold text-foreground">Agregar propiedad</p>
              <p className="font-sans text-xs text-gray mt-2">Puedes comparar hasta 3 propiedades simultáneamente.</p>
              <Link href="/venta" className="mt-6 px-4 py-2 bg-white border border-border text-foreground font-sans text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                Buscar más
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
