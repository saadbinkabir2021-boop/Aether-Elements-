import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChemicalElement, ElementCategory } from '../types';
import { getElementByGridPosition } from '../constants';
import { ElementTile } from './ElementTile';

interface PeriodicTableProps {
    onElementSelect: (e: ChemicalElement) => void;
    activeCategory: ElementCategory | 'all';
    searchTerm: string;
}

export const PeriodicTable: React.FC<PeriodicTableProps> = ({ 
    onElementSelect, 
    activeCategory, 
    searchTerm 
}) => {
    
    // Generate the grid items based on coordinate system (18x10 grid including actinide/lanthanide rows)
    const gridItems = useMemo(() => {
        const items = [];
        // Standard table is 18 cols x 7 rows
        // + Gap rows + Lanthanides (row 9) + Actinides (row 10)
        for (let y = 1; y <= 10; y++) {
            // skip row 8 (gap)
            if (y === 8) continue;

            for (let x = 1; x <= 18; x++) {
                const element = getElementByGridPosition(x, y);
                if (element) {
                    items.push(element);
                }
            }
        }
        return items;
    }, []);

    const isDimmed = (element: ChemicalElement) => {
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return !(element.name.toLowerCase().includes(term) || element.symbol.toLowerCase().includes(term));
        }
        if (activeCategory === 'all') return false;
        return element.category !== activeCategory;
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto p-4 md:p-8 overflow-x-auto">
            <div className="min-w-[1000px] md:min-w-0">
                <div 
                    className="grid gap-1 md:gap-2"
                    style={{
                        gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
                        gridTemplateRows: 'repeat(10, minmax(0, 1fr))'
                    }}
                >
                    {gridItems.map((element) => (
                        <ElementTile 
                            key={`${element.symbol}-${element.number}`}
                            element={element}
                            onClick={onElementSelect}
                            dimmed={isDimmed(element)}
                        />
                    ))}
                    
                    {/* Placeholder for Lanthanides/Actinides labels or lines could go here */}
                    <div className="col-span-18 row-start-8 h-8 md:h-12 flex items-center justify-center text-white/20 text-xs font-mono tracking-[0.5em] uppercase">
                        Rare Earth Elements Below
                    </div>
                </div>
            </div>
        </div>
    );
};
