import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus, Trail, Float, Stars, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { ChemicalElement, ElementCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';

// Extending JSX.IntrinsicElements to satisfy TypeScript compiler for R3F elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      meshBasicMaterial: any;
      meshStandardMaterial: any;
      torusGeometry: any;
      icosahedronGeometry: any;
      ambientLight: any;
      pointLight: any;
    }
  }
}

interface AtomProps {
  element: ChemicalElement;
}

// Mapping for noble gas core expansion to simplify parsing
const NOBLE_GAS_CONFIGS: Record<string, string> = {
  'He': '1s2',
  'Ne': '1s2 2s2 2p6',
  'Ar': '1s2 2s2 2p6 3s2 3p6',
  'Kr': '1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6',
  'Xe': '1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6',
  'Rn': '1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6', 
};

interface ParsedOrbital {
    n: number;
    l: string;
    count: number;
}

const parseElectronConfig = (config: string): ParsedOrbital[] => {
    let current = config;
    
    // Recursive expansion of noble gas cores
    let expanded = false;
    let iterations = 0;
    while(current.includes('[') && iterations < 5) {
        current = current.replace(/\[(.*?)\]/g, (match, sym) => {
            return NOBLE_GAS_CONFIGS[sym] || '';
        });
        iterations++;
    }

    const parts = current.trim().split(/\s+/);
    const result: ParsedOrbital[] = [];

    parts.forEach(part => {
        // Regex to match configuration parts like 1s2, 3d10
        const match = part.match(/^(\d+)([spdf])(\d+)$/);
        if (match) {
            result.push({
                n: parseInt(match[1]),
                l: match[2],
                count: parseInt(match[3])
            });
        }
    });

    return result;
};

const Electron = ({ radius, speed, offset, color }: { radius: number, speed: number, offset: number, color: string }) => {
    const ref = useRef<THREE.Group>(null);
    
    useFrame(({ clock }) => {
        if (ref.current) {
            const t = clock.getElapsedTime() * speed + offset;
            ref.current.position.x = Math.cos(t) * radius;
            ref.current.position.y = Math.sin(t) * radius;
            ref.current.position.z = 0; 
            // Local rotation of the electron group
            ref.current.rotation.z = t * 2;
        }
    });

    return (
        <group ref={ref}>
            <Trail
                width={0.5}
                length={4}
                color={new THREE.Color(color).clone().multiplyScalar(2)} 
                attenuation={(t) => t * t}
            >
                <Sphere args={[0.08, 16, 16]}>
                    <meshBasicMaterial color={color} toneMapped={false} />
                </Sphere>
            </Trail>
        </group>
    );
}

const Subshell = ({ n, l, count, color }: { n: number, l: string, count: number, color: string }) => {
    // Radius logic: Principal quantum number determines shell distance
    const radius = 1.0 + (n * 0.6); 

    // Determine number of visual orbits based on subshell type
    // s (spherical) -> 1 orbit
    // p (dumbbell) -> 3 orbits (x,y,z)
    // d -> 5 orbits
    // f -> 7 orbits
    let orbitCount = 1;
    if (l === 'p') orbitCount = 3;
    if (l === 'd') orbitCount = 5;
    if (l === 'f') orbitCount = 7;

    const orbits = useMemo(() => {
        const generatedOrbits = [];
        // Electrons to distribute
        let remainingElectrons = count;
        
        for (let i = 0; i < orbitCount; i++) {
            // Distribute electrons as evenly as possible
            const electronsForThisOrbit = Math.ceil(remainingElectrons / (orbitCount - i));
            remainingElectrons -= electronsForThisOrbit;
            
            if (electronsForThisOrbit <= 0) break;

            // Generate rotation matrix for this specific orbital ring
            // We want them distributed in 3D space
            // For 'p', 90 deg offsets are traditional, for others, spread them out
            const rotation: [number, number, number] = [
                Math.random() * Math.PI, 
                Math.random() * Math.PI, 
                Math.random() * Math.PI
            ];
            
            generatedOrbits.push({
                rotation,
                electrons: electronsForThisOrbit,
                // Inner shells move faster
                speed: (1.5 / Math.sqrt(n)) * (i % 2 === 0 ? 1 : -1) 
            });
        }
        return generatedOrbits;
    }, [n, l, count, orbitCount]);

    return (
        <group>
            {orbits.map((orbit, i) => (
                <group key={i} rotation={orbit.rotation}>
                    {/* The Orbital Path */}
                    <Torus args={[radius, 0.015, 16, 100]}>
                        <meshBasicMaterial 
                            color={color} 
                            transparent 
                            opacity={0.15} 
                            blending={THREE.AdditiveBlending} 
                        />
                    </Torus>
                    
                    {/* Electrons on this path */}
                    {new Array(orbit.electrons).fill(0).map((_, j) => (
                        <Electron 
                            key={j} 
                            radius={radius} 
                            speed={orbit.speed} 
                            offset={(Math.PI * 2 / orbit.electrons) * j} 
                            color={color} 
                        />
                    ))}
                </group>
            ))}
        </group>
    );
};

