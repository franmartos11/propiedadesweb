import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AdminServicesSection } from '@/components/sections/AdminServicesSection';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { Metadata } from 'next';
import { getServiceJsonLd } from '@/lib/seo/jsonld';

export const metadata: Metadata = {
  title: 'Administración de Inmuebles | Villalba Martinez',
  description: 'Gestión patrimonial integral. Nos ocupamos del mantenimiento, cobros y rentabilidad mientras tú descansas.',
};

export default function AdministracionPage() {
  const jsonLd = getServiceJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="pt-24 min-h-screen bg-background">
        <AdminServicesSection />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
