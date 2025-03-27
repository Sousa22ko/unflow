import { rnd } from "./rng.util";
import { Vector } from "./vector.model";
import { vertexType } from "./vertexType.model";

export type nodeType = {
  id: number;
  position: Vector;
  positionOffset: Vector;
  velocity: Vector;
  momentum: number;
  radius: number;
  vertex: vertexType [];
}

export type NodeOption = {
  id?: number;
  position?: Vector;
  positionOffset?: Vector;
  velocity?: Vector;
  momentum?: number;
  radius?: number;
  vertex?: vertexType [];
}

export function createNodeHelper(id?: number, position?: Vector, velocity?: Vector, radius?: number, vertex?: vertexType[]): nodeType {
  return {
    id: id ?? -1,
    // position: position ?? { x: rnd(-400, 400), y: rnd(-400, 400) },
    position: position ?? { x: 0, y: 0 },
    positionOffset: { x: 0, y: 0 },
    momentum: 0,
    // velocity: velocity ?? { x: rnd(-2, 2), y: rnd(-2, 2) }, 
    velocity: velocity ?? { x: 0, y: 0 }, 
    radius: radius ?? rnd(100, 200),
    vertex: vertex ?? []
  };
}


export function createNodeHelperOptions(option: NodeOption): nodeType {
  return {
    id: option.id ?? -1,
    position: option.position ?? { x: 0, y: 0 },
    positionOffset: { x: 0, y: 0 },
    momentum: 0,
    velocity: option.velocity ?? { x: 0, y: 0 }, 
    radius: option.radius ?? rnd(100, 200),
    vertex: option.vertex ?? []
  };
}