import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../ui/Reveal';

const services = [
  {
    id: 'venta',
    number: '01',
    title: 'Venta de Inmuebles',
    description: 'Tasación profesional y comercialización. Te acompañamos en cada paso hasta el cierre con la mayor seguridad jurídica.',
    image: '/bg-1.jpg',
    href: '/venta',
  },
  {
    id: 'alquiler',
    number: '02',
    title: 'Alquileres Exclusivos',
    description: 'Encontrá tu próximo hogar o local. Seleccionamos rigurosamente arrendatarios con garantías sólidas para tu tranquilidad.',
    image: '/bg-4.jpg',
    href: '/alquiler',
  },
  {
    id: 'administracion',
    number: '03',
    title: 'Administración de Propiedades',
    description: 'Nos ocupamos de tu inversión: cobros, rendición mensual, mantenimiento y gestión integral de inquilinos.',
    image: '/bg-2.jpg',
    href: '/administracion',
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 md:py-32 bg-[#f5f3ef]">
      <div className="container mx-auto px-6 md:px-12 max-w-screen-xl">

        {/* Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-20 pb-8 border-b border-foreground/15">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight tracking-tight max-w-xl">
              El estándar de <span className="italic text-brand">excelencia</span>{' '}
              en servicios inmobiliarios
            </h2>
            <p className="font-sans text-gray max-w-xs text-sm leading-relaxed md:pb-1 shrink-0">
              Más de 15 años acompañando a familias y empresas a tomar las decisiones más importantes para su futuro.
            </p>
          </div>
        </Reveal>

        {/* Services List — editorial style */}
        <div className="flex flex-col divide-y divide-foreground/10">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.12}>
              <Link
                href={service.href}
                className="group grid grid-cols-1 md:grid-cols-[80px_1fr_280px_48px] gap-4 md:gap-8 items-center py-8 md:py-10 hover:bg-white/60 transition-colors duration-300 px-2 md:px-4 -mx-2 md:-mx-4 rounded-xl"
              >
                {/* Número */}
                <span className="font-sans text-xs text-gray/60 tracking-[0.2em] hidden md:block">
                  {service.number}
                </span>

                {/* Título */}
                <h3 className="font-serif text-2xl md:text-3xl text-foreground group-hover:text-brand transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Descripción */}
                <p className="font-sans text-gray text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Flecha */}
                <div className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center group-hover:bg-brand group-hover:border-brand transition-all duration-300 shrink-0 ml-auto md:ml-0">
                  <ArrowUpRight
                    size={18}
                    className="text-foreground group-hover:text-white transition-colors duration-300"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
