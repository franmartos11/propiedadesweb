'use client';

import * as React from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { VirtualTourModal } from '@/components/ui/VirtualTourModal';

interface PropertyGalleryProps {
  images: string[];
  propertySlug?: string;
  tour360Urls?: string[];
}

export function PropertyGallery({ images, propertySlug = 'unknown', tour360Urls }: PropertyGalleryProps) {
  const [showCarousel, setShowCarousel] = React.useState(false);
  const [currentModalIndex, setCurrentModalIndex] = React.useState(0);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const { trackGalleryOpen } = useAnalytics();

  const openGallery = (index: number) => {
    setShowCarousel(true);
    setCurrentModalIndex(index);
    trackGalleryOpen(propertySlug, index);
  };

  const nextImage = React.useCallback(() => {
    setIsZoomed(false);
    setCurrentModalIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = React.useCallback(() => {
    setIsZoomed(false);
    setCurrentModalIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  React.useEffect(() => {
    if (!showCarousel) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setShowCarousel(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCarousel, nextImage, prevImage]);

  return (
    <>
      {/* Grilla de Fotos (Airbnb Style) */}
      <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12 flex gap-2">
        {/* Foto Principal */}
        <div 
          className="relative w-full md:w-2/3 h-full cursor-pointer group"
          onClick={() => openGallery(0)}
        >
          <Image 
            src={images[0] || '/bg-1.jpg'} 
            alt="Foto principal" 
            fill 
            className="object-cover group-hover:brightness-95 transition-all"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none md:hidden" />
          {tour360Urls && tour360Urls.length > 0 && (
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-10 pointer-events-auto">
              <VirtualTourModal tourUrls={tour360Urls} />
            </div>
          )}
        </div>
        {/* Fotos Secundarias (solo en desktop) */}
        <div className="hidden md:flex w-1/3 flex-col gap-2 h-full">
          <div 
            className="relative w-full h-1/2 cursor-pointer group"
            onClick={() => openGallery(1)}
          >
            <Image 
              src={images[1] || '/bg-2.jpg'} 
              alt="Foto secundaria 1" 
              fill 
              className="object-cover group-hover:brightness-95 transition-all"
            />
          </div>
          <div 
            className="relative w-full h-1/2 cursor-pointer group"
            onClick={() => openGallery(2)}
          >
            <Image 
              src={images[2] || '/bg-4.jpg'} 
              alt="Foto secundaria 2" 
              fill 
              className="object-cover group-hover:brightness-95 transition-all"
            />
          </div>
        </div>
        
        {/* Botón Ver todas las fotos */}
        <button 
          onClick={() => openGallery(0)}
          className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-white border border-border px-4 py-2 rounded-lg font-sans text-sm font-semibold shadow-sm hover:bg-gray-50 flex items-center gap-2 z-10"
        >
          Ver todas las fotos
        </button>
      </div>

      {/* Modal Lightbox */}
      {showCarousel && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm">
          {/* Header del Modal */}
          <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-[101]">
            <span className="text-white font-sans text-sm tracking-widest uppercase">
              {currentModalIndex + 1} / {images.length}
            </span>
            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
                className="text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                title="Zoom"
              >
                {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
              </button>
              <button 
                onClick={() => { setShowCarousel(false); setIsZoomed(false); }}
                className="text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Contenedor de la Imagen */}
          <div 
            className="relative w-full max-w-5xl h-[70vh] px-4 md:px-12 flex items-center justify-center flex-col overflow-hidden"
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <div className={`relative w-full h-full transition-transform duration-500 ease-out ${isZoomed ? 'scale-[2.5] cursor-zoom-out' : 'scale-100 cursor-zoom-in'}`}>
              <Image 
                src={images[currentModalIndex] || '/bg-1.jpg'}
                alt={`Imagen ${currentModalIndex + 1}`}
                fill
                className="object-contain"
                priority
                sizes="100vw"
              />
            </div>
          </div>

          {/* Flechas de Navegación */}
          {images.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/80 p-3 md:p-4 rounded-full transition-colors z-[101] backdrop-blur-md"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/80 p-3 md:p-4 rounded-full transition-colors z-[101] backdrop-blur-md"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Filmstrip (Miniaturas) */}
          <div className="absolute bottom-6 inset-x-0 px-4">
            <div className="flex gap-2 overflow-x-auto justify-start md:justify-center items-center py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setIsZoomed(false); setCurrentModalIndex(idx); }}
                  className={`relative h-16 w-24 shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${
                    currentModalIndex === idx ? 'ring-2 ring-white scale-110 opacity-100 z-10' : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  <Image src={img || '/bg-1.jpg'} alt={`Miniatura ${idx + 1}`} fill className="object-cover" sizes="96px" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
