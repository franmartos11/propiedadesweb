'use client';

import * as React from 'react';
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';

interface VirtualTour360Props {
  imageUrl: string;
  isActive?: boolean;
}

function Sphere({ imageUrl }: { imageUrl: string }) {
  const texture = useLoader(THREE.TextureLoader, imageUrl, (loader) => {
    loader.setCrossOrigin('anonymous');
  });

  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function AutoRotateController({
  controlsRef,
}: {
  controlsRef: React.RefObject<OrbitControlsType | null>;
}) {
  const idleTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const { gl } = useThree();

  React.useEffect(() => {
    const canvas = gl.domElement;

    const onStart = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (controlsRef.current) controlsRef.current.autoRotate = false;
    };

    const onStop = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        if (controlsRef.current) controlsRef.current.autoRotate = true;
      }, 2500);
    };

    canvas.addEventListener('pointerdown', onStart);
    canvas.addEventListener('pointerup', onStop);
    canvas.addEventListener('touchstart', onStart);
    canvas.addEventListener('touchend', onStop);

    return () => {
      canvas.removeEventListener('pointerdown', onStart);
      canvas.removeEventListener('pointerup', onStop);
      canvas.removeEventListener('touchstart', onStart);
      canvas.removeEventListener('touchend', onStop);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [gl, controlsRef]);

  useFrame(() => {
    if (controlsRef.current) controlsRef.current.update();
  });

  return null;
}

export function VirtualTour360({ imageUrl, isActive = true }: VirtualTour360Props) {
  const [hintVisible, setHintVisible] = React.useState(true);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const controlsRef = React.useRef<OrbitControlsType | null>(null);

  const handleFirstInteract = React.useCallback(() => {
    setHintVisible(false);
  }, []);

  const toggleFullscreen = React.useCallback(async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  React.useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative cursor-grab active:cursor-grabbing bg-black"
      onPointerDown={handleFirstInteract}
      onTouchStart={handleFirstInteract}
    >
      <Canvas camera={{ position: [0, 0, 0.1], fov: 90 }}>
        <React.Suspense fallback={null}>
          <Sphere imageUrl={imageUrl} />
          <OrbitControls
            ref={controlsRef}
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.07}
            rotateSpeed={-0.5}
            autoRotate={true}
            autoRotateSpeed={0.4}
            minPolarAngle={Math.PI * 0.15}
            maxPolarAngle={Math.PI * 0.85}
          />
          <AutoRotateController controlsRef={controlsRef} />
        </React.Suspense>
      </Canvas>

      {/* Drag hint — fade out tras primera interacción */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${hintVisible ? 'opacity-70' : 'opacity-0'}`}
      >
        <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 animate-pulse">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M9 19l3 3 3-3M2 12h20M12 2v20" />
          </svg>
          <span className="text-white font-sans text-sm tracking-widest uppercase">Arrastrá para mirar</span>
        </div>
      </div>

      {/* Botón pantalla completa */}
      {isActive && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full transition-colors backdrop-blur-sm z-10"
          title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        >
          {isFullscreen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
