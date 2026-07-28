import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getProperties } from '@/lib/data/db';
import { getPropertyJsonLd } from '@/lib/seo/jsonld';
import { Badge } from '@/components/ui/Badge';
import { BackButton } from '@/components/ui/BackButton';
import { PropertyMap } from '@/components/sections/PropertyMap';
import { PropertyGallery } from '@/components/sections/PropertyGallery';
import { PropertyContactCard } from '@/components/sections/PropertyContactCard';
import { RelatedProperties } from '@/components/sections/RelatedProperties';
import { PropertyViewTracker } from '@/components/analytics/PropertyViewTracker';
import { CompareButton } from '@/components/ui/CompareButton';
import { MapPin, Maximize2, Bed, Bath, Car, CalendarDays } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ from?: string }>;
}

export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const properties = await getProperties();
  const property = properties.find(p => p.slug === slug);
  if (!property) return { title: 'Propiedad no encontrada' };
  return {
    title: `${property.nombre} en ${property.barrio} | Villalba Martinez`,
    description: property.descripcion,
    openGraph: {
      images: [{ url: property.imagenes?.[0] || '/bg-1.jpg', width: 1200, height: 630 }],
    },
  };
}

export default async function PropertyPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const from = resolvedSearch?.from;

  const properties = await getProperties();
  const property = properties.find(p => p.slug === resolvedParams.slug);
  if (!property) notFound();

  // Related: same tipo, same barrio, different slug, max 3
  const related = properties
    .filter(p => p.slug !== property.slug && p.tipo === property.tipo && p.barrio === property.barrio)
    .slice(0, 3);
  // Fallback: same tipo, any barrio
  const relatedFallback = related.length < 3
    ? [...related, ...properties.filter(p => p.slug !== property.slug && p.tipo === property.tipo && !related.find(r => r.id === p.id)).slice(0, 3 - related.length)]
    : related;

  const jsonLd = getPropertyJsonLd(property);
  const priceLabel = property.moneda === 'USD' ? 'U$S ' : '$ ';
  const formattedPrice = property.precio.toLocaleString('es-AR');

  const backLabel = from === 'alquiler' ? 'Volver a Alquileres'
    : from === 'venta' ? 'Volver a Ventas'
    : 'Volver al listado';
  const backHref = from === 'alquiler' ? '/alquiler'
    : from === 'venta' ? '/venta'
    : undefined;

  return (
    <>
      <PropertyViewTracker propertyId={property.id} propertyType={property.tipo} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <main className="min-h-screen bg-white pt-24 pb-24">
        <div className="container mx-auto px-4 md:px-12 max-w-7xl">

          {/* Back navigation */}
          <div className="mb-6 pt-4">
            <BackButton label={backLabel} href={backHref} />
          </div>

          {/* Header Superior */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Badge type={property.tipo === 'Venta' ? 'VENTA' : 'ALQUILER'} />
                {property.destacada && (
                  <span className="px-3 py-1 bg-gray-100 text-gray text-xs font-semibold rounded-md">Destacada</span>
                )}
              </div>
              <h1 className="font-sans text-3xl md:text-4xl font-bold text-foreground">{property.nombre}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray text-sm">
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  {property.barrio}, {property.comuna}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end justify-end gap-3">
              <div className="bg-[#111] px-5 py-2 shadow-sm">
                <p className="font-sans text-2xl md:text-3xl font-black text-white tracking-tight">
                  {priceLabel}{formattedPrice}
                </p>
              </div>
              <CompareButton propertyId={property.id} />
            </div>
          </div>

          {/* Gallery */}
          <PropertyGallery images={property.imagenes || []} propertySlug={property.slug} tour360Urls={property.tour360Urls} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mt-10">

            {/* Left: Specs, Description, Map, Related */}
            <div className="lg:col-span-8 flex flex-col gap-10">

              {/* Specs */}
              <div className="flex flex-wrap gap-8 py-6 border-y border-border">
                <div className="flex items-center gap-3">
                  <Maximize2 size={28} strokeWidth={1.5} className="text-gray" />
                  <div>
                    <span className="block font-sans text-xl font-semibold text-foreground">{property.m2Total > 0 ? property.m2Total : '-'} m²</span>
                    <span className="block font-sans text-sm text-gray">Superficie Total</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bed size={28} strokeWidth={1.5} className="text-gray" />
                  <div>
                    <span className="block font-sans text-xl font-semibold text-foreground">{property.habitaciones > 0 ? property.habitaciones : '-'}</span>
                    <span className="block font-sans text-sm text-gray">Dormitorios</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bath size={28} strokeWidth={1.5} className="text-gray" />
                  <div>
                    <span className="block font-sans text-xl font-semibold text-foreground">{property.banos > 0 ? property.banos : '-'}</span>
                    <span className="block font-sans text-sm text-gray">Baños</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays size={28} strokeWidth={1.5} className="text-gray" />
                  <div>
                    <span className="block font-sans text-xl font-semibold text-foreground">
                      {property.antiguedad === 0 || property.antiguedad === undefined ? '-' : `${property.antiguedad} años`}
                    </span>
                    <span className="block font-sans text-sm text-gray">Antigüedad</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Car size={28} strokeWidth={1.5} className="text-gray" />
                  <div>
                    <span className="block font-sans text-xl font-semibold text-foreground">{property.estacionamientos > 0 ? property.estacionamientos : '-'}</span>
                    <span className="block font-sans text-sm text-gray">Cocheras</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-sans text-2xl font-bold text-foreground mb-6">Acerca de la propiedad</h2>
                <div
                  className="prose prose-lg prose-gray max-w-none font-sans leading-relaxed text-gray"
                  dangerouslySetInnerHTML={{ __html: property.descripcion }}
                />
              </div>

              {/* Map */}
              <div className="pt-8 border-t border-border">
                <PropertyMap barrio={property.barrio} comuna={property.comuna} />
              </div>

              {/* Related */}
              <RelatedProperties properties={relatedFallback} />

            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-32">
                <PropertyContactCard propertyName={property.nombre} propertySlug={property.slug} propertyId={property.id} propertyType={property.tipo} />
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
