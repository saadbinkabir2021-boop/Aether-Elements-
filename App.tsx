import React, { useState, useRef } from 'react';
import { ChemicalElement, ElementCategory } from './types';
import { Hero } from './components/Hero';
import { PeriodicTable } from './components/PeriodicTable';
import { ElementModal } from './components/ElementModal';
import { ControlPanel } from './components/ControlPanel';

function App() {
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<ElementCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const tableRef = useRef<HTMLDivElement>(null);

  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020204] text-white selection:bg-neon-cyan selection:text-black">
      
      {/* Structural Background - Hexagonal Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         {/* Hex Grid Overlay */}
         <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
            }}
         />
         
         {/* Ambient Glows */}
         <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[150px] rounded-full animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[150px] rounded-full animate-pulse delay-700"></div>
         <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[40%] h-[40%] bg-cyan-900/5 blur-[120px] rounded-full"></div>
      </div>

      <Hero onExplore={scrollToTable} />

      <main ref={tableRef} className="relative z-10 min-h-screen flex flex-col pt-24 pb-40">
        <div className="container mx-auto px-6 mb-16 flex flex-col items-center">
            <h2 className="text-sm font-mono tracking-[0.5em] text-neon-cyan uppercase mb-4 opacity-70">Catalog</h2>
            <div className="text-4xl md:text-5xl font-display font-bold text-center mb-6 text-white">The Periodic Table</div>
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        <PeriodicTable 
            onElementSelect={setSelectedElement} 
            activeCategory={activeCategory}
            searchTerm={searchTerm}
        />

        {/* Professional Footer Attribution */}
        <footer className="mt-auto pt-32 pb-8 w-full flex flex-col items-center justify-center opacity-40 hover:opacity-100 transition-all duration-700">
            <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/30"></div>
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/60">Architect</span>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/30"></div>
            </div>
            
            <h3 className="text-lg font-display tracking-widest text-white mb-3">SAAD BIN KABIR</h3>
            
            <a 
                href="https://instagram.com/saaad.dng" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all backdrop-blur-sm"
            >
                <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse"></span>
                <span className="text-xs font-mono text-white/70 group-hover:text-neon-cyan transition-colors">@saaad.dng</span>
            </a>
        </footer>
      </main>

      <ControlPanel 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeCategory={activeCategory}
        setCategory={setActiveCategory}
      />

      <ElementModal 
        element={selectedElement} 
        onClose={() => setSelectedElement(null)} 
      />
    </div>
  );
}

export default App;