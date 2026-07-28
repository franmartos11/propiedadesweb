'use client';

import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Property } from '@/lib/data/properties';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { Bed, Maximize2 } from 'lucide-react';

interface Props {
  properties: Property[];
  hoveredPropertyId?: string | null;
  onHoverProperty?: (id: string | null) => void;
}

function MapUpdater({ properties }: { properties: Property[] }) {
  const map = useMap();
  useEffect(() => {
    // Fix for Leaflet grey tiles when container mounts before layout finishes
    map.invalidateSize();
    const timer = setTimeout(() => map.invalidateSize(), 250);

    if (properties.length === 0) return;
    const validProps = properties.filter(p => p.lat && p.lng);
    if (validProps.length === 0) return;
    const bounds = L.latLngBounds(validProps.map(p => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    
    return () => clearTimeout(timer);
  }, [properties, map]);
  return null;
}

export function PropertiesInteractiveMap({ properties, hoveredPropertyId, onHoverProperty }: Props) {
  const router = useRouter();
  const [previewProperty, setPreviewProperty] = useState<Property | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  const center: [number, number] = [-31.4201, -64.1888];

  const createPriceIcon = (price: number, currency: string, tipo: string, isHovered: boolean) => {
    let formattedPrice = '';
    if (price >= 1000000) formattedPrice = `${(price / 1000000).toFixed(1).replace('.0', '')}M`;
    else if (price >= 1000) formattedPrice = `${(price / 1000).toFixed(0)}k`;
    else formattedPrice = `${price}`;

    const text = currency === 'USD' ? `U$S ${formattedPrice}` : `$ ${formattedPrice}`;
    const bgColor = isHovered ? '#CF141E' : '#ffffff';
    const textColor = isHovered ? '#ffffff' : '#111827';
    const borderColor = isHovered ? '#CF141E' : '#d1d5db';
    const scale = isHovered ? 'scale(1.15)' : 'scale(1)';

    return L.divIcon({
      className: 'bg-transparent border-0',
      html: `
        <div style="transform: translate(-50%, -100%) ${scale}; transform-origin: bottom center; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); position: absolute; pointer-events: none;">
          <div style="background: ${bgColor}; color: ${textColor}; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 14px; padding: 6px 14px; border-radius: 24px; white-space: nowrap; box-shadow: 0 4px 14px rgba(0,0,0,0.15); border: 1px solid ${borderColor}; pointer-events: auto; cursor: pointer;">
            ${text}
          </div>
          <div style="position: absolute; width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${borderColor}; left: 50%; transform: translateX(-50%); bottom: -8px;"></div>
          <div style="position: absolute; width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${bgColor}; left: 50%; transform: translateX(-50%); bottom: -7px;"></div>
        </div>
      `,
      iconSize: [0, 0],
    });
  };

  // Update hovered marker when hoveredPropertyId changes
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const prop = properties.find(p => p.id === id);
      if (!prop) return;
      const isHovered = id === hoveredPropertyId;
      marker.setIcon(createPriceIcon(prop.precio, prop.moneda, prop.tipo, isHovered));
      if (isHovered) marker.getElement()?.style.setProperty('z-index', '1000');
      else marker.getElement()?.style.setProperty('z-index', '');
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredPropertyId, properties]);

  return (
    <div className="w-full h-full relative">
      {/* Preview Card */}
      {previewProperty && (
        <div
          className="absolute bottom-4 left-4 right-4 z-[1000] bg-white rounded-xl shadow-2xl overflow-hidden cursor-pointer flex max-h-32"
          onClick={() => router.push(`/propiedades/${previewProperty.slug}`)}
        >
          <div className="relative w-28 shrink-0">
            <Image
              src={previewProperty.imagenes?.[0] || '/bg-1.jpg'}
              alt={previewProperty.nombre}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
            <div>
              <p className="font-sans font-bold text-brand text-sm">
                {previewProperty.moneda === 'USD' ? 'U$S' : '$'} {previewProperty.precio.toLocaleString('es-AR')}
              </p>
              <p className="font-sans font-medium text-xs text-foreground line-clamp-1 mt-0.5">{previewProperty.nombre}</p>
              <p className="font-sans text-xs text-gray">{previewProperty.barrio}</p>
            </div>
            <div className="flex items-center gap-3 text-gray mt-2">
              <span className="flex items-center gap-1 text-xs"><Bed size={11} />{previewProperty.habitaciones > 0 ? previewProperty.habitaciones : '-'}</span>
              <span className="flex items-center gap-1 text-xs"><Bath size={11} />{previewProperty.banos > 0 ? previewProperty.banos : '-'}</span>
              <span className="flex items-center gap-1 text-xs"><Maximize2 size={11} />{previewProperty.m2Total > 0 ? previewProperty.m2Total : (previewProperty.m2Util > 0 ? previewProperty.m2Util : '-')} m²</span>
            </div>
          </div>
          <button
            className="absolute top-2 right-2 w-5 h-5 bg-black/40 rounded-full flex items-center justify-center text-white text-xs cursor-pointer"
            onClick={e => { e.stopPropagation(); setPreviewProperty(null); }}
          >×</button>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapUpdater properties={properties} />

        {properties.map(property => {
          if (!property.lat || !property.lng) return null;
          const isHovered = property.id === hoveredPropertyId;
          return (
            <Marker
              key={property.id}
              position={[property.lat, property.lng]}
              icon={createPriceIcon(property.precio, property.moneda, property.tipo, isHovered)}
              ref={(marker) => {
                if (marker) markersRef.current.set(property.id, marker);
                else markersRef.current.delete(property.id);
              }}
              eventHandlers={{
                mouseover: () => {
                  setPreviewProperty(property);
                  onHoverProperty?.(property.id);
                },
                mouseout: () => {
                  onHoverProperty?.(null);
                },
                click: () => router.push(`/propiedades/${property.slug}`),
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
