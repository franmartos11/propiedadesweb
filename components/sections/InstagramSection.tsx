'use client';

import * as React from 'react';
import Image from 'next/image';
import { Reveal } from '../ui/Reveal';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { properties } from '@/lib/data/properties';

const InstagramIcon = ({ size = 24, className = '' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export function InstagramSection() {
  const { trackInstagramClick } = useAnalytics();

  const feedImages = properties
    .filter(p => p.imagenes && p.imagenes[0] && p.imagenes[0] !== '/bg-1.jpg')
    .slice(0, 6)
    .map(p => p.imagenes[0]);

  while (feedImages.length < 6) {
    feedImages.push('/bg-1.jpg');
  }

  // Layout: 6 images in a magazine-style mosaic
  // [big] [tall] [square]
  // [sq ] [tall] [square]
  const layout = [
    'col-span-1 row-span-2',  // 0: tall left
    'col-span-1 row-span-1',  // 1: top center
    'col-span-1 row-span-1',  // 2: top right
    'col-span-1 row-span-1',  // 3: bottom center
    'col-span-1 row-span-1',  // 4: bottom right
    'col-span-1 row-span-1',  // 5: extra (hidden on small or overlap)
  ];

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-screen-xl">

        {/* Header row */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-14">
            <div className="flex items-center gap-5">
              <div className="w-px h-12 bg-brand" />
              <h2 className="font-serif text-3xl md:text-4xl text-foreground leading-tight">
                Inspiración diaria<br />
                <span className="italic text-brand">en tu feed</span>
              </h2>
            </div>
            <div className="flex flex-col md:items-end gap-4">
              <p className="font-sans text-gray text-sm leading-relaxed max-w-xs">
                Descubrí propiedades exclusivas, tips inmobiliarios y oportunidades antes que nadie.
              </p>
              <a
                href="https://www.instagram.com/villalba.martinez.inmobiliaria/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackInstagramClick('section')}
                className="group inline-flex items-center gap-3 border border-foreground/20 hover:border-brand hover:text-brand text-foreground font-sans text-xs uppercase tracking-[0.18em] px-6 py-3 transition-all duration-300"
              >
                <InstagramIcon size={15} />
                Seguinos en Instagram
              </a>
            </div>
          </div>
        </Reveal>

        {/* Mosaic grid */}
        <div className="grid grid-cols-3 md:grid-cols-[2fr_1.5fr_1.5fr] grid-rows-2 gap-2 md:gap-3 h-[420px] md:h-[520px]">
          {feedImages.slice(0, 5).map((src, idx) => (
            <Reveal
              key={idx}
              delay={idx * 0.08}
              className={idx === 0 ? 'row-span-2' : ''}
            >
              <a
                href="https://www.instagram.com/villalba.martinez.inmobiliaria/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block w-full h-full overflow-hidden bg-surface"
              >
                <Image
                  src={src}
                  alt={`Villalba Martinez en Instagram – foto ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.97]"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-400 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                    <InstagramIcon size={20} className="text-foreground" />
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
