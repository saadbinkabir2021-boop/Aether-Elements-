import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float, Torus, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Extending JSX.IntrinsicElements to satisfy TypeScript compiler for R3F elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      torusGeometry: any;
    }
  }
}

const HeroAtom = ({ position, color, scale = 1 }: { position: [number, number, number], color: string, scale?: number }) => {
    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <group position={position} scale={scale}>
                {/* Nucleus */}
                <Sphere args={[0.35, 32, 32]}>
                    <MeshDistortMaterial 
                        color={color} 
                        emissive={color}
                        emissiveIntensity={1.2}
                        speed={2}
                        distort={0.4}
                        roughness={0}
                        metalness={1}
                    />
                </Sphere>
                <pointLight distance={3} intensity={3} color={color} />

                {/* Orbitals */}
                <ElectronOrbit radius={0.9} speed={1.5} color={color} />
                <ElectronOrbit radius={1.2} speed={1.2} axis={[1, 0.4, 0]} color={color} />
                <ElectronOrbit radius={1.5} speed={0.8} axis={[0.2, 1, 0.2]} color={color} />
            </group>
        </Float>
    );
}

const ElectronOrbit = ({ radius, speed, axis = [0,0,0], color }: any) => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame(({ clock }) => {
        if(groupRef.current) {
            groupRef.current.rotation.x += 0.005 * speed;
            groupRef.current.rotation.y += 0.005 * speed;
            groupRef.current.rotation.z += 0.005 * speed;
        }
    });

    return (
        <group rotation={[axis[0], axis[1], axis[2]]}>
             <group ref={groupRef}>
                {/* Orbital Ring */}
                <Torus args={[radius, 0.008, 12, 64]}>
                    <meshBasicMaterial color={color} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
                </Torus>
                {/* Electron */}
                <mesh position={[radius, 0, 0]}>
                    <sphereGeometry args={[0.04, 16, 16]} />
                    <meshBasicMaterial color={color} toneMapped={false} />
                </mesh>
             </group>
        </group>
    )
}

const FloatingHexagon = ({ position, rotation = [0,0,0], scale = 1, color = "#ffffff" }: any) => {
    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={position} rotation={rotation} scale={scale}>
                {/* Hexagon shape using Torus with 6 tubular segments */}
                <Torus args={[1, 0.02, 4, 6]}>
                    <meshBasicMaterial color={color} transparent opacity={0.05} blending={THREE.AdditiveBlending} />
                </Torus>
            </group>
        </Float>
    )
}

interface HeroProps {
    onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);
    const y = useTransform(scrollY, [0, 500], [0, 100]);

    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#020204]">
            {/* Background 3D Scene */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 6] }} gl={{ antialias: true }}>
                    <ambientLight intensity={0.2} />
                    <directionalLight position={[10, 10, 5]} intensity={1} color="#b026ff" />
                    <directionalLight position={[-10, -10, -5]} intensity={1} color="#00f3ff" />
                    
                    <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
                    
                    <HeroAtom position={[-1.8, 0.5, 0]} color="#00f3ff" scale={1.2} />
                    <HeroAtom position={[1.8, -0.5, 0]} color="#b026ff" scale={1} />
                    <HeroAtom position={[0, 1.5, -2]} color="#ffffff" scale={0.8} />

                    <FloatingHexagon position={[0, 0, -1]} scale={3} rotation={[0, 0, Math.PI/2]} color="#2d6cdf" />
                    <FloatingHexagon position={[-3, -2, -2]} scale={2} rotation={[0.5, 0.5, 0]} color="#ff00aa" />
                    <FloatingHexagon position={[3, 2, -2]} scale={2} rotation={[-0.5, -0.5, 0]} color="#00f3ff" />
                </Canvas>
            </div>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-[#030305]/50 z-10" />

            {/* Content */}
            <motion.div 
                style={{ opacity, y }}
                className="relative z-20 text-center px-4 max-w-5xl mx-auto"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    <span className="inline-block py-1 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono text-neon-cyan mb-8 tracking-[0.3em] uppercase shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                        System 118
                    </span>
                    <h1 className="text-6xl md:text-9xl font-bold font-display tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/20">
                        AETHER<br />ELEMENTS
                    </h1>
                    <p className="text-lg md:text-xl text-white/50 font-light max-w-2xl mx-auto mb-12 leading-relaxed tracking-wide">
                        A digital exploration of matter. Experience the periodic table through a lens of luxury, light, and motion.
                    </p>
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onExplore}
                        className="group relative px-10 py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white font-medium rounded-none uppercase tracking-widest overflow-hidden hover:bg-white/10 transition-all duration-300"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                        <span className="relative z-10 flex items-center justify-center gap-3">
                           Explore Collection
                        </span>
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
                animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
            >
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
            </motion.div>
        </section>
    );
};