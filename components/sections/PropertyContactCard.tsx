'use client';

import * as React from 'react';
import { useState } from 'react';
import { MessageCircle, Share2, Check, Send } from 'lucide-react';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { useSettings } from '@/components/providers/SettingsProvider';

interface Props {
  propertyName: string;
  propertySlug: string;
  propertyId: string;
  propertyType: 'Venta' | 'Arriendo';
}

export function PropertyContactCard({ propertyName, propertySlug, propertyId, propertyType }: Props) {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState('');
  const { trackWhatsAppClick } = useAnalytics();
  const settings = useSettings();
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });

  React.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const propertyUrl = `${origin || 'https://villalbamartinez.com.ar'}/propiedades/${propertySlug}`;

  const whatsappMessage = encodeURIComponent(
    `Hola! Me interesa la propiedad "${propertyName}". ¿Podrían darme más información?\n\n${propertyUrl}`
  );
  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${whatsappMessage}`;

  const handleLocalTrackInquiry = () => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'property_inquiry',
        propertyId,
        propertyType,
      }),
    }).catch(console.error);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: propertyName, url: propertyUrl });
      } catch {/* cancelled */}
    } else {
      await navigator.clipboard.writeText(propertyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          telefono: formData.telefono,
          email: formData.email,
          servicio: propertyName,
          mensaje: formData.mensaje
        }),
      });
      
      handleLocalTrackInquiry();
      setSent(true);
      setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-border p-6 md:p-8 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
      <div className="mb-5">
        <h3 className="font-sans text-xl font-bold">Consulta por esta propiedad</h3>
        <p className="text-gray text-sm mt-0.5">Un asesor te responderá a la brevedad.</p>
      </div>

      {sent ? (
        <div className="py-8 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Check size={24} className="text-green-600" />
          </div>
          <p className="font-sans font-semibold text-foreground">¡Consulta enviada!</p>
          <p className="text-sm text-gray">Te contactaremos muy pronto.</p>
        </div>
      ) : (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre completo"
            required
            value={formData.nombre}
            onChange={(e) => setFormData(p => ({ ...p, nombre: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand/20 focus:bg-white transition-all font-sans text-sm"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            required
            value={formData.email}
            onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand/20 focus:bg-white transition-all font-sans text-sm"
          />
          <input
            type="tel"
            placeholder="Teléfono"
            required
            value={formData.telefono}
            onChange={(e) => setFormData(p => ({ ...p, telefono: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand/20 focus:bg-white transition-all font-sans text-sm"
          />
          <textarea
            placeholder="¡Hola! Me interesa esta propiedad..."
            rows={3}
            value={formData.mensaje}
            onChange={(e) => setFormData(p => ({ ...p, mensaje: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand/20 focus:bg-white transition-all font-sans text-sm resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white hover:bg-brand-hover transition-colors py-3.5 text-sm font-semibold mt-1 cursor-pointer rounded-lg flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
          >
            <Send size={15} />
            {loading ? 'Enviando...' : 'Enviar consulta'}
          </button>
        </form>
      )}

      <div className="mt-3 flex flex-col gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackWhatsAppClick('property_page', propertySlug);
            handleLocalTrackInquiry();
          }}
          className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1fba58] transition-colors text-white py-3.5 text-sm font-semibold cursor-pointer rounded-lg shadow-sm"
        >
          <MessageCircle size={18} />
          Consultar por WhatsApp
        </a>
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2.5 bg-background border border-border hover:bg-black/5 hover:border-gray transition-colors text-foreground py-3.5 text-sm font-semibold cursor-pointer rounded-lg shadow-sm"
        >
          {copied ? <Check size={18} className="text-green-600" /> : <Share2 size={18} />}
          {copied ? 'Enlace copiado' : 'Compartir propiedad'}
        </button>
      </div>
    </div>
  );
}
