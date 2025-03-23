import { rnd } from "./rng.util";
import { Vector } from "./vector.model";

export interface nodeType {

  id: number;
  position: Vector;
  positionOffset: Vector;
  velocity: Vector;
  momentum: number;
  radius: number;
}

export interface NodeOption {
  id?: number;
  position?: Vector;
  positionOffset?: Vector;
  velocity?: Vector;
  momentum?: number;
  radius?: number;
}

export function createNodeHelper(id?: number, position?: Vector, velocity?: Vector, radius?: number): nodeType {
  return {
    id: id ?? -1,
    // position: position ?? { x: rnd(-400, 400), y: rnd(-400, 400) },
    position: position ?? { x: 0, y: 0 },
    positionOffset: { x: 0, y: 0 },
    momentum: 0,
    // velocity: velocity ?? { x: rnd(-2, 2), y: rnd(-2, 2) }, 
    velocity: velocity ?? { x: 0, y: 0 }, 
    radius: radius ?? rnd(100, 200)
  };
}


export function createNodeHelperOptions(option: NodeOption): nodeType {
  return {
    id: option.id ?? -1,
    position: option.position ?? { x: 0, y: 0 },
    positionOffset: { x: 0, y: 0 },
    momentum: 0,
    velocity: option.velocity ?? { x: 0, y: 0 }, 
    radius: option.radius ?? rnd(100, 200)
  };
}