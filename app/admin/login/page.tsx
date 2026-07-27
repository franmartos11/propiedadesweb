'use client';

import { useActionState } from 'react';
import { loginAction } from '@/lib/auth/actions';
import Image from 'next/image';

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C1121F]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C1121F]/3 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="relative w-48 h-24 bg-white rounded-xl p-2">
            <Image
              src="/logo-blanco.jpg"
              alt="Villalba Martinez"
              fill
              className="object-contain p-2"
              priority
            />
          </div>
        </div>

        {/* Card de Login */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <div className="mb-8">
            <p className="text-white/40 font-sans text-xs uppercase tracking-[0.3em] mb-2">Panel Privado</p>
            <h1 className="font-serif text-3xl text-white">Acceder al Admin</h1>
          </div>

          <form action={action} className="space-y-5">
            <div>
              <label htmlFor="email" className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@ejemplo.com"
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-[#C1121F]/50 focus:bg-white/15 transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/20 font-sans text-sm focus:outline-none focus:border-[#C1121F]/50 focus:bg-white/15 transition-all"
              />
            </div>

            {state?.error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="font-sans text-sm text-red-400">{state.error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3.5 bg-[#C1121F] hover:bg-[#A00F18] text-white font-sans text-sm uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {pending ? 'Iniciando sesión...' : 'Ingresar al Panel'}
            </button>
          </form>
        </div>

        <p className="text-center font-sans text-xs text-white/20 mt-6">
          Acceso restringido · Villalba Martinez Propiedades
        </p>
      </div>
    </div>
  );
}
