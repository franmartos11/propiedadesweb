import * as React from 'react';

type BadgeType = 'VENTA' | 'ALQUILER' | 'ADMINISTRACIÓN';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: BadgeType;
}

export function Badge({ type, className = '', ...props }: BadgeProps) {
  let typeStyles = '';

  switch (type) {
    case 'VENTA':
      typeStyles = 'bg-brand text-white border-transparent';
      break;
    case 'ALQUILER':
      typeStyles = 'bg-foreground text-white border-transparent';
      break;
    case 'ADMINISTRACIÓN':
      typeStyles = 'bg-surface text-foreground border border-border';
      break;
  }

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 text-[10px] sm:text-[11px] font-sans font-medium tracking-widest uppercase ${typeStyles} ${className}`}
      {...props}
    >
      {type}
    </span>
  );
}