const Nucleus = ({ color, atomicNumber }: { color: string, atomicNumber: number }) => {
    // Nucleus size scales slightly with atomic number but is capped
    // Base size 0.5 up to 0.9
    const scale = Math.min(0.5 + (atomicNumber * 0.005), 1.2);
    const wireframeRef = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (wireframeRef.current) {
            // Rotate the geometric shell
            wireframeRef.current.rotation.x = t * 0.3;
            wireframeRef.current.rotation.y = t * 0.2;
        }
    });
    
    return (
        <group>
            <Float speed={3} rotationIntensity={1} floatIntensity={0.2}>
                {/* 1. The Dense Energy Core */}
                <Sphere args={[scale * 0.5, 64, 64]}>
                    <MeshDistortMaterial 
                        color={color} 
                        emissive={color}
                        emissiveIntensity={1.5}
                        toneMapped={false}
                        roughness={0.1}
                        metalness={0.8}
                        distort={0.5} // High distortion for liquid energy look
                        speed={4}     // Fast movement
                    />
                </Sphere>

                {/* 2. Geometric Containment Field / Structure */}
                <mesh ref={wireframeRef}>
                    <icosahedronGeometry args={[scale * 0.8, 1]} />
                    <meshStandardMaterial 
                        color={color}
                        emissive={color}
                        emissiveIntensity={0.2}
                        wireframe
                        transparent
                        opacity={0.3}
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* 3. Ambient Glow Cloud */}
                <Sphere args={[scale * 1.8, 32, 32]}>
                    <meshBasicMaterial 
                        color={color}
                        transparent
                        opacity={0.08}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false} // Don't occlude other objects
                    />
                </Sphere>
                
                {/* 4. Dynamic Light Source */}
                <pointLight distance={10} intensity={3} color={color} />
            </Float>
        </group>
    );
}

const AtomScene = ({ element }: AtomProps) => {
  const color = CATEGORY_COLORS[element.category];
  const orbitals = useMemo(() => parseElectronConfig(element.electron_configuration), [element.electron_configuration]);

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Background stars for depth */}
      <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

      <group>
        <Nucleus color={color} atomicNumber={element.number} />
        
        {/* Render each subshell */}
        {orbitals.map((orb, i) => (
            <Subshell 
                key={`${orb.n}-${orb.l}-${i}`}
                n={orb.n}
                l={orb.l}
                count={orb.count}
                color={color}
            />
        ))}
      </group>
    </>
  );
};

export const AtomVisualizer: React.FC<AtomProps> = ({ element }) => {
  return (
    <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden bg-black/40 backdrop-blur-md border border-white/10 relative group shadow-inner">
      <Canvas camera={{ position: [0, 0, 12], fov: 40 }} gl={{ antialias: true, alpha: true }}>
        <AtomScene element={element} />
        <OrbitControls makeDefault enableZoom={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
      <div className="absolute bottom-3 left-4 flex flex-col pointer-events-none">
        <span className="text-[10px] text-white/30 font-mono tracking-widest uppercase mb-1">Live Simulation</span>
        <span className="text-xs text-white/60 font-mono">{element.symbol} • {element.electron_configuration}</span>
      </div>
    </div>
  );
};