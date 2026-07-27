'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export function AdminServicesSection() {
  return (
    <section className="py-24 md:py-32 bg-background border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          {/* Texto (60%) */}
          <div className="lg:col-span-7 pr-0 lg:pr-12">
            <Reveal direction="right">
              <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] mb-8">
                Tu propiedad trabaja.<br />
                <span className="italic text-brand">Tú descansas.</span>
              </h2>
              
              <p className="font-sans text-gray text-lg md:text-xl leading-relaxed mb-12 max-w-2xl">
                Nuestro servicio de administración patrimonial está diseñado para propietarios que valoran su tiempo. 
                Nos encargamos del ciclo completo de vida de tu inversión inmobiliaria, asegurando rentabilidad y tranquilidad.
              </p>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-16">
                {[
                  'Cobro y gestión mensual de alquilers',
                  'Mantenimiento y coordinación de reparaciones',
                  'Búsqueda y selección rigurosa de arrendatarios',
                  'Reportes mensuales de rentabilidad y gestión'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-brand mr-4 mt-1 font-sans text-sm">0{i + 1}</span>
                    <span className="font-sans text-foreground text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/administracion">
                <Button variant="line">Cotizar administración</Button>
              </Link>
            </Reveal>
          </div>

          {/* Imagen (40%) */}
          <div className="lg:col-span-5 relative">
            <Reveal direction="left" delay={0.2}>
              {/* Elemento decorativo */}
              <div className="absolute -top-8 -left-8 w-32 h-32 border-t border-l border-brand/30 z-0 hidden md:block" />
              
              <div className="relative z-10 w-full aspect-[3/4] overflow-hidden bg-surface">
                <Image
                  src="/bg-2.jpg" // A generar con IA
                  alt="Administración de propiedades premium"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-brand/10 mix-blend-multiply" />
              </div>
            </Reveal>
            
            {/* Elemento decorativo */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 border-b border-r border-gold/30 z-0 hidden md:block" />
          </div>

        </div>
      </div>
    </section>
  );
}
