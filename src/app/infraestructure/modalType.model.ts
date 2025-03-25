import { nodeType } from "./nodeType.model";
import { vertexType } from "./vertex.model";

export interface modalType {

  selectedNode: nodeType,
  flowNodes: nodeType[],
  flowVertex: vertexType[]
}