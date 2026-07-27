'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/lib/data/properties';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface EditorialGridProps {
  properties: Property[];
  title?: string;
  linkText?: string;
  linkHref?: string;
}

export function EditorialGrid({ 
  properties, 
  title = "Selección Exclusiva",
  linkText = "Ver Catálogo Completo",
  linkHref = "/venta"
}: EditorialGridProps) {
  // Tomamos solo las primeras 3 propiedades para el layout asimétrico
  const displayProperties = properties.slice(0, 3);
  
  if (displayProperties.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-bg-light text-fg-light">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl max-w-lg leading-tight">
            {title}
          </h2>
          <Link href={linkHref}>
            <Button variant="line" className="!text-fg-light hover:!text-gold">
              {linkText}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-12">
          {/* Main Large Card (Left) */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col group">
            <Link href={`/propiedades/${displayProperties[0]?.slug}`} className="block relative w-full aspect-[4/3] md:aspect-video overflow-hidden bg-surface mb-6">
              <Image
                src={displayProperties[0]?.imagenes?.[0] || '/bg-1.jpg'}
                alt={displayProperties[0]?.nombre}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <div className="absolute top-6 left-6">
                <Badge type={displayProperties[0]?.tipo === 'Venta' ? 'VENTA' : 'ALQUILER'} />
              </div>
            </Link>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif text-3xl mb-2">{displayProperties[0]?.nombre}</h3>
                <p className="font-sans text-gray text-sm uppercase tracking-widest">{displayProperties[0]?.barrio}, {displayProperties[0]?.comuna}</p>
              </div>
              <p className="font-sans font-medium text-xl">
                {displayProperties[0]?.moneda === 'USD' ? 'U$S ' : '$ '}
                {displayProperties[0]?.precio.toLocaleString('es-AR')}
              </p>
            </div>
          </div>

          {/* Secondary Stacked Cards (Right) */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-12 mt-12 md:mt-24">
            {displayProperties.slice(1).map((property) => (
              <div key={property.id} className="flex flex-col group">
                <Link href={`/propiedades/${property.slug}`} className="block relative w-full aspect-[4/5] overflow-hidden bg-surface mb-6">
                  <Image
                    src={property.imagenes?.[0] || '/bg-1.jpg'}
                    alt={property.nombre}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge type={property.tipo === 'Venta' ? 'VENTA' : 'ALQUILER'} />
                  </div>
                </Link>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-xl mb-1">{property.nombre}</h3>
                    <p className="font-sans text-gray text-xs uppercase tracking-widest">{property.barrio}</p>
                  </div>
                  <p className="font-sans font-medium">
                    {property.moneda === 'USD' ? 'U$S ' : '$ '}
                    {property.precio.toLocaleString('es-AR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
