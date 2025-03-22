import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { createNodeHelper, nodeType, updatePosition } from '../infraestructure/nodeType.model';
import { FlowNodeComponent } from '../flow-node/flow-node.component';
import { NgFor } from '@angular/common';
import { NodeService } from '../node.service';

@Component({
  selector: 'app-flow-board',
  imports: [FlowNodeComponent, NgFor],
  providers: [NodeService],
  templateUrl: './flow-board.component.html',
  styleUrl: './flow-board.component.scss'
})
export class FlowBoardComponent implements OnInit, AfterViewInit{

  @ViewChild('board') flowBoard: any;

  flownodes: nodeType[] = [];

  constructor(private nodeService: NodeService) { 

  }

  ngOnInit(): void {
    // this.flownodes.push(createNodeHelper(this.nodeService.getUniqueId(), { x: 30, y: 270 }, { x: -0.5, y: 0.7 }, 80));
    // this.flownodes.push(createNodeHelper(this.nodeService.getUniqueId(), { x: -50, y: -270 }, { x: 0.5, y: 0.2 }, 20));
    // this.flownodes.push(createNodeHelper(this.nodeService.getUniqueId(), { x: -200, y: 20 }, { x: 0, y: -0.1 }, 35));
    // this.flownodes.push(createNodeHelper(this.nodeService.getUniqueId(), { x: 120, y: 0 }, { x: 0, y: 0 }, 35));

    this.flownodes.push(createNodeHelper(this.nodeService.getUniqueId()));
    this.flownodes.push(createNodeHelper(this.nodeService.getUniqueId()));
    this.flownodes.push(createNodeHelper(this.nodeService.getUniqueId()));
    this.flownodes.push(createNodeHelper(this.nodeService.getUniqueId()));
    this.flownodes.push(createNodeHelper(this.nodeService.getUniqueId()));
  }

  ngAfterViewInit(): void {
    this.animate();
  }

  animate(): void {
    // this.flownodes = this.flownodes.map(node => updatePosition(node));
    //this.checkCollisions();

    requestAnimationFrame(() => this.animate())
  }


  processStyle(node: nodeType): any {
    return `translate(${node.position.x}px, ${node.position.y}px)`;
  }

}
