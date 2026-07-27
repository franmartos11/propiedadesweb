'use client';

import * as React from 'react';

interface PropertyMapProps {
  barrio: string;
  comuna: string;
}

export function PropertyMap({ barrio, comuna }: PropertyMapProps) {
  // Construir la consulta de búsqueda para el iframe
  // Agregamos "Córdoba, Argentina" para mejorar la precisión de la búsqueda
  const searchQuery = encodeURIComponent(`${barrio}, ${comuna}, Córdoba, Argentina`);
  
  return (
    <div className="w-full">
      <h3 className="font-sans text-2xl font-bold text-foreground mb-2">Ubicación</h3>
      <p className="font-sans text-gray text-sm mb-6">
        {barrio}, {comuna}
      </p>
      
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-border overflow-hidden rounded-2xl">
        <iframe
          title={`Mapa de ubicación en ${barrio}, ${comuna}`}
          src={`https://maps.google.com/maps?q=${searchQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 grayscale contrast-125 opacity-90 transition-all duration-500 hover:grayscale-0 hover:opacity-100"
        ></iframe>
      </div>
    </div>
  );
}
