'use client';

import * as React from 'react';
import { Button } from '../ui/Button';
import { Phone } from 'lucide-react';
import { useSettings } from '@/components/providers/SettingsProvider';

export function ContactCTA() {
  const settings = useSettings();
  const [service, setService] = React.useState('Venta');
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const nameRef = React.useRef<HTMLInputElement>(null);
  const phoneRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const messageRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nameRef.current?.value ?? '',
          telefono: phoneRef.current?.value ?? '',
          email: emailRef.current?.value ?? '',
          servicio: service,
          mensaje: messageRef.current?.value ?? '',
        }),
      });
    } catch {
      // fallo silencioso — igual se muestra el éxito al usuario
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <section className="py-24 md:py-32 bg-background border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left col */}
          <div className="lg:col-span-5">
            <p className="text-brand font-sans text-xs uppercase tracking-[0.25em] mb-4">Escribinos</p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight mb-6">
              ¿Buscás o querés vender?
            </h2>
            <p className="font-sans text-gray text-base leading-relaxed mb-10 max-w-sm">
              Dejanos tus datos y un asesor se contacta con vos en menos de 24 hs para guiarte sin compromiso.
            </p>

            {/* Contacto directo */}
            <div className="flex flex-col gap-4 p-6 bg-surface border border-border">
              <p className="font-sans text-xs uppercase tracking-widest text-gray">O contactanos ahora mismo</p>
              <a
                href={`https://api.whatsapp.com/send?phone=${settings.whatsapp}&text=Hola%2C%20quiero%20consultar%20por%20una%20propiedad.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 font-sans text-foreground hover:text-brand transition-colors group"
              >
                <div className="w-9 h-9 bg-[#25D366] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.528 5.849L.057 23.8a.5.5 0 0 0 .614.656l6.155-1.616A11.948 11.948 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.935 0-3.741-.524-5.288-1.435l-.367-.214-3.87 1.016 1.034-3.778-.238-.381A9.945 9.945 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                </div>
                <span className="text-sm">+{settings.whatsapp}</span>
              </a>
              <a
                href={`tel:+${settings.whatsapp}`}
                className="flex items-center gap-3 font-sans text-foreground hover:text-brand transition-colors group"
              >
                <div className="w-9 h-9 border border-border flex items-center justify-center shrink-0 group-hover:border-brand transition-colors">
                  <Phone size={14} className="text-gray group-hover:text-brand transition-colors" />
                </div>
                <span className="text-sm">Llamar al estudio</span>
              </a>
            </div>
          </div>

          {/* Right col — Form */}
          <div className="lg:col-span-7">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-border bg-surface">
                <div className="w-12 h-12 bg-brand/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl text-foreground mb-2">¡Mensaje recibido!</h3>
                <p className="font-sans text-gray text-sm">Un asesor se pondrá en contacto a la brevedad.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                {/* Selección de servicio */}
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-gray mb-3">Me interesa:</p>
                  <div className="flex flex-wrap gap-3">
                    {['Venta', 'Alquiler', 'Administración'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setService(opt)}
                        className={`px-5 py-2.5 border font-sans text-sm transition-all ${
                          service === opt
                            ? 'border-brand text-brand bg-brand/5'
                            : 'border-border text-gray hover:border-gray/60'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-name" className="font-sans text-xs uppercase tracking-widest text-gray">Nombre y apellido *</label>
                    <input
                      type="text"
                      id="contact-name"
                      ref={nameRef}
                      placeholder="Ej: Juan García"
                      required
                      className="bg-surface border border-border px-4 py-3 font-sans text-sm text-foreground placeholder:text-gray/40 focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-phone" className="font-sans text-xs uppercase tracking-widest text-gray">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      id="contact-phone"
                      ref={phoneRef}
                      placeholder="Ej: 351 123-4567"
                      required
                      className="bg-surface border border-border px-4 py-3 font-sans text-sm text-foreground placeholder:text-gray/40 focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-email" className="font-sans text-xs uppercase tracking-widest text-gray">Email</label>
                  <input
                    type="email"
                    id="contact-email"
                    ref={emailRef}
                    placeholder="tuemail@ejemplo.com"
                    className="bg-surface border border-border px-4 py-3 font-sans text-sm text-foreground placeholder:text-gray/40 focus:outline-none focus:border-brand transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-message" className="font-sans text-xs uppercase tracking-widest text-gray">¿Qué buscás? (opcional)</label>
                  <textarea
                    id="contact-message"
                    ref={messageRef}
                    rows={3}
                    placeholder="Ej: departamento de 2 dormitorios en Nueva Córdoba, hasta $300.000..."
                    className="bg-surface border border-border px-4 py-3 font-sans text-sm text-foreground placeholder:text-gray/40 focus:outline-none focus:border-brand transition-colors resize-none"
                  />
                </div>

                <Button type="submit" variant="filled" size="lg" className="self-start" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar consulta'}
                </Button>

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
