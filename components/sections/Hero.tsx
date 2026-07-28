'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const IMAGES = ['/bg-1.jpg', '/bg-2.jpg', '/bg-4.jpg'];

export function Hero() {
  const [currentImage, setCurrentImage] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % IMAGES.length);
    }, 6000); // Cambia de imagen cada 6 segundos
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[100dvh] min-h-[700px] overflow-hidden bg-foreground">
      
      {/* Background slider with Ken Burns effect */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              opacity: { duration: 1.5, ease: "easeInOut" },
              scale: { duration: 8, ease: "easeOut" }
            }}
            className="absolute inset-0 w-full h-full origin-center"
          >
            <Image
              src={IMAGES[currentImage]}
              alt="Propiedades exclusivas"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradientes más sofisticados */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
      </div>

      {/* Contenido — diseño asimétrico editorial */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 max-w-[1400px] mx-auto w-full">
        
        <div className="max-w-3xl mt-20">


          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] tracking-tight mb-8">
              Tu próxima <br/>
              <span className="italic text-white/90">propiedad</span> <br/>
              está aquí.
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-sans text-white/70 text-lg md:text-xl font-light max-w-lg leading-relaxed mb-12">
              Venta, alquiler y administración de inmuebles en los mejores barrios de la provincia.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" variant="filled" className="bg-brand text-white hover:bg-brand/90 px-8 py-6 text-sm">
              <Link href="/venta">Descubrir Propiedades</Link>
            </Button>
            <Button size="lg" variant="line" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto font-sans">
              <Link href="/contacto">Hablar con un Asesor</Link>
            </Button>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
