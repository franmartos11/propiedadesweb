import { Property } from '../data/properties';

export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Estudio Inmobiliario',
    image: 'https://inmobiliaria.cl/logo.png',
    '@id': 'https://inmobiliaria.cl',
    url: 'https://inmobiliaria.cl',
    telephone: '+56912345678',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Alonso de Córdova',
      addressLocality: 'Vitacura',
      addressRegion: 'RM',
      postalCode: '7630000',
      addressCountry: 'CL',
    },
  };
}

export function getPropertyJsonLd(property: Property) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://inmobiliaria.cl';
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.nombre,
    description: property.descripcion,
    url: `${baseUrl}/propiedades/${property.slug}`,
    image: property.imagenes.map(img => `${baseUrl}${img}`),
    datePosted: property.updatedAt,
    offers: {
      '@type': 'Offer',
      price: property.precio,
      priceCurrency: property.moneda,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.comuna,
      addressRegion: 'RM',
      addressCountry: 'CL',
    },
  };
}

export function getServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Administración de Inmuebles',
    provider: {
      '@type': 'RealEstateAgent',
      name: 'Estudio Inmobiliario',
    },
    areaServed: {
      '@type': 'City',
      name: 'Santiago',
    },
    description: 'Gestión integral de propiedades. Cobro de alquilers, mantenimiento, selección de arrendatarios y reportes mensuales.',
  };
}
