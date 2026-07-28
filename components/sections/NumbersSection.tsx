'use client';

import * as React from 'react';
import Image from 'next/image';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Reveal } from '../ui/Reveal';
import { Award, Key, Users } from 'lucide-react';

const stats = [
  { 
    label: 'Años de experiencia en el mercado', 
    value: 15, 
    suffix: '+', 
    icon: <Award size={32} strokeWidth={1.5} className="text-brand mb-4" />,
    colSpan: 'md:col-span-1 md:row-span-2'
  },
  { 
    label: 'Propiedades vendidas con éxito', 
    value: 250, 
    suffix: '+', 
    icon: <Key size={28} strokeWidth={1.5} className="text-brand mb-4" />,
    colSpan: 'md:col-span-1'
  },
  { 
    label: 'Familias asesoradas anualmente', 
    value: 400, 
    suffix: '+', 
    icon: <Users size={28} strokeWidth={1.5} className="text-brand mb-4" />,
    colSpan: 'md:col-span-1'
  },
];

export function NumbersSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-foreground">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-4.jpg"
          alt="Villalba Martinez Inmobiliaria"
          fill
          className="object-cover opacity-40 mix-blend-luminosity"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/95 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-transparent to-foreground/80" />
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 max-w-screen-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          
          {/* Lado Izquierdo: Text */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <Reveal delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                <span className="text-white/90 text-xs font-semibold tracking-widest uppercase">Nuestra Trayectoria</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight mb-8">
                Construimos relaciones basadas en <br className="hidden md:block"/>
                <span className="italic text-brand">confianza y resultados</span>
              </h2>
              <p className="font-sans text-white/70 text-lg leading-relaxed max-w-lg">
                Nuestro profundo conocimiento del mercado cordobés nos permite asegurar el éxito en cada operación, cuidando el patrimonio de nuestros clientes como si fuera propio. Nos avalan los resultados.
              </p>
            </Reveal>
          </div>

          {/* Lado Derecho: Bento Box Stats */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 md:auto-rows-fr">
            {stats.map((stat, i) => (
              <Reveal key={i} delay={0.3 + (i * 0.15)} className={stat.colSpan}>
                <div className={`
                  flex flex-col h-full justify-center p-8 lg:p-10 rounded-3xl
                  bg-white/5 hover:bg-white/10 border border-white/10
                  backdrop-blur-md transition-all duration-500 group
                  hover:-translate-y-1 hover:shadow-2xl hover:border-brand/30
                `}>
                  <div className="transform group-hover:scale-110 transition-transform duration-500 origin-left">
                    {stat.icon}
                  </div>
                  
                  <div className="font-serif text-5xl md:text-6xl lg:text-7xl text-white flex items-baseline gap-1 mb-3">
                    <AnimatedNumber value={stat.value} className="text-white drop-shadow-sm" />
                    <span className="text-brand text-4xl lg:text-5xl">{stat.suffix}</span>
                  </div>
                  
                  <p className="font-sans text-white/70 text-xs lg:text-sm uppercase tracking-[0.15em] font-medium leading-relaxed max-w-[200px]">
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
