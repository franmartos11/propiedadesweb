'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSettings } from '@/components/providers/SettingsProvider';

const NAV_LINKS = [
  { label: 'Inmuebles', href: '/venta' },
  { label: 'Alquileres', href: '/alquiler' },
  { label: 'Administración', href: '/administracion' },
  { label: 'Contacto', href: '/contacto' },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const settings = useSettings();

  // Cerrar menú móvil al cambiar de ruta
  React.useEffect(() => {
    React.startTransition(() => setIsMobileMenuOpen(false));
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white border-b border-border py-2 shadow-sm shadow-black/5`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="relative z-50 flex items-center shrink-0">
            <div className={`relative transition-all duration-300 w-16 h-10 md:w-24 md:h-14`}>
              <Image
                src="/logo-blanco.jpg"
                alt="Villalba Martinez"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-sans uppercase tracking-widest transition-colors duration-300 ${
                  pathname === link.href
                    ? 'text-brand'
                    : 'text-foreground hover:text-brand'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>


          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden relative z-50 p-2 -mr-2 transition-colors duration-300 text-foreground`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8">
              <Link href="/" className="mb-4 relative w-32 h-20">
                <Image
                  src="/logo.png"
                  alt="Villalba Martinez"
                  fill
                  className="object-contain"
                />
              </Link>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-xl font-sans uppercase tracking-widest transition-colors ${
                    pathname === link.href ? 'text-brand' : 'text-foreground hover:text-brand'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`https://api.whatsapp.com/send?phone=${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 bg-brand text-white font-sans text-sm uppercase tracking-widest px-8 py-3"
              >
                Consultar por WhatsApp
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
