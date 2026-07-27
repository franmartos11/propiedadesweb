'use client';

import * as React from 'react';
import Image from 'next/image';
import { properties } from '@/lib/data/properties';
import { Reveal } from '../ui/Reveal';
import { useAnalytics } from '@/lib/hooks/useAnalytics';

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export function InstagramSection() {
  const { trackInstagramClick } = useAnalytics();
  // Tomamos 6 imágenes para la grilla de Instagram
  // Filtramos las que tengan imagen válida y evitamos duplicados si es posible
  const feedImages = properties
    .filter(p => p.imagenes && p.imagenes[0] && p.imagenes[0] !== '/bg-1.jpg')
    .slice(0, 6)
    .map(p => p.imagenes[0]);

  // Si no hay suficientes reales, rellenamos con imágenes de muestra
  while (feedImages.length < 6) {
    feedImages.push('/bg-1.jpg');
  }

  return (
    <section className="py-20 md:py-32 bg-surface-hover overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Reveal direction="left">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand/10 text-brand">
                <InstagramIcon size={32} />
              </div>
              
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4 leading-tight">
                Inspiración diaria en tu feed
              </h2>
              
              <p className="font-sans text-gray text-base mb-8 max-w-md">
                Descubrí propiedades exclusivas, tips inmobiliarios y oportunidades antes que nadie.
              </p>
              
              <a
                href="https://www.instagram.com/villalba.martinez.inmobiliaria/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackInstagramClick('section')}
                className="inline-flex items-center gap-3 bg-foreground text-background font-sans text-sm uppercase tracking-widest px-8 py-4 hover:bg-brand transition-colors group"
              >
                Seguinos en Instagram
                <svg 
                  className="w-4 h-4 transform transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </Reveal>
          </div>

          {/* Grid de imágenes (estilo asimétrico) */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {feedImages.map((src, idx) => (
                <Reveal 
                  key={idx} 
                  delay={idx * 0.1}
                  className={
                    idx === 0 || idx === 3 ? "mt-4 md:mt-8" : 
                    idx === 1 || idx === 4 ? "-mt-4 md:-mt-8" : 
                    "mt-0"
                  }
                >
                  <a
                    href="https://www.instagram.com/villalba.martinez.inmobiliaria/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block aspect-square overflow-hidden bg-background"
                  >
                    <Image
                      src={src}
                      alt="Publicación de Instagram"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    {/* Overlay hover */}
                    <div className="absolute inset-0 bg-brand/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <InstagramIcon size={32} className="text-white" />
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
