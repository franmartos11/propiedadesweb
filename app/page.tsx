import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { PropertySearch } from '@/components/sections/PropertySearch';
import { PropertyGrid } from '@/components/sections/PropertyGrid';
import { NumbersSection } from '@/components/sections/NumbersSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { AdminServicesSection } from '@/components/sections/AdminServicesSection';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { InstagramSection } from '@/components/sections/InstagramSection';
import { getProperties } from '@/lib/data/db';

export default async function Home() {
  const properties = await getProperties();
  return (
    <>
      <Navbar />
      <main>
        {/* 1. Hero a pantalla completa */}
        <Hero />

        {/* 2. Buscador rápido — superpuesto al pie del hero */}
        <PropertySearch />

        {/* 3. Propiedades — el corazón del sitio */}
        <PropertyGrid
          properties={properties}
          title="Propiedades Disponibles"
          showFilters
        />

        {/* 4. Números — credibilidad */}
        <NumbersSection />

        {/* 5. Servicios */}
        <ServicesSection />

        {/* 6. Administración */}
        <AdminServicesSection />

        {/* 7. Instagram Feed */}
        <InstagramSection />

        {/* 8. Contacto */}
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
