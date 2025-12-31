
export type ElementCategory = 
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'non-metal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export interface ChemicalElement {
  number: number;
  symbol: string;
  name: string;
  atomic_mass: string;
  category: ElementCategory;
  group: number;
  period: number;
  electron_configuration: string;
  density: number | null; // g/cm3
  melt: number | null; // Kelvin
  boil: number | null; // Kelvin
  discovered_by: string | null;
  year_discovered: number | string | null;
  summary: string;
  gridX: number; // 1-18 column
  gridY: number; // 1-7 row + 2 specialized rows
  appearance?: string;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
}
