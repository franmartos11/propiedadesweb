'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { logoutAction } from '@/lib/auth/actions';
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  LogOut,
  ChevronRight,
  Inbox,
  Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Bandeja de Leads', href: '/admin/leads', icon: Inbox },
  { label: 'Propiedades', href: '/admin/propiedades', icon: Building2 },
  { label: 'Analítica', href: '/admin/analitica', icon: BarChart3 },
  { label: 'Configuración', href: '/admin/configuracion', icon: Settings },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      logoutAction();
    });
  };

  return (
    <aside className="w-64 min-h-screen bg-[#0f0f0f] border-r border-white/5 flex flex-col fixed left-0 top-0 z-40">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#C1121F] rounded-lg flex items-center justify-center">
            <span className="text-white font-serif font-bold text-sm">VM</span>
          </div>
          <div>
            <p className="text-white font-sans text-sm font-semibold leading-tight">Admin Panel</p>
            <p className="text-white/30 font-sans text-xs leading-tight">Villalba Martinez</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm transition-all group ${
                isActive
                  ? 'bg-[#C1121F] text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} className="opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer: User + Logout */}
      <div className="p-4 border-t border-white/5 space-y-3">
        <div className="px-3 py-2">
          <p className="text-white/30 font-sans text-xs uppercase tracking-widest mb-1">Sesión activa</p>
          <p className="text-white/70 font-sans text-xs truncate">{email}</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 font-sans text-sm transition-all disabled:opacity-50"
        >
          <LogOut size={18} className="shrink-0" />
          <span>{isPending ? 'Saliendo...' : 'Cerrar sesión'}</span>
        </button>
      </div>
    </aside>
  );
}
