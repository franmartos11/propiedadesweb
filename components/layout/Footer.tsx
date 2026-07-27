import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Phone } from 'lucide-react';
import { getSettings } from '@/lib/data/settings';

export function Footer() {
  const settings = getSettings();

  return (
    <footer className="bg-white border-t border-border">
      <div className="container mx-auto px-6 md:px-12 py-16 md:py-20">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Branding */}
          <div>
            <div className="mb-6 relative w-48 h-24">
              <Image
                src="/logo-blanco.jpg"
                alt="Villalba Martinez"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="font-sans text-gray text-sm leading-relaxed max-w-xs">
              Una inmobiliaria de confianza, que te acompaña en el proceso de compra, venta y alquiler con el profesionalismo necesario para cumplir tu sueño.
            </p>
            <div className="flex gap-5 mt-8">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray hover:text-brand transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a
                href="https://www.facebook.com/Inmobiliariavillalbamartinez/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray hover:text-brand transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="font-sans text-[11px] uppercase tracking-[0.25em] text-foreground mb-6 font-bold">Servicios</h3>
            <nav className="flex flex-col gap-4">
              {[
                { label: 'Propiedades en Venta', href: '/venta' },
                { label: 'Alquileres', href: '/alquiler' },
                { label: 'Administración de Inmuebles', href: '/administracion' },
                { label: 'Contacto', href: '/contacto' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-sm text-gray hover:text-brand transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-sans text-[11px] uppercase tracking-[0.25em] text-foreground mb-6 font-bold">Contacto</h3>
            <div className="flex flex-col gap-4">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-gray hover:text-brand transition-colors group font-medium"
              >
                <MapPin size={18} className="shrink-0 mt-0.5 group-hover:text-brand transition-colors text-brand" />
                {settings.address}
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-3 text-sm text-gray hover:text-brand transition-colors group font-medium"
              >
                <Mail size={18} className="shrink-0 group-hover:text-brand transition-colors text-brand" />
                {settings.email}
              </a>
              <a
                href={`https://api.whatsapp.com/send?phone=${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray hover:text-brand transition-colors group font-medium"
              >
                <Phone size={18} className="shrink-0 group-hover:text-brand transition-colors text-brand" />
                +{settings.whatsapp}
              </a>
            </div>
          </div>

          {/* Membresías */}
          <div>
            <h3 className="font-sans text-[11px] uppercase tracking-[0.25em] text-foreground mb-6 font-bold">Miembro De</h3>
            <div className="flex flex-col gap-5 max-w-[220px]">
              {/* CaCIC */}
              <div className="relative w-full h-10">
                <Image
                  src="/cacic.jpg"
                  alt="CaCIC"
                  fill
                  className="object-contain object-left"
                />
              </div>
              
              {/* MLS y CRS en una fila */}
              <div className="flex gap-4 h-14">
                <div className="relative flex-[3]">
                  <Image
                    src="/mls.jpg"
                    alt="MLS Córdoba"
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <div className="relative flex-[2]">
                  <Image
                    src="/crs.png"
                    alt="CRS Argentina"
                    fill
                    className="object-contain object-left"
                  />
                </div>
              </div>

              {/* CPI Córdoba */}
              <div className="relative w-full h-12">
                <Image
                  src="/cpcpi.png"
                  alt="CPI Córdoba"
                  fill
                  className="object-contain object-left"
                />
              </div>

              <p className="font-sans text-xs font-semibold text-foreground/80 mt-1">
                CPI-7295
              </p>
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-8 border-t border-border text-xs text-gray font-sans gap-4">
          <p>© {new Date().getFullYear()} Villalba Martinez Propiedades. Todos los derechos reservados.</p>
          <p>Corredor Inmobiliario Matrícula CPI-7295</p>
        </div>
      </div>
    </footer>
  );
}
