import React from 'react';
import { Search, Filter, Layers } from 'lucide-react';
import { ElementCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface ControlPanelProps {
    searchTerm: string;
    setSearchTerm: (s: string) => void;
    activeCategory: ElementCategory | 'all';
    setCategory: (c: ElementCategory | 'all') => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
    searchTerm, 
    setSearchTerm, 
    activeCategory, 
    setCategory 
}) => {
    const categories: (ElementCategory | 'all')[] = [
        'all', 
        'alkali-metal', 
        'alkaline-earth-metal',
        'transition-metal', 
        'post-transition-metal', 
        'metalloid', 
        'non-metal', 
        'halogen', 
        'noble-gas',
        'lanthanide',
        'actinide',
        'unknown'
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] md:w-auto max-w-6xl">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-2 md:p-3 shadow-2xl flex flex-col md:flex-row items-center gap-3">
                
                {/* Search */}
                <div className="relative w-full md:w-64 group flex-shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4 group-focus-within:text-neon-cyan transition-colors" />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search Symbol or Name..."
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all"
                    />
                </div>

                <div className="h-8 w-[1px] bg-white/10 hidden md:block" />

                {/* Categories */}
                <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 no-scrollbar mask-linear-fade">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`
                                whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 border flex-shrink-0
                                ${activeCategory === cat 
                                    ? 'bg-white/10 border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                                    : 'bg-transparent border-transparent text-white/40 hover:text-white/80 hover:bg-white/5'}
                            `}
                        >
                            <span className="flex items-center gap-2">
                                {cat !== 'all' && (
                                    <span 
                                        className="w-1.5 h-1.5 rounded-full" 
                                        style={{ backgroundColor: CATEGORY_COLORS[cat as ElementCategory] }} 
                                    />
                                )}
                                {cat === 'all' ? 'All Elements' : cat.replace(/-/g, ' ')}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};