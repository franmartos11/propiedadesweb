'use client';

import * as React from 'react';
import { Scale } from 'lucide-react';
import { useComparatorStore } from '@/store/comparator';

export function CompareButton({ propertyId }: { propertyId: string }) {
  const { propertyIds, addProperty, removeProperty } = useComparatorStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isComparing = propertyIds.includes(propertyId);

  const toggleCompare = () => {
    if (isComparing) {
      removeProperty(propertyId);
    } else {
      addProperty(propertyId);
    }
  };

  return (
    <button
      onClick={toggleCompare}
      className={`flex items-center gap-2 px-4 py-2 font-sans text-sm font-semibold rounded-lg transition-colors cursor-pointer border ${
        isComparing
          ? 'bg-brand text-white border-brand'
          : 'bg-white text-gray border-border hover:bg-gray-50'
      }`}
    >
      <Scale size={16} />
      {isComparing ? 'En comparativa' : 'Comparar'}
    </button>
  );
}
