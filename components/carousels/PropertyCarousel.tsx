'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/lib/data/properties';
import { Badge } from '../ui/Badge';
import { PropertyTypeTab } from '../ui/PropertyTypeTab';
import { useCarousel } from '@/lib/hooks/useCarousel';

interface PropertyCarouselProps {
  properties: Property[];
}

export function PropertyCarousel({ properties: allProperties }: PropertyCarouselProps) {
  const [activeTab, setActiveTab] = React.useState<'Venta' | 'Alquiler'>('Venta');
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  
  const filteredProperties = React.useMemo(
    () => allProperties.filter((p) => p.tipo === activeTab),
    [allProperties, activeTab]
  );
  
  const { activeIndex } = useCarousel(filteredProperties.length, scrollerRef);

  // Fallback para navegadores sin soporte de scroll-driven animations
  React.useEffect(() => {
    if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const entries = Array.from(scroller.children) as HTMLElement[];
      const animations = new Map<HTMLElement, Animation>();

      entries.forEach(entry => {
        const animation = entry.animate(
          {
            transform: ['scale(0.92)', 'scale(1)', 'scale(0.92)'],
            opacity: ['0.6', '1', '0.6']
          },
          {
            duration: 1,
            fill: 'both'
          }
        );
        animation.pause();
        animations.set(entry, animation);
      });

      const tick = () => {
        const scrollerRect = scroller.getBoundingClientRect();
        entries.forEach(entry => {
          const animation = animations.get(entry);
          if (!animation) return;

          const entryRect = entry.getBoundingClientRect();
          const progress = (entryRect.left + entryRect.width / 2 - scrollerRect.left) / scrollerRect.width;
          
          animation.currentTime = progress;
        });
      };
        
      scroller.addEventListener('scroll', tick, { passive: true });
      tick();
      
      return () => {
        scroller.removeEventListener('scroll', tick);
        animations.forEach(anim => anim.cancel());
      };
    }
  }, [filteredProperties]);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 px-4 md:px-12">
        <PropertyTypeTab activeTab={activeTab} onChange={setActiveTab} className="mb-0" />
        
        <div className="hidden sm:flex text-gold font-sans tracking-widest text-sm">
          {String(activeIndex + 1).padStart(2, '0')} / {String(filteredProperties.length).padStart(2, '0')}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes carousel-item-focus {
          0% { transform: scale(0.92); opacity: 0.6; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.92); opacity: 0.6; }
        }
        .carousel-item {
          animation: carousel-item-focus auto linear both;
          animation-timeline: view(inline);
        }
      `}} />

      <ul 
        ref={scrollerRef}
        className="flex gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 md:px-12 pb-12 pt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {filteredProperties.map((property, idx) => (
          <li 
            key={property.id} 
            className={`carousel-item snap-center shrink-0 relative group ${idx === 0 ? 'w-[85vw] md:w-[60vw]' : 'w-[85vw] md:w-[40vw]'}`}
            style={{ viewTimelineName: `--item-${idx}`, viewTimelineAxis: 'inline' }}
          >
            <Link href={`/propiedades/${property.slug}`} className="block relative w-full aspect-[4/5] md:aspect-[16/9] overflow-hidden bg-surface">
              <Image
                src={property.imagenes?.[0] || '/bg-1.jpg'}
                alt={property.nombre}
                fill
                sizes={idx === 0 ? '(max-width: 768px) 85vw, 60vw' : '(max-width: 768px) 85vw, 40vw'}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority={idx === 0}
              />
              
              <div className="absolute top-6 left-6">
                <Badge type={property.tipo === 'Venta' ? 'VENTA' : 'ALQUILER'} />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col justify-end">
                <h3 className="text-white/70 text-xs md:text-sm tracking-[0.2em] uppercase mb-2">
                  {property.tipo} · {property.barrio}
                </h3>
                <p className="text-white font-serif text-3xl md:text-4xl mb-3 leading-none">
                  {property.moneda === 'USD' ? 'U$S ' : '$ '}
                  {property.precio.toLocaleString('es-AR')}
                </p>
                <div className="text-white/60 font-sans text-sm flex items-center gap-4">
                  <span>{property.m2Util} m²</span>
                  <span>·</span>
                  <span>{property.habitaciones} D</span>
                  <span>·</span>
                  <span>{property.banos} B</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
