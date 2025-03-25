import { nodeType } from "./nodeType.model";

export interface Vertex {

  id: number
  node1: nodeType
  node2: nodeType
  type: 0 | 1 | 2 | 3 | undefined | null
  // tipo 0 apenas uma linha
  // tipo 1 conecta node1 para node2
  // tipo 2 conecta node2 para node1
  // tipo 3 conecta node 1 e node 2
}