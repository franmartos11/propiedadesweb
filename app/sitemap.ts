import { MetadataRoute } from 'next';
import { properties } from '@/lib/data/properties';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://inmobiliaria.cl';

  return [
    { url: `${baseUrl}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/venta`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/alquiler`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/administracion`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contacto`, changeFrequency: 'monthly', priority: 0.7 },
    ...properties.map((p) => ({
      url: `${baseUrl}/propiedades/${p.slug}`,
      lastModified: new Date(),
      priority: 0.85,
    })),
  ];
}
