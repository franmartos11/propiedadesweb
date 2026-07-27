'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useComparatorStore } from '@/store/comparator';
import { Scale, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ComparatorBar() {
  const { propertyIds, clear } = useComparatorStore();
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Don't show in admin panel or if no properties selected
  if (pathname.startsWith('/admin') || propertyIds.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm sm:max-w-md bg-white border border-border shadow-2xl rounded-2xl overflow-hidden p-4 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center shrink-0">
            <Scale size={20} className="text-brand" />
          </div>
          <div>
            <p className="font-sans text-sm font-semibold text-foreground leading-tight">
              {propertyIds.length} propiedad{propertyIds.length > 1 ? 'es' : ''}
            </p>
            <p className="font-sans text-xs text-gray">Lista para comparar</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clear}
            className="p-2 text-gray hover:text-foreground transition-colors cursor-pointer"
            title="Limpiar"
          >
            <X size={18} />
          </button>
          
          <Link
            href="/comparar"
            className="flex items-center gap-2 px-4 py-2 bg-brand text-white font-sans text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-brand-hover transition-colors"
          >
            Comparar
            <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
