import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../ui/Reveal';

const services = [
  {
    id: 'venta',
    title: 'Venta de Inmuebles',
    description: 'Tasación profesional y comercialización. Te acompañamos en cada paso hasta el cierre con la mayor seguridad jurídica.',
    image: '/bg-1.jpg',
    href: '/venta',
  },
  {
    id: 'alquiler',
    title: 'Alquileres Exclusivos',
    description: 'Encontrá tu próximo hogar o local. Seleccionamos rigurosamente arrendatarios con garantías sólidas para tu tranquilidad.',
    image: '/bg-4.jpg',
    href: '/alquiler',
  },
  {
    id: 'administracion',
    title: 'Administración de Propiedades',
    description: 'Nos ocupamos de tu inversión: cobros, rendición mensual, mantenimiento y gestión integral de inquilinos.',
    image: '/bg-2.jpg',
    href: '/administracion',
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-6 md:px-12 max-w-screen-xl">

        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div className="max-w-2xl">

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight tracking-tight">
                El estándar de <span className="italic text-brand">excelencia</span> <br className="hidden md:block"/> en servicios inmobiliarios
              </h2>
            </div>
            <p className="font-sans text-gray max-w-sm text-sm md:text-base leading-relaxed md:pb-3">
              Más de 15 años acompañando a familias y empresas a tomar las decisiones más importantes para su futuro.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.15}>
              <Link
                href={service.href}
                className="group relative block w-full h-[500px] overflow-hidden bg-foreground rounded-2xl"
              >
                {/* Background Image */}
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-60"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

                {/* Content */}
                <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                  <h3 className="font-serif text-3xl md:text-4xl text-white mb-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    {service.title}
                  </h3>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <p className="font-sans text-white/80 text-sm md:text-base leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <div className="inline-flex items-center gap-2 text-brand font-sans text-xs uppercase tracking-[0.2em] font-medium">
                      Descubrir más <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
