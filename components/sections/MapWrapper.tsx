import dynamic from 'next/dynamic';
import { Property } from '@/lib/data/properties';

interface Props {
  properties: Property[];
  hoveredPropertyId?: string | null;
  onHoverProperty?: (id: string | null) => void;
}

export const PropertiesInteractiveMap = dynamic<Props>(
  () => import('./PropertiesInteractiveMap').then((mod) => mod.PropertiesInteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-border rounded-xl animate-pulse flex items-center justify-center">
        <p className="text-gray font-sans text-sm">Cargando mapa...</p>
      </div>
    ),
  }
);
