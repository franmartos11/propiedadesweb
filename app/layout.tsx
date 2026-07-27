import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ComparatorBar } from "@/components/ui/ComparatorBar";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { getSettings } from "@/lib/data/settings";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: '%s | Villalba Martinez',
    default: 'Villalba Martinez Propiedades | Venta, Alquiler y Administración en Córdoba',
  },
  description: 'Inmobiliaria de confianza en Córdoba. Venta, alquiler y administración de inmuebles con más de 15 años de experiencia.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = getSettings();

  return (
    <html lang="es" className={`${dmSans.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <SettingsProvider settings={settings}>
          {children}
          <ComparatorBar />
          {/* Botón flotante de WhatsApp — crítico para mercado argentino */}
          <WhatsAppButton />
          <Analytics />
        </SettingsProvider>
      </body>
    </html>
  );
}
