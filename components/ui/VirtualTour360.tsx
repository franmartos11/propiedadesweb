'use client';

import * as React from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface VirtualTour360Props {
  imageUrl: string;
}

function Sphere({ imageUrl }: { imageUrl: string }) {
  // Cargamos la textura equirectangular
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  
  // Para que la imagen panorámica se vea correctamente mapeada por dentro
  // de la esfera, necesitamos invertirla horizontalmente.
  // texture.wrapS = THREE.RepeatWrapping;
  // texture.repeat.x = -1;

  return (
    <mesh>
      {/* Esfera gigante que envuelve a la cámara (radius 500) */}
      <sphereGeometry args={[500, 60, 40]} />
      {/* 
        Mapeamos la textura en la cara interna (BackSide) de la esfera,
        así podemos "estar adentro" de la foto.
      */}
      <meshBasicMaterial 
        map={texture} 
        side={THREE.BackSide} 
      />
    </mesh>
  );
}

export function VirtualTour360({ imageUrl }: VirtualTour360Props) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing bg-black">
      <Canvas camera={{ position: [0, 0, 0.1] }}>
        <React.Suspense fallback={null}>
          <Sphere imageUrl={imageUrl} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            enableDamping 
            dampingFactor={0.05} 
            rotateSpeed={-0.5} // Invertimos controles porque estamos dentro de la esfera
          />
        </React.Suspense>
      </Canvas>

      {/* Helper para avisar que se puede arrastrar (se oculta al pasar el mouse) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 hover:opacity-0 transition-opacity duration-700">
        <div className="bg-black/50 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M9 19l3 3 3-3M2 12h20M12 2v20"/>
          </svg>
          <span className="text-white font-sans text-sm tracking-widest uppercase">Arrastrá para mirar</span>
        </div>
      </div>
    </div>
  );
}
