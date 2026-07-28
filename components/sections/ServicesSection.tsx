'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, X, CheckCircle2 } from 'lucide-react';
import { Reveal } from '../ui/Reveal';

interface Service {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  image: string;
  href: string;
  cta: string;
}

const services: Service[] = [
  {
    id: 'venta',
    number: '01',
    title: 'Venta de Inmuebles',
    tagline: 'Tu propiedad, el mejor precio.',
    description:
      'Realizamos una tasación profesional y diseñamos una estrategia de comercialización a medida. Te acompañamos en cada etapa del proceso: desde la primera visita hasta la firma de escritura, garantizando la mayor seguridad jurídica y el mejor resultado económico.',
    features: [
      'Tasación técnica sin cargo',
      'Fotografía y marketing digital de la propiedad',
      'Difusión en portales líderes y redes sociales',
      'Asesoramiento legal y notarial integral',
      'Gestión completa hasta escrituración',
    ],
    image: '/bg-1.jpg',
    href: '/venta',
    cta: 'Ver propiedades en venta',
  },
  {
    id: 'alquiler',
    number: '02',
    title: 'Alquileres Exclusivos',
    tagline: 'El hogar ideal te está esperando.',
    description:
      'Contamos con un portfolio actualizado de propiedades residenciales y comerciales. Seleccionamos rigurosamente a los arrendatarios mediante análisis crediticio y verificación de garantías, protegiendo tanto a propietarios como a inquilinos.',
    features: [
      'Búsqueda personalizada según tus necesidades',
      'Evaluación y selección de arrendatarios',
      'Contratos redactados con seguridad jurídica',
      'Gestión de garantías y avales',
      'Acompañamiento durante toda la relación contractual',
    ],
    image: '/bg-4.jpg',
    href: '/alquiler',
    cta: 'Ver propiedades en alquiler',
  },
  {
    id: 'administracion',
    number: '03',
    title: 'Administración de Propiedades',
    tagline: 'Tu propiedad trabaja. Tú descansas.',
    description:
      'Nuestro servicio de administración patrimonial está diseñado para propietarios que valoran su tiempo. Nos encargamos del ciclo completo de vida de tu inversión inmobiliaria, asegurando rentabilidad y tranquilidad absoluta.',
    features: [
      'Cobro y gestión mensual de alquileres',
      'Rendición mensual detallada',
      'Mantenimiento y coordinación de reparaciones',
      'Búsqueda y selección de arrendatarios',
      'Reportes mensuales de rentabilidad',
    ],
    image: '/bg-2.jpg',
    href: '/administracion',
    cta: 'Cotizar administración',
  },
];

export function ServicesSection() {
  const [activeService, setActiveService] = React.useState<Service | null>(null);

  // Cerrar con Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveService(null);
    };
    if (activeService) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeService]);

  return (
    <>
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

          {/* Services List */}
          <div className="flex flex-col divide-y divide-foreground/10">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={i * 0.12}>
                <button
                  onClick={() => setActiveService(service)}
                  className="group w-full text-left flex flex-row md:grid md:grid-cols-[80px_1fr_280px_48px] justify-between gap-4 md:gap-8 items-center py-6 md:py-10 hover:bg-white/60 transition-all duration-300 px-2 md:px-4 -mx-2 md:-mx-4 rounded-xl cursor-pointer"
                >
                  <div className="flex flex-col md:contents">
                    {/* Número */}
                    <span className="font-sans text-xs text-gray/50 tracking-[0.2em] hidden md:block">
                      {service.number}
                    </span>

                    {/* Título */}
                    <h3 className="font-serif text-2xl md:text-3xl text-foreground group-hover:text-brand transition-colors duration-300 mb-1 md:mb-0">
                      {service.title}
                    </h3>

                    {/* Tagline corta */}
                    <p className="font-sans text-gray text-sm leading-relaxed italic">
                      {service.tagline}
                    </p>
                  </div>

                  {/* Flecha */}
                  <div className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center group-hover:bg-brand group-hover:border-brand transition-all duration-300 shrink-0 self-start md:self-auto mt-1 md:mt-0">
                    <ArrowUpRight
                      size={18}
                      className="text-foreground group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                </button>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* ─── MODAL ──────────────────────────────────────── */}
      {activeService && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={() => setActiveService(null)}
          />

          {/* Panel */}
          <div className="relative z-10 w-full md:max-w-4xl bg-white shadow-2xl md:rounded-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] md:max-h-[85vh] animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">

            {/* Cerrar flotante para que siempre esté visible */}
            <button
              onClick={() => setActiveService(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center hover:bg-white transition-colors shadow-md"
              aria-label="Cerrar"
            >
              <X size={20} className="text-foreground" />
            </button>

            {/* Imagen */}
            <div className="relative w-full md:w-[42%] h-52 md:h-auto shrink-0">
              <Image
                src={activeService.image}
                alt={activeService.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent md:bg-gradient-to-r md:from-transparent md:to-foreground/10" />
              {/* Número superpuesto */}
              <span className="absolute bottom-4 left-5 font-serif text-6xl text-white/20 leading-none select-none">
                {activeService.number}
              </span>
            </div>

            {/* Contenido */}
            <div className="flex flex-col overflow-y-auto px-7 py-10 md:px-10 md:py-10 flex-1">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground leading-tight mb-2">
                {activeService.title}
              </h2>
              <p className="font-sans text-brand italic text-base mb-5">
                {activeService.tagline}
              </p>

              <p className="font-sans text-gray text-sm md:text-base leading-relaxed mb-7">
                {activeService.description}
              </p>

              {/* Features */}
              <ul className="flex flex-col gap-3 mb-8">
                {activeService.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 font-sans text-sm text-foreground">
                    <CheckCircle2 size={16} className="text-brand shrink-0 mt-0.5" />
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={activeService.href}
                onClick={() => setActiveService(null)}
                className="inline-flex items-center gap-2 bg-brand text-white font-sans text-xs uppercase tracking-[0.18em] px-7 py-4 hover:bg-foreground transition-colors duration-300 self-start"
              >
                {activeService.cta}
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
