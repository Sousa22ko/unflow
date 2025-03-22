import { Component, ElementRef, input, OnChanges, SimpleChanges, ViewChild, viewChild } from '@angular/core';
import { nodeType } from '../infraestructure/nodeType.model';

@Component({
  selector: 'app-flow-node',
  imports: [],
  templateUrl: './flow-node.component.html',
  styleUrl: './flow-node.component.scss'
})
export class FlowNodeComponent{

  data = input<nodeType>();
  @ViewChild('node') node: ElementRef;

  constructor() { 
  }

  translate() {
    return `translate(${this.data()?.position.x}px, ${this.data()?.position.y}px)`
  }

}
