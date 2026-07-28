'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Property } from '@/lib/data/properties';
import { Bed, Bath, Maximize2, Car, Scale } from 'lucide-react';
import { useComparatorStore } from '@/store/comparator';

interface PropertyCardProps {
  property: Property;
  isHovered?: boolean;
  onHover?: (id: string | null) => void;
  from?: string;
}

function PropertyCard({ property, isHovered, onHover, from }: PropertyCardProps) {
  const priceLabel =
    property.moneda === 'USD'
      ? `U$S ${property.precio.toLocaleString('es-AR')}`
      : `$ ${property.precio.toLocaleString('es-AR')}`;

  const { propertyIds, addProperty, removeProperty } = useComparatorStore();
  const isComparing = propertyIds.includes(property.id);

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isComparing) {
      removeProperty(property.id);
    } else {
      addProperty(property.id);
    }
  };

  return (
    <Link
      href={`/propiedades/${property.slug}${from ? `?from=${from}` : ''}`}
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`group flex flex-col bg-white rounded-lg transition-all duration-300 overflow-hidden ${
        isHovered
          ? 'shadow-[0_20px_40px_-15px_rgba(0,0,0,0.18)] ring-2 ring-brand scale-[1.01]'
          : 'hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]'
      }`}
    >
      {/* Imagen */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-hover shrink-0">
        <Image
          src={property.imagenes?.[0] || '/bg-1.jpg'}
          alt={property.nombre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlay for labels */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Badge operación */}
        <span className={`absolute top-4 left-4 px-3 py-1.5 text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-white rounded-full backdrop-blur-md ${property.tipo === 'Venta' ? 'bg-brand/90' : 'bg-foreground/90'}`}>
          {property.tipo === 'Arriendo' ? 'Alquiler' : property.tipo}
        </span>
        {property.destacada && (
          <span className="absolute top-4 right-4 px-3 py-1.5 text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-foreground bg-white/90 rounded-full backdrop-blur-md shadow-sm">
            Destacada
          </span>
        )}
        
        {/* Botón de comparar */}
        <button
          onClick={toggleCompare}
          title={isComparing ? "Quitar de comparar" : "Agregar a comparar"}
          className={`absolute bottom-4 right-4 p-2 rounded-full backdrop-blur-md shadow-sm transition-all duration-300 z-10 cursor-pointer ${
            isComparing 
              ? 'bg-brand text-white scale-110' 
              : 'bg-white/80 text-foreground hover:bg-white opacity-0 group-hover:opacity-100'
          }`}
        >
          <Scale size={16} />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 p-6">
        {/* Precio */}
        <p className="font-sans font-bold text-2xl text-brand leading-none tracking-tight">
          {priceLabel}
        </p>

        {/* Nombre y ubicación */}
        <div>
          <h3 className="font-sans font-medium text-sm text-foreground leading-snug mb-0.5 group-hover:text-brand transition-colors line-clamp-1">
            {property.nombre}
          </h3>
          <p className="font-sans text-xs text-gray uppercase tracking-wider line-clamp-1">
            {property.barrio} · {property.comuna}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Specs */}
        <div className="flex items-center justify-between gap-2 text-gray w-full px-1">
          <span className="flex items-center gap-1.5 font-sans text-xs">
            <Bed size={13} strokeWidth={1.5} />
            {property.habitaciones > 0 ? property.habitaciones : '-'} dorm.
          </span>
          <span className="flex items-center gap-1.5 font-sans text-xs">
            <Bath size={13} strokeWidth={1.5} />
            {property.banos > 0 ? property.banos : '-'} baño{property.banos !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1.5 font-sans text-xs">
            <Maximize2 size={13} strokeWidth={1.5} />
            {property.m2Total > 0 ? property.m2Total : (property.m2Util > 0 ? property.m2Util : '-')} m²
          </span>
          <span className="flex items-center gap-1.5 font-sans text-xs">
            <Car size={13} strokeWidth={1.5} />
            {property.estacionamientos > 0 ? property.estacionamientos : '-'} coch.
          </span>
        </div>
      </div>
    </Link>
  );
}

interface PropertyGridProps {
  properties: Property[];
  title?: string;
  showFilters?: boolean;
  itemsPerPage?: number;
  onHoverProperty?: (id: string | null) => void;
  hoveredPropertyId?: string | null;
  from?: string;
  compact?: boolean;
}

type FilterType = 'Todos' | 'Venta' | 'Alquiler';

export function PropertyGrid({
  properties: allProperties,
  title = 'Propiedades',
  showFilters = true,
  itemsPerPage = 9,
  onHoverProperty,
  hoveredPropertyId,
  from,
  compact = false,
}: PropertyGridProps) {
  const [activeFilter, setActiveFilter] = React.useState<FilterType>('Todos');
  const [currentPage, setCurrentPage] = React.useState(1);
  const sectionRef = React.useRef<HTMLElement>(null);

  const handleFilterClick = (f: FilterType) => {
    setActiveFilter(f);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to the top of the section with a small offset for the navbar
    if (sectionRef.current) {
      const yOffset = -100; 
      const y = sectionRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const filtered = React.useMemo(() => {
    if (activeFilter === 'Todos') return allProperties;
    return allProperties.filter((p) => p.tipo === activeFilter);
  }, [allProperties, activeFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  
  const currentProperties = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  return (
    <section ref={sectionRef} className={`${title || showFilters ? 'pt-4 md:pt-8' : 'pt-0'} pb-16 md:pb-24 bg-background`}>
      <div className="container mx-auto px-4 sm:px-6 md:px-12">

        {/* Header */}
        {(title || showFilters) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
            {title && <h2 className="font-serif text-3xl md:text-4xl text-foreground">{title}</h2>}

            {showFilters && (
              <div className="flex items-center gap-1 border border-border p-1 self-start sm:self-auto overflow-x-auto max-w-full">
                {(['Todos', 'Venta', 'Alquiler'] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => handleFilterClick(f)}
                    className={`px-4 py-2 font-sans text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                      activeFilter === f
                        ? 'bg-foreground text-background'
                        : 'text-gray hover:text-foreground'
                    }`}
                  >
                    {f === 'Alquiler' ? 'Alquiler' : f}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Grid */}
        {currentProperties.length > 0 ? (
          <motion.div 
            className={`grid gap-5 md:gap-6 ${compact ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}
            layout
          >
            <AnimatePresence mode="popLayout">
              {currentProperties.map((property) => (
                <motion.div
                  key={property.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <PropertyCard
                    property={property}
                    isHovered={hoveredPropertyId === property.id}
                    onHover={onHoverProperty}
                    from={from}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="py-24 text-center">
            <p className="font-sans text-gray">No hay propiedades en esta categoría.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-sans uppercase tracking-widest text-gray hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              Anterior
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 md:w-8 md:h-8 flex items-center justify-center text-sm font-sans transition-all ${
                    currentPage === i + 1
                      ? 'bg-brand text-white font-medium'
                      : 'bg-surface hover:bg-border text-foreground'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-sans uppercase tracking-widest text-gray hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Contador */}
        <p className="mt-8 font-sans text-xs text-gray uppercase tracking-widest text-center">
          Mostrando {currentProperties.length} de {filtered.length} propiedad{filtered.length !== 1 ? 'es' : ''}
        </p>

      </div>
    </section>
  );
}
