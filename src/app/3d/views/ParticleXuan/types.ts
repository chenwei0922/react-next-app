export type ShapeType = 'sphere' | 'cube' | 'torus' | 'helix';

export interface ParticleSystemProps {
  char: string;
  count: number;
  shape: ShapeType;
  color: string;
  radius: number;
}