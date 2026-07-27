'use client';

import * as React from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  format?: (value: number) => string;
  className?: string;
}

export function AnimatedNumber({
  value,
  duration = 2,
  format = (v) => Math.round(v).toString(),
  className = '',
}: AnimatedNumberProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const motionValue = useMotionValue(0);
  const roundedValue = useTransform(motionValue, (latest) => format(latest));

  React.useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, {
        duration,
        ease: 'easeOut',
      });
      return controls.stop;
    }
  }, [motionValue, value, duration, isInView]);

  return <motion.span ref={ref} className={className}>{roundedValue}</motion.span>;
}
