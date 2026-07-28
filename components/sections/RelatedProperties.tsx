'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/lib/data/properties';
import { Bed, Bath, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  properties: Property[];
}

export function RelatedProperties({ properties }: Props) {
  if (properties.length === 0) return null;

  return (
    <section className="pt-12 border-t border-border">
      <h2 className="font-sans text-2xl font-bold text-foreground mb-8">Propiedades similares</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {properties.map((p, i) => {
          const priceLabel = p.moneda === 'USD'
            ? `U$S ${p.precio.toLocaleString('es-AR')}`
            : `$ ${p.precio.toLocaleString('es-AR')}`;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/propiedades/${p.slug}`}
                className="group flex flex-col bg-white rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.imagenes?.[0] || '/bg-1.jpg'}
                    alt={p.nombre}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-sans font-bold tracking-widest uppercase text-white rounded-full ${p.tipo === 'Venta' ? 'bg-brand/90' : 'bg-foreground/90'}`}>
                    {p.tipo}
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <p className="font-sans font-bold text-brand text-lg">{priceLabel}</p>
                  <p className="font-sans text-sm text-foreground font-medium line-clamp-1">{p.nombre}</p>
                  <p className="font-sans text-xs text-gray">{p.barrio}</p>
                  <div className="flex items-center gap-3 text-gray mt-1">
                    <span className="flex items-center gap-1 text-xs"><Bed size={12} />{p.habitaciones > 0 ? p.habitaciones : '-'} dorm.</span>
                    <span className="flex items-center gap-1 text-xs"><Bath size={12} />{p.banos > 0 ? p.banos : '-'} baño{p.banos !== 1 ? 's' : ''}</span>
                    <span className="flex items-center gap-1 text-xs"><Maximize2 size={12} />{p.m2Total > 0 ? p.m2Total : (p.m2Util > 0 ? p.m2Util : '-')} m²</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
