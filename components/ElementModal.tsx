import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Thermometer, Droplets, Weight, Clock, Info } from 'lucide-react';
import { ChemicalElement } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { AtomVisualizer } from './AtomVisualizer';

interface ElementModalProps {
  element: ChemicalElement | null;
  onClose: () => void;
}

export const ElementModal: React.FC<ElementModalProps> = ({ element, onClose }) => {
  if (!element) return null;
  
  const color = CATEGORY_COLORS[element.category];

  return (
    <AnimatePresence>
      {element && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 w-full md:w-[600px] h-full bg-black/90 border-l border-white/10 shadow-2xl overflow-y-auto"
            style={{
                boxShadow: `-10px 0 50px ${color}20`
            }}
          >
            <div className="p-6 md:p-10 relative min-h-full flex flex-col gap-8">
              
              {/* Header */}
              <div className="flex justify-between items-start">
                 <div>
                    <h2 className="text-6xl md:text-8xl font-bold font-display tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
                        {element.symbol}
                    </h2>
                    <h3 className="text-2xl md:text-3xl font-light text-white mt-2">{element.name}</h3>
                    <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full border border-white/10 bg-white/5">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }} />
                        <span className="text-xs uppercase tracking-widest text-white/80">{element.category.replace(/-/g, ' ')}</span>
                    </div>
                 </div>
                 <button 
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors group"
                 >
                    <X className="w-8 h-8 text-white/50 group-hover:text-white" />
                 </button>
              </div>

              {/* 3D Visualization */}
              <AtomVisualizer element={element} />

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-4">
                 <DataCard 
                    label="Atomic Number" 
                    value={element.number} 
                    icon={<Info size={16} />} 
                 />
                 <DataCard 
                    label="Atomic Mass" 
                    value={`${element.atomic_mass} u`} 
                    icon={<Weight size={16} />} 
                 />
                 <DataCard 
                    label="Melting Point" 
                    value={element.melt ? `${element.melt} K` : 'N/A'} 
                    icon={<Thermometer size={16} />} 
                 />
                 <DataCard 
                    label="Boiling Point" 
                    value={element.boil ? `${element.boil} K` : 'N/A'} 
                    icon={<Droplets size={16} />} 
                 />
                 <DataCard 
                    label="Density" 
                    value={element.density ? `${element.density} g/cm³` : 'N/A'} 
                    icon={<Weight size={16} />} 
                 />
                 <DataCard 
                    label="Discovered" 
                    value={element.year_discovered || 'Unknown'} 
                    icon={<Clock size={16} />} 
                 />
              </div>

              {/* Configuration */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                 <h4 className="text-sm uppercase tracking-widest text-white/40 mb-2">Electron Configuration</h4>
                 <code className="text-xl md:text-2xl font-mono text-neon-cyan">
                    {element.electron_configuration}
                 </code>
              </div>

              {/* Summary */}
              <div className="pb-10">
                 <h4 className="text-sm uppercase tracking-widest text-white/40 mb-4">About</h4>
                 <p className="text-white/80 leading-relaxed font-light text-lg">
                    {element.summary}
                 </p>
                 {element.discovered_by && (
                    <p className="mt-4 text-sm text-white/50">
                        Discovered by <span className="text-white">{element.discovered_by}</span>
                    </p>
                 )}
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const DataCard = ({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) => (
    <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
        <div className="flex items-center text-white/40 mb-2 gap-2 text-xs uppercase tracking-wide">
            {icon} {label}
        </div>
        <div className="text-xl font-medium text-white">{value}</div>
    </div>
);
