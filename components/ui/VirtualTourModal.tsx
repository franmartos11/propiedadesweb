'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { VirtualTour360 } from './VirtualTour360';
import { View, X } from 'lucide-react';

export type TourScene = { url: string; name: string };

interface VirtualTourModalProps {
  tourUrls: (string | TourScene)[];
}

export function VirtualTourModal({ tourUrls }: VirtualTourModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!tourUrls || tourUrls.length === 0) return null;

  const currentScene = tourUrls[currentIndex];
  const currentUrl = typeof currentScene === 'string' ? currentScene : currentScene.url;

  return (
    <>
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] mx-4 bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-4 bg-black/50 absolute top-0 left-0 right-0 z-10">
              <div className="flex gap-2">
                {tourUrls.length > 1 && tourUrls.map((item, idx) => {
                  const name = typeof item === 'string' ? `Escena ${idx + 1}` : item.name;
                  return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`px-4 py-2 rounded-lg font-sans text-xs uppercase tracking-widest transition-colors ${
                      currentIndex === idx ? 'bg-[#C1121F] text-white' : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {name}
                  </button>
                  );
                })}
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Visor 3D */}
            <div className="flex-1 w-full relative">
              <VirtualTour360 imageUrl={currentUrl} />
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
