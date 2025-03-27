import { nodeType } from "./nodeType.model";
import { vertexType } from "./vertexType.model";

export type modalType = {

  selectedNode: nodeType,
  flowNodes: nodeType[],
  flowVertex: vertexType[]
}