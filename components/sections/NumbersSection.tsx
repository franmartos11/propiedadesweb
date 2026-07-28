'use client';

import * as React from 'react';
import Image from 'next/image';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Reveal } from '../ui/Reveal';

const stats = [
  { label: 'Años de experiencia en el mercado', value: 15, suffix: '+', prefix: '' },
  { label: 'Propiedades vendidas con éxito', value: 250, suffix: '+', prefix: '' },
  { label: 'Familias asesoradas anualmente', value: 400, suffix: '+', prefix: '' },
];

export function NumbersSection() {
  return (
    <section className="py-24 md:py-32 bg-surface overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-screen-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Lado Izquierdo: Imagen arquitectónica */}
          <Reveal>
            <div className="relative w-full aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/bg-2.jpg"
                alt="Arquitectura y diseño"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-brand/10 mix-blend-multiply" />
            </div>
          </Reveal>

          {/* Lado Derecho: Números e historia */}
          <div className="flex flex-col justify-center">
            <Reveal delay={0.2}>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight tracking-tight mb-8">
                Construimos relaciones basadas en <br className="hidden md:block"/>
                <span className="italic text-brand text-5xl md:text-6xl">confianza y resultados</span>
              </h2>
              <p className="font-sans text-gray text-lg leading-relaxed mb-16 max-w-lg">
                Nuestro profundo conocimiento del mercado cordobés nos permite asegurar el éxito en cada operación, cuidando el patrimonio de nuestros clientes como si fuera propio.
              </p>
            </Reveal>

            <div className="flex flex-col gap-10 border-l-2 border-border pl-8 md:pl-12">
              {stats.map((stat, i) => (
                <Reveal key={i} delay={0.4 + (i * 0.15)}>
                  <div className="flex flex-col">
                    <div className="font-serif text-5xl md:text-6xl text-foreground flex items-baseline gap-1 mb-2">
                      {stat.prefix && <span className="text-brand text-3xl mr-1">{stat.prefix}</span>}
                      <AnimatedNumber value={stat.value} className="text-foreground" />
                      <span className="text-brand text-4xl">{stat.suffix}</span>
                    </div>
                    <p className="font-sans text-gray text-xs uppercase tracking-[0.2em] font-medium max-w-[200px]">
                      {stat.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
