'use client';

import * as React from 'react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Property } from '@/lib/data/properties';
import { PropertyGrid } from './PropertyGrid';
import { PropertiesInteractiveMap } from './MapWrapper';
import {
  Map,
  LayoutGrid,
  Columns2,
  SlidersHorizontal,
  X,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';

interface SearchLayoutProps {
  initialProperties: Property[];
  title: string;
  from?: string;
}

type ViewMode = 'grid' | 'split' | 'map';
type SortMode = 'default' | 'price_asc' | 'price_desc';

const PROPERTY_TYPES = ['Todos', 'Casa', 'Departamento', 'Local', 'Terreno', 'Oficina', 'Duplex', 'Ph'] as const;
type PropType = (typeof PROPERTY_TYPES)[number];

function detectPropertyType(nombre: string): PropType {
  const n = nombre.toLowerCase();
  if (n.includes('casa') || n.includes('chalet')) return 'Casa';
  if (n.includes('depto') || n.includes('departamento') || n.includes('monoambiente')) return 'Departamento';
  if (n.includes('local') || n.includes('comercial')) return 'Local';
  if (n.includes('terreno') || n.includes('lote')) return 'Terreno';
  if (n.includes('oficina')) return 'Oficina';
  if (n.includes('duplex') || n.includes('dúplex')) return 'Duplex';
  if (n.includes(' ph ') || n.includes('penthouse')) return 'Ph';
  return 'Departamento'; // fallback más común en córdoba
}

export function SearchLayout({ initialProperties, title, from }: SearchLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial state from URL
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minP') || '');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxP') || '');
  const [rooms, setRooms] = useState<string>(searchParams.get('dorm') || '');
  const [baths, setBaths] = useState<string>(searchParams.get('banos') || '');
  const [propType, setPropType] = useState<PropType>((searchParams.get('tipo') as PropType) || 'Todos');
  const [minM2, setMinM2] = useState<string>(searchParams.get('minM2') || '');
  const [maxM2, setMaxM2] = useState<string>(searchParams.get('maxM2') || '');
  const [sortMode, setSortMode] = useState<SortMode>((searchParams.get('orden') as SortMode) || 'default');
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  // Sync filters to URL (shallow) so back navigation restores state
  const syncToUrl = useCallback(
    (overrides: Record<string, string> = {}) => {
      const params = new URLSearchParams();
      const vals: Record<string, string> = {
        minP: minPrice,
        maxP: maxPrice,
        dorm: rooms,
        banos: baths,
        tipo: propType === 'Todos' ? '' : propType,
        minM2,
        maxM2,
        orden: sortMode === 'default' ? '' : sortMode,
        ...overrides,
      };
      Object.entries(vals).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [minPrice, maxPrice, rooms, baths, propType, minM2, maxM2, sortMode, pathname, router]
  );

  // Debounced URL sync (price inputs should not fire on every keystroke)
  useEffect(() => {
    const t = setTimeout(() => syncToUrl(), 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice, minM2, maxM2]);

  // Immediate sync for button-style filters
  const setRoomsAndSync = (v: string) => {
    setRooms(v);
    syncToUrl({ dorm: v });
  };
  const setBathsAndSync = (v: string) => {
    setBaths(v);
    syncToUrl({ banos: v });
  };
  const setPropTypeAndSync = (v: PropType) => {
    setPropType(v);
    syncToUrl({ tipo: v === 'Todos' ? '' : v });
  };
  const setSortAndSync = (v: SortMode) => {
    setSortMode(v);
    syncToUrl({ orden: v === 'default' ? '' : v });
  };

  const clearAll = () => {
    setMinPrice(''); setMaxPrice(''); setRooms(''); setBaths('');
    setPropType('Todos'); setMinM2(''); setMaxM2(''); setSortMode('default');
    router.replace(pathname, { scroll: false });
  };

  // Active filters count
  const activeFiltersCount = [minPrice, maxPrice, rooms, baths, minM2, maxM2]
    .filter(Boolean).length + (propType !== 'Todos' ? 1 : 0) + (sortMode !== 'default' ? 1 : 0);

  // Filter + sort logic
  const filteredProperties = useMemo(() => {
    let result = initialProperties.filter(p => {
      if (minPrice && p.precio < parseInt(minPrice)) return false;
      if (maxPrice && p.precio > parseInt(maxPrice)) return false;
      if (rooms && p.habitaciones < parseInt(rooms)) return false;
      if (baths && p.banos < parseInt(baths)) return false;
      if (minM2 && p.m2Total < parseInt(minM2)) return false;
      if (maxM2 && p.m2Total > parseInt(maxM2)) return false;
      if (propType !== 'Todos' && detectPropertyType(p.nombre) !== propType) return false;
      return true;
    });

    if (sortMode === 'price_asc') result = [...result].sort((a, b) => a.precio - b.precio);
    else if (sortMode === 'price_desc') result = [...result].sort((a, b) => b.precio - a.precio);

    return result;
  }, [initialProperties, minPrice, maxPrice, rooms, baths, minM2, maxM2, propType, sortMode]);

  const viewIcon = {
    grid: <LayoutGrid size={16} />,
    split: <Columns2 size={16} />,
    map: <Map size={16} />,
  };

  const activeFiltersKeys = [
    { key: 'minPrice', val: minPrice, label: minPrice ? `Desde $${parseInt(minPrice).toLocaleString('es-AR')}` : '' },
    { key: 'maxPrice', val: maxPrice, label: maxPrice ? `Hasta $${parseInt(maxPrice).toLocaleString('es-AR')}` : '' },
    { key: 'rooms', val: rooms, label: rooms ? `${rooms}+ dorm.` : '' },
    { key: 'baths', val: baths, label: baths ? `${baths}+ baños` : '' },
    { key: 'propType', val: propType !== 'Todos' ? propType : '', label: propType !== 'Todos' ? propType : '' },
    { key: 'm2', val: minM2 || maxM2 ? 'm2' : '', label: minM2 && maxM2 ? `${minM2}–${maxM2} m²` : minM2 ? `Desde ${minM2} m²` : maxM2 ? `Hasta ${maxM2} m²` : '' },
  ].filter(f => f.val);

  const visibleFiltersMobile = activeFiltersKeys.slice(0, 2);
  const hiddenFiltersCount = activeFiltersKeys.length - visibleFiltersMobile.length;

  const handleRemoveFilter = (key: string) => {
    switch (key) {
      case 'minPrice': setMinPrice(''); syncToUrl({ minP: '' }); break;
      case 'maxPrice': setMaxPrice(''); syncToUrl({ maxP: '' }); break;
      case 'rooms': setRooms(''); syncToUrl({ dorm: '' }); break;
      case 'baths': setBaths(''); syncToUrl({ banos: '' }); break;
      case 'propType': setPropTypeAndSync('Todos'); break;
      case 'm2': setMinM2(''); setMaxM2(''); syncToUrl({ minM2: '', maxM2: '' }); break;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* ═══ Header ═══ */}
      <div className="bg-white border-b border-border sticky top-[72px] z-20 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 py-4 flex items-center gap-6 flex-wrap">
          <div className="flex items-baseline gap-3 mr-2">
            <h1 className="font-serif text-3xl md:text-4xl text-foreground font-medium tracking-tight">{title}</h1>
            <span className="font-sans text-gray text-sm font-medium bg-surface px-2.5 py-1 rounded-full border border-border/50">
              {filteredProperties.length} resultado{filteredProperties.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Active filter pills - Desktop all, Mobile limited */}
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              {activeFiltersKeys.map(f => (
                <FilterPill key={f.key} label={f.label} onRemove={() => handleRemoveFilter(f.key)} />
              ))}
            </div>
            
            <div className="flex md:hidden items-center gap-2 flex-wrap">
              {visibleFiltersMobile.map(f => (
                <FilterPill key={f.key} label={f.label} onRemove={() => handleRemoveFilter(f.key)} />
              ))}
              {hiddenFiltersCount > 0 && (
                <span className="text-xs font-sans text-gray">+{hiddenFiltersCount} más</span>
              )}
            </div>

            {activeFiltersCount > 0 && (
              <button onClick={clearAll} className="text-xs text-brand underline font-sans ml-1 cursor-pointer">
                Limpiar todo
              </button>
            )}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Sort dropdown */}
            <div className="relative group">
              <select
                value={sortMode}
                onChange={e => setSortAndSync(e.target.value as SortMode)}
                className="appearance-none pl-4 pr-10 py-2.5 text-sm font-sans font-medium border border-border bg-white hover:bg-surface-hover rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all shadow-sm"
              >
                <option value="default">Ordenar por</option>
                <option value="price_asc">Precio (Menor a Mayor)</option>
                <option value="price_desc">Precio (Mayor a Menor)</option>
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray group-hover:text-foreground pointer-events-none transition-colors" />
            </div>

            {/* Filters toggle mobile */}
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl font-sans font-medium text-sm bg-white hover:bg-surface-hover cursor-pointer shadow-sm transition-all"
            >
              <SlidersHorizontal size={16} />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="bg-brand text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* View mode toggle */}
            <div className="hidden sm:flex bg-surface p-1 rounded-xl border border-border gap-1 shadow-inner">
              {(['grid', 'split', 'map'] as ViewMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  title={{ grid: 'Vista grilla', split: 'Vista dividida', map: 'Vista mapa' }[mode]}
                  className={`p-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                    viewMode === mode 
                      ? 'bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] text-brand scale-[1.02]' 
                      : 'text-gray hover:text-foreground hover:bg-white/60'
                  }`}
                >
                  {viewIcon[mode]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Body ═══ */}
      <div className="container mx-auto px-4 sm:px-6 md:px-12 py-6 flex gap-6 flex-1">

        {/* Overlay móvil */}
        {showFiltersMobile && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden" 
            onClick={() => setShowFiltersMobile(false)}
          />
        )}

        {/* Sidebar Filters */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-white overflow-y-auto transform transition-transform duration-300 
          md:sticky md:top-[160px] md:self-start md:h-[calc(100vh-180px)] md:w-[260px] md:transform-none md:shrink-0 md:bg-transparent md:z-auto
          ${showFiltersMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        `}>
          <div className="flex flex-col gap-5 md:bg-white md:border md:border-border rounded-none md:rounded-xl p-5 md:shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-sans font-bold text-sm uppercase tracking-widest text-foreground">Filtrar</p>
              <button 
                onClick={() => setShowFiltersMobile(false)}
                className="md:hidden p-2 text-gray hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            {/* Property Type */}
            <div>
              <label className="block font-sans text-xs font-semibold text-gray uppercase tracking-wider mb-2">Tipo de propiedad</label>
              <div className="flex flex-wrap gap-1.5">
                {PROPERTY_TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setPropTypeAndSync(t)}
                    className={`px-3 py-1.5 text-xs font-sans rounded-full border transition-colors cursor-pointer ${
                      propType === t
                        ? 'bg-foreground text-white border-foreground'
                        : 'bg-white border-border text-gray hover:border-foreground hover:text-foreground'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <label className="block font-sans text-xs font-semibold text-gray uppercase tracking-wider mb-2">Precio</label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md font-sans text-xs focus:outline-none focus:border-brand"
                />
                <span className="text-gray text-xs shrink-0">—</span>
                <input
                  type="number"
                  placeholder="Máximo"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md font-sans text-xs focus:outline-none focus:border-brand"
                />
              </div>
              {/* Quick presets */}
              <div className="flex flex-wrap gap-1">
                {[
                  { label: 'Hasta 200k', min: '', max: '200000' },
                  { label: '200k–500k', min: '200000', max: '500000' },
                  { label: '+500k', min: '500000', max: '' },
                ].map(p => (
                  <button
                    key={p.label}
                    onClick={() => { setMinPrice(p.min); setMaxPrice(p.max); syncToUrl({ minP: p.min, maxP: p.max }); }}
                    className="px-2 py-1 text-[11px] font-sans border border-border rounded-full text-gray hover:border-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rooms */}
            <div>
              <label className="block font-sans text-xs font-semibold text-gray uppercase tracking-wider mb-2">Dormitorios mín.</label>
              <div className="flex gap-1.5">
                {['1', '2', '3', '4'].map(num => (
                  <button
                    key={num}
                    onClick={() => setRoomsAndSync(rooms === num ? '' : num)}
                    className={`flex-1 py-2 font-sans text-xs rounded-md border transition-colors cursor-pointer ${
                      rooms === num ? 'bg-foreground text-white border-foreground' : 'bg-white border-border text-foreground hover:border-gray'
                    }`}
                  >
                    {num}+
                  </button>
                ))}
              </div>
            </div>

            {/* Baths */}
            <div>
              <label className="block font-sans text-xs font-semibold text-gray uppercase tracking-wider mb-2">Baños mín.</label>
              <div className="flex gap-1.5">
                {['1', '2', '3'].map(num => (
                  <button
                    key={num}
                    onClick={() => setBathsAndSync(baths === num ? '' : num)}
                    className={`flex-1 py-2 font-sans text-xs rounded-md border transition-colors cursor-pointer ${
                      baths === num ? 'bg-foreground text-white border-foreground' : 'bg-white border-border text-foreground hover:border-gray'
                    }`}
                  >
                    {num}+
                  </button>
                ))}
              </div>
            </div>

            {/* M2 range */}
            <div>
              <label className="block font-sans text-xs font-semibold text-gray uppercase tracking-wider mb-2">Superficie (m²)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Desde"
                  value={minM2}
                  onChange={e => setMinM2(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md font-sans text-xs focus:outline-none focus:border-brand"
                />
                <span className="text-gray text-xs shrink-0">—</span>
                <input
                  type="number"
                  placeholder="Hasta"
                  value={maxM2}
                  onChange={e => setMaxM2(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md font-sans text-xs focus:outline-none focus:border-brand"
                />
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <button onClick={clearAll} className="w-full py-2 font-sans text-xs text-gray hover:text-brand transition-colors underline cursor-pointer">
                Limpiar todos los filtros
              </button>
            )}
          </div>
        </aside>

        {/* Main: Grid and/or Map */}
        <div className="flex-1 min-w-0 flex gap-4">

          {/* Property Grid */}
          {(viewMode === 'grid' || viewMode === 'split') && (
            <div className={viewMode === 'split' ? 'w-[55%] shrink-0 overflow-y-auto' : 'w-full'}>
              {filteredProperties.length > 0 ? (
                <PropertyGrid
                  properties={filteredProperties}
                  onHoverProperty={setHoveredPropertyId}
                  hoveredPropertyId={hoveredPropertyId}
                  from={from}
                  showFilters={false}
                  title=""
                  compact={viewMode === 'split'}
                  disablePagination={true}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <p className="font-serif text-2xl text-foreground mb-3">Sin resultados</p>
                  <p className="font-sans text-gray text-sm mb-6">Ninguna propiedad coincide con tus filtros actuales.</p>
                  <button onClick={clearAll} className="px-6 py-3 bg-brand text-white font-sans text-sm font-medium cursor-pointer hover:bg-brand-hover transition-colors">
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Map */}
          {(viewMode === 'map' || viewMode === 'split') && (
            <div className={`${viewMode === 'split' ? 'flex-1' : 'w-full'} sticky top-36 h-[calc(100vh-160px)] rounded-xl overflow-hidden`}>
              <PropertiesInteractiveMap
                properties={filteredProperties}
                hoveredPropertyId={hoveredPropertyId}
                onHoverProperty={setHoveredPropertyId}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-foreground text-white text-xs font-sans px-3 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="ml-0.5 hover:opacity-70 transition-opacity cursor-pointer" aria-label="Quitar filtro">
        <X size={11} />
      </button>
    </span>
  );
}
