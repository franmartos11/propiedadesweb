'use client';

import { useState, useCallback, useEffect, RefObject } from 'react';

export function useCarousel(itemCount: number, scrollerRef: RefObject<HTMLElement | null>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Mover a un índice específico
  const scrollToIndex = useCallback((index: number) => {
    if (!scrollerRef.current) return;
    
    // Asumimos que los hijos directos son los slides
    const children = Array.from(scrollerRef.current.children);
    if (children[index]) {
      const child = children[index] as HTMLElement;
      scrollerRef.current.scrollTo({
        left: child.offsetLeft,
        behavior: 'smooth'
      });
    }
    setActiveIndex(index);
  }, [scrollerRef]);

  // Actualizar índice activo al hacer scroll manual
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleScroll = () => {
      const scrollLeft = scroller.scrollLeft;
      const width = scroller.clientWidth;
      
      // Calculamos qué slide está más centrado
      const newIndex = Math.round(scrollLeft / width);
      
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < itemCount) {
        setActiveIndex(newIndex);
      }
    };

    scroller.addEventListener('scroll', handleScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, [scrollerRef, activeIndex, itemCount]);

  const next = useCallback(() => {
    scrollToIndex((activeIndex + 1) % itemCount);
  }, [activeIndex, itemCount, scrollToIndex]);

  const prev = useCallback(() => {
    scrollToIndex((activeIndex - 1 + itemCount) % itemCount);
  }, [activeIndex, itemCount, scrollToIndex]);

  return {
    activeIndex,
    scrollToIndex,
    next,
    prev,
    isHovered,
    setIsHovered,
  };
}
