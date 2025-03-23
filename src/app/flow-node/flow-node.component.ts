import { Component, input } from '@angular/core';
import { nodeType } from '../infraestructure/nodeType.model';
import 'hammerjs';

@Component({
  selector: 'app-flow-node',
  imports: [],
  templateUrl: './flow-node.component.html',
  styleUrl: './flow-node.component.scss'
})
export class FlowNodeComponent{

  data = input<nodeType>();

  translate() {
    return `translate(${this.data()?.position.x}px, ${this.data()?.position.y}px)`
  }
}
