'use client';

import * as React from 'react';
import { Search, ChevronDown, MapPin, Home, Map } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { properties } from '@/lib/data/properties';
import { useAnalytics } from '@/lib/hooks/useAnalytics';

const TIPOS_PROP = ['Casa', 'Cochera', 'Depto', 'Duplex', 'Galpon', 'Local', 'Terreno'];

const LOCALIDADES = [
  'Alta Gracia', 'Benavidez', 'Bialet Masse', 'Córdoba', 'La Calera', 
  'Las vertientes de la gran', 'Los Reartes', 'Malagueño', 'Mendiolaza', 
  'Punta del este', 'Santa Ana', 'Unquillo', 'V. Gral Belgrano', 
  'Villa Allende', 'Z. los Reartes'
];

export function PropertySearch() {
  const router = useRouter();
  const [operacion, setOperacion] = React.useState<'Venta' | 'Alquiler'>('Venta');
  const [tipoProp, setTipoProp] = React.useState('');
  const [localidad, setLocalidad] = React.useState('');
  const [barrio, setBarrio] = React.useState('');
  const { trackSearch } = useAnalytics();

  // Dynamically extract and sort unique neighborhoods
  const barriosDisponibles = React.useMemo(() => {
    const unique = new Set(properties.map(p => p.barrio).filter(Boolean));
    return Array.from(unique).sort();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    trackSearch(operacion, tipoProp || undefined, localidad || undefined, barrio || undefined);
    const path = operacion === 'Venta' ? '/venta' : '/alquiler';
    router.push(path);
  };

  return (
    <section className="relative z-20 px-4 md:px-12 py-12 md:py-16 bg-background">
      <div className="container mx-auto max-w-[1200px]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl md:rounded-full shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] border border-border overflow-hidden"
        >
          {/* Tabs integrados y Search integrados */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center p-2 md:p-3 gap-2">
            
            {/* Tabs Venta / Alquiler (Toggle estilo pastilla) */}
            <div className="flex bg-black/5 rounded-full p-1 shrink-0 w-full md:w-auto">
              {(['Venta', 'Alquiler'] as const).map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => setOperacion(op)}
                  className={`flex-1 md:flex-none px-6 py-3 md:py-2.5 rounded-full font-sans text-xs uppercase tracking-[0.2em] transition-all duration-300 min-h-[48px] md:min-h-0 ${
                    operacion === op
                      ? 'bg-white text-brand shadow-sm font-semibold'
                      : 'text-foreground/80 hover:text-foreground'
                  }`}
                >
                  {op === 'Alquiler' ? 'Alquiler' : op}
                </button>
              ))}
            </div>

            <div className="w-px h-10 bg-black/10 hidden md:block mx-2" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full flex-grow">
              
              {/* Tipo de propiedad */}
              <div className="relative group bg-white md:bg-transparent rounded-xl md:rounded-none">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-brand">
                  <Home size={18} strokeWidth={1.5} />
                </div>
                <select
                  aria-label="Tipo de inmueble"
                  value={tipoProp}
                  onChange={(e) => setTipoProp(e.target.value)}
                  className="w-full min-h-[48px] bg-transparent pl-12 pr-10 py-4 md:py-3 font-sans text-sm text-foreground focus:outline-none appearance-none cursor-pointer group-hover:bg-black/5 transition-colors md:rounded-full"
                >
                  <option value="">Tipo de Inmueble - Indistinto</option>
                  {TIPOS_PROP.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray">
                  <ChevronDown size={14} />
                </div>
              </div>

              {/* Localidad */}
              <div className="relative group bg-white md:bg-transparent rounded-xl md:rounded-none border-t border-border md:border-none">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-brand">
                  <Map size={18} strokeWidth={1.5} />
                </div>
                <select
                  aria-label="Localidad"
                  value={localidad}
                  onChange={(e) => setLocalidad(e.target.value)}
                  className="w-full min-h-[48px] bg-transparent pl-12 pr-10 py-4 md:py-3 font-sans text-sm text-foreground focus:outline-none appearance-none cursor-pointer group-hover:bg-black/5 transition-colors md:rounded-full"
                >
                  <option value="">Localidades - Indistinto</option>
                  {LOCALIDADES.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray">
                  <ChevronDown size={14} />
                </div>
              </div>

              {/* Barrio */}
              <div className="relative group bg-white md:bg-transparent rounded-xl md:rounded-none border-t border-border md:border-none">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-brand">
                  <MapPin size={18} strokeWidth={1.5} />
                </div>
                <select
                  aria-label="Barrio"
                  value={barrio}
                  onChange={(e) => setBarrio(e.target.value)}
                  className="w-full min-h-[48px] bg-transparent pl-12 pr-10 py-4 md:py-3 font-sans text-sm text-foreground focus:outline-none appearance-none cursor-pointer group-hover:bg-black/5 transition-colors md:rounded-full"
                >
                  <option value="">Barrios - Indistinto</option>
                  {barriosDisponibles.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            {/* Botón Buscar */}
            <button
              type="submit"
              className="w-full md:w-auto min-h-[48px] shrink-0 bg-brand hover:bg-brand/90 text-white rounded-xl md:rounded-full px-8 py-4 md:py-3 flex items-center justify-center gap-2 transition-colors font-sans text-sm uppercase tracking-widest font-medium"
            >
              <Search size={18} />
              <span className="md:hidden lg:inline">Buscar</span>
            </button>

          </form>
        </motion.div>
      </div>
    </section>
  );
}
