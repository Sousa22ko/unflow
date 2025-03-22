export function rnd(min: number, max: number): number {
  return Number((Math.random() * (max - min + 1) + min).toFixed(2));
}