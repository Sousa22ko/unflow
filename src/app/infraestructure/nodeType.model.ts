import { rnd } from "./rng.util";
import { Vector } from "./vector.model";

export interface nodeType {

  id: number;
  position: Vector;
  velocity: Vector;
  radius?: number;
}

export function createNodeHelper(id?: number, position?: Vector, velocity?: Vector, radius?: number): nodeType {
  return {
    id: id ?? -1,
    position: position ?? { x: rnd(-400, 400), y: rnd(-400, 400) },
    velocity: velocity ?? { x: rnd(-2, 2), y: rnd(-2, 2) }, 
    radius: radius ?? rnd(15, 80)
  };
}

export function updatePosition(node: nodeType): nodeType {
  return {
    id: node.id,
    position: { 
      x: node.position.x + node.velocity.x, 
      y: node.position.y + node.velocity.y 
    },
    velocity: node.velocity,
    radius: node.radius
  }
}