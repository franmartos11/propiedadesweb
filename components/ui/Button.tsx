'use client';

import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'line' | 'filled' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'line', size = 'md', children, ...props }, ref) => {
    
    const baseStyles = 'inline-flex items-center justify-center font-sans transition-all duration-300 ease-out focus:outline-none cursor-pointer';
    let variantStyles = '';
    let sizeStyles = '';

    switch (variant) {
      case 'filled':
        variantStyles = 'bg-gold text-background hover:bg-gold-hover';
        break;
      case 'ghost':
        variantStyles = 'bg-transparent text-foreground hover:text-gold';
        break;
      case 'line':
      default:
        // Botón estilo "línea" sin borde curvo, con underline interactivo
        variantStyles = 'relative bg-transparent text-foreground after:content-[""] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-gold hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300';
        break;
    }

    switch (size) {
      case 'sm':
        sizeStyles = 'text-sm px-4 py-2';
        break;
      case 'lg':
        sizeStyles = 'text-lg px-8 py-4';
        break;
      case 'md':
      default:
        sizeStyles = 'text-base px-6 py-3';
        break;
    }

    // Para la variante line, ajustamos el padding
    if (variant === 'line') {
      sizeStyles = 'text-base py-2';
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
