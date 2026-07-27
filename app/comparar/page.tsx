import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getProperties } from '@/lib/data/db';
import { ComparatorView } from '@/components/ui/ComparatorView';

export const metadata: Metadata = {
  title: 'Comparador de Propiedades',
  description: 'Compara lado a lado las propiedades de tu interés.',
};

export default async function CompararPage() {
  const properties = await getProperties();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-24">
        <ComparatorView allProperties={properties} />
      </main>
      <Footer />
    </>
  );
}
