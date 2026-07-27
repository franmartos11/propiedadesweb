import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto | Villalba Martinez',
  description: 'Hablemos de tu próximo movimiento. Déjanos tus datos y un agente especializado se pondrá en contacto contigo.',
};

export default function ContactoPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-surface">
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
