'use client';

import * as React from 'react';
import Image from 'next/image';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Reveal } from '../ui/Reveal';

const stats = [
  { label: 'Años en el mercado', value: 15, suffix: '+' },
  { label: 'Propiedades vendidas', value: 250, suffix: '+' },
  { label: 'Familias asesoradas', value: 400, suffix: '+' },
];

export function NumbersSection() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">

        {/* Imagen a pantalla completa - lado izquierdo */}
        <Reveal className="relative w-full h-[400px] lg:h-auto">
          <Image
            src="/bg-2.jpg"
            alt="Villalba Martinez Inmobiliaria – Córdoba"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* Franja de acento vertical */}
          <div className="absolute top-0 right-0 w-1 h-full bg-brand hidden lg:block" />
        </Reveal>

        {/* Lado derecho: texto + stats */}
        <div className="flex flex-col justify-center px-8 md:px-16 xl:px-24 py-20 bg-white">
          <Reveal delay={0.15}>
            <h2 className="font-serif text-4xl md:text-5xl xl:text-6xl text-foreground leading-[1.1] tracking-tight mb-6">
              Construimos relaciones<br />
              basadas en <span className="italic text-brand">confianza<br />y resultados</span>
            </h2>
            <p className="font-sans text-gray text-base md:text-lg leading-relaxed max-w-md mb-16">
              Nuestro profundo conocimiento del mercado cordobés nos permite asegurar el éxito en cada operación, cuidando el patrimonio de nuestros clientes como si fuera propio.
            </p>
          </Reveal>

          {/* Stats en fila horizontal con divisores */}
          <div className="grid grid-cols-3 divide-x divide-border border-t border-border pt-10">
            {stats.map((stat, i) => (
              <Reveal key={i} delay={0.3 + i * 0.12}>
                <div className="flex flex-col items-start px-0 first:pl-0 pl-6 pr-6">
                  <div className="font-serif text-4xl md:text-5xl xl:text-6xl text-foreground leading-none mb-2 flex items-end gap-0.5">
                    <AnimatedNumber value={stat.value} className="text-foreground" />
                    <span className="text-brand text-3xl md:text-4xl mb-1">{stat.suffix}</span>
                  </div>
                  <p className="font-sans text-gray text-xs uppercase tracking-[0.18em] leading-snug mt-1">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
