'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { VirtualTour360 } from './VirtualTour360';
import { View, X } from 'lucide-react';

export type TourScene = { url: string; name: string };

interface VirtualTourModalProps {
  tourUrls: (string | TourScene)[];
}

function normalizeScene(item: string | TourScene, idx: number): TourScene {
  return typeof item === 'string'
    ? { url: item, name: `Escena ${idx + 1}` }
    : item;
}

export function VirtualTourModal({ tourUrls }: VirtualTourModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);
  const [fading, setFading] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!tourUrls || tourUrls.length === 0) return null;

  const scenes = tourUrls.map(normalizeScene);
  const currentScene = scenes[currentIndex];

  const changeScene = (idx: number) => {
    if (idx === currentIndex) return;
    setFading(true);
    setTimeout(() => {
      setCurrentIndex(idx);
      setFading(false);
    }, 280);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentIndex(0);
    setFading(false);
  };

  return (
    <>
      {/* Botón de apertura */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className="flex items-center gap-2 px-6 py-3 bg-[#C1121F] text-white rounded-xl font-sans text-sm uppercase tracking-widest font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-red-500/30"
      >
        <View size={18} />
        Recorrido 360º
      </button>

      {isOpen && mounted && createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-full flex flex-col bg-black">

            {/* ── Header Flotante ── */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
              <div className="flex items-center gap-3 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-[#C1121F] animate-pulse" />
                <span className="text-white font-sans text-sm font-semibold tracking-widest uppercase">
                  {currentScene.name}
                </span>
              </div>
              <button
                className="pointer-events-auto p-2.5 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                onClick={handleClose}
                aria-label="Cerrar recorrido"
              >
                <X size={22} />
              </button>
            </div>

            {/* ── Visor 360 con fade ── */}
            <div
              className={`flex-1 w-full transition-opacity duration-[280ms] ease-in-out ${fading ? 'opacity-0' : 'opacity-100'}`}
            >
              <VirtualTour360 imageUrl={currentScene.url} isActive={isOpen} />
            </div>

            {/* ── Carrusel de Miniaturas ── */}
            {scenes.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent pt-16 pb-5 px-4">
                <div className="flex gap-3 overflow-x-auto justify-center items-end [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {scenes.map((scene, idx) => (
                    <button
                      key={idx}
                      onClick={() => changeScene(idx)}
                      className={`flex flex-col items-center gap-1.5 shrink-0 group transition-all duration-300 ${
                        currentIndex === idx ? 'scale-110' : 'opacity-50 hover:opacity-80'
                      }`}
                    >
                      {/* Thumbnail placeholder — color sólido identificador */}
                      <div
                        className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          currentIndex === idx
                            ? 'border-[#C1121F] shadow-lg shadow-red-500/40'
                            : 'border-white/20 group-hover:border-white/50'
                        }`}
                        style={{ background: `hsl(${(idx * 60) % 360}, 30%, 20%)` }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <View size={18} className="text-white/70" />
                        </div>
                      </div>
                      <span className="text-white/70 font-sans text-[10px] tracking-widest uppercase text-center line-clamp-2 w-[90px] leading-tight mt-1">
                        {scene.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>,
        document.body
      )}
    </>
  );
}

