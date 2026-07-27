'use client';

import { track } from '@vercel/analytics';

/**
 * Hook centralizado para trackear eventos de la inmobiliaria.
 * Usa Vercel Analytics internamente.
 */
export function useAnalytics() {
  
  /**
   * Se dispara cuando el usuario hace clic en el botón de WhatsApp.
   * @param source - De dónde viene el clic ('floating_button' | 'property_page' | 'contact_cta' | 'mobile_menu')
   * @param propertySlug - Opcional: slug de la propiedad si el clic es desde una página de propiedad
   */
  const trackWhatsAppClick = (
    source: 'floating_button' | 'property_page' | 'contact_cta' | 'mobile_menu',
    propertySlug?: string
  ) => {
    track('whatsapp_click', {
      source,
      ...(propertySlug && { property_slug: propertySlug }),
    });
  };

  /**
   * Se dispara cuando un usuario abre la galería de fotos de una propiedad.
   * @param propertySlug - Slug de la propiedad
   * @param imageIndex - Índice de la imagen que abrió el usuario
   */
  const trackGalleryOpen = (propertySlug: string, imageIndex: number = 0) => {
    track('gallery_open', {
      property_slug: propertySlug,
      image_index: imageIndex,
    });
  };

  /**
   * Se dispara cuando el usuario hace una búsqueda de propiedades.
   * @param operacion - 'Venta' | 'Alquiler'
   * @param tipoProp - Tipo de propiedad seleccionado (opcional)
   * @param localidad - Localidad seleccionada (opcional)
   * @param barrio - Barrio seleccionado (opcional)
   */
  const trackSearch = (
    operacion: string,
    tipoProp?: string,
    localidad?: string,
    barrio?: string
  ) => {
    track('search_filter_used', {
      operacion,
      ...(tipoProp && { tipo_prop: tipoProp }),
      ...(localidad && { localidad }),
      ...(barrio && { barrio }),
    });
  };

  /**
   * Se dispara cuando el usuario hace clic en el link de Instagram.
   * @param source - De dónde viene el clic ('section' | 'footer')
   */
  const trackInstagramClick = (source: 'section' | 'footer') => {
    track('instagram_click', { source });
  };

  /**
   * Se dispara cuando el usuario hace clic en una propiedad del grid.
   * @param propertySlug - Slug de la propiedad
   * @param propertyName - Nombre de la propiedad para legibilidad en el dashboard
   */
  const trackPropertyClick = (propertySlug: string, propertyName: string) => {
    track('property_click', {
      property_slug: propertySlug,
      property_name: propertyName,
    });
  };

  return {
    trackWhatsAppClick,
    trackGalleryOpen,
    trackSearch,
    trackInstagramClick,
    trackPropertyClick,
  };
}
