import { rnd } from "./rng.util";
import { Vector } from "./vector.model";

export interface nodeType {

  id: number;
  position: Vector;
  velocity: Vector;
  radius: number;
}

export function createNodeHelper(id?: number, position?: Vector, velocity?: Vector, radius?: number): nodeType {
  return {
    id: id ?? -1,
    // position: position ?? { x: rnd(-400, 400), y: rnd(-400, 400) },
    position: position ?? { x: 0, y: 0 },
    // velocity: velocity ?? { x: rnd(-2, 2), y: rnd(-2, 2) }, 
    velocity: velocity ?? { x: 0, y: 0 }, 
    radius: radius ?? rnd(15, 80)
  };
}
