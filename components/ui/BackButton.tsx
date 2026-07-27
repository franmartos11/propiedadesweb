'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  label?: string;
  href?: string;
}

export function BackButton({ label = 'Volver', href }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 text-gray hover:text-foreground transition-colors group font-sans text-sm font-medium cursor-pointer"
    >
      <ChevronLeft
        size={18}
        className="transform transition-transform group-hover:-translate-x-0.5"
      />
      {label}
    </button>
  );
}
