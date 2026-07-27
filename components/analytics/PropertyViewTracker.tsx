'use client';

import { useEffect } from 'react';

interface Props {
  propertyId: string;
  propertyType: 'Venta' | 'Arriendo';
}

export function PropertyViewTracker({ propertyId, propertyType }: Props) {
  useEffect(() => {
    // Evitar contar múltiples veces si React Strict Mode doble-invoca
    let mounted = true;
    
    // Pequeño delay para asegurar que el usuario realmente vio la página (no fue un rebote instantáneo)
    const timer = setTimeout(() => {
      if (!mounted) return;
      
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'property_view',
          propertyId,
          propertyType,
        }),
      }).catch(err => console.error('Error tracking view:', err));
    }, 2000);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [propertyId, propertyType]);

  return null;
}
