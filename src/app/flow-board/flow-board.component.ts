import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { createNodeHelper, nodeType } from '../infraestructure/nodeType.model';
import { FlowNodeComponent } from '../flow-node/flow-node.component';
import { NgFor } from '@angular/common';
import { NodeService } from '../node.service';
import { Vector } from '../infraestructure/vector.model';
import { rnd } from '../infraestructure/rng.util';

@Component({
  selector: 'app-flow-board',
  imports: [FlowNodeComponent, NgFor],
  providers: [NodeService],
  templateUrl: './flow-board.component.html',
  styleUrl: './flow-board.component.scss'
})
export class FlowBoardComponent implements OnInit, AfterViewInit{

  @ViewChild('board') flowBoard: any;

  flowNodes: nodeType[] = [];
  boardHeight = 400;
  boardWidth = 800;
  fricctionFactor = 0.9999;

  constructor(private nodeService: NodeService) { }

  ngOnInit(): void {
    // this.flowNodes.push(createNodeHelper(this.nodeService.getUniqueId(), { x: 30, y: 270 }, { x: -0.5, y: 0.7 }, 80));
    // this.flowNodes.push(createNodeHelper(this.nodeService.getUniqueId(), { x: -50, y: -270 }, { x: 0.5, y: 0.2 }, 20));
    // this.flowNodes.push(createNodeHelper(this.nodeService.getUniqueId(), { x: -200, y: 20 }, { x: 0, y: -0.1 }, 35));
    // this.flowNodes.push(createNodeHelper(this.nodeService.getUniqueId(), { x: 120, y: 0 }, { x: 0, y: 0 }, 35));
    
    this.flowNodes.push(createNodeHelper(this.nodeService.getUniqueId()));
    this.flowNodes.push(createNodeHelper(this.nodeService.getUniqueId()));
    this.flowNodes.push(createNodeHelper(this.nodeService.getUniqueId()));
    this.flowNodes.push(createNodeHelper(this.nodeService.getUniqueId()));
    this.flowNodes.push(createNodeHelper(this.nodeService.getUniqueId()));
    
    // this.flowNodes.push(createNodeHelper(this.nodeService.getUniqueId(), { x: 100, y: 10 }, { x: 2, y: 0 }, 80))
    // this.flowNodes.push(createNodeHelper(this.nodeService.getUniqueId(), { x: 100, y: 5 }, { x: 2, y: 0 }, 80))
  }
  
  ngAfterViewInit(): void {
    this.boardHeight = this.flowBoard.nativeElement.offsetHeight/2;
    this.boardWidth = this.flowBoard.nativeElement.offsetWidth/2;
    this.animate();
  }

  private animate(): void {
    this.flowNodes = this.flowNodes.map(node => this.updatePosition(node));
    this.checkAllColisions();
    this.applyFricction();
    // setTimeout(() => {
      requestAnimationFrame(() => this.animate())
      //FPS
    // }, 1000 / 3);
  }
  
  // physics engine
  
  private updatePosition(node: nodeType): nodeType {
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

  private checkAllColisions(): void {
    for (let i = 0; i < this.flowNodes.length; i++) {
      for (let j = i + 1; j < this.flowNodes.length; j++) {
        if (this.checkCollisions(this.flowNodes[i], this.flowNodes[j])) {
          this.resolveCollision(this.flowNodes[i], this.flowNodes[j]);
        }
      }
      this.checkWallCollision(this.flowNodes[i]);
    }
  }

  private checkCollisions(node1: nodeType, node2: nodeType): boolean {
    const distance = Math.sqrt(Math.pow(node1.position.x - node2.position.x, 2) + Math.pow(node1.position.y - node2.position.y, 2));    
    return distance <= (((node1.radius/2) + (node2.radius/2)) + 4); 
    // +4 descontando 2 pixels de borda de cada node 
  }

  private checkWallCollision(node: nodeType): void {
    if(node.position.x + node.radius >= this.boardWidth || node.position.x - node.radius <= -this.boardWidth) {
      node.velocity.x = -node.velocity.x;
    }
    if(node.position.y + node.radius >= this.boardHeight || node.position.y - node.radius <= -this.boardHeight) {
      node.velocity.y = -node.velocity.y;
    }
  }

  private resolveCollision(node1: nodeType, node2: nodeType) {
    const xVelocityDiff = node1.velocity.x - node2.velocity.x;
    const yVelocityDiff = node1.velocity.y - node2.velocity.y;

    const xDist = node2.position.x - node1.position.x;
    const yDist = node2.position.y - node1.position.y;

    if (xVelocityDiff * xDist + yVelocityDiff * yDist > 0) {
      const angle = -Math.atan2(node2.position.y - node1.position.y, node2.position.x - node1.position.x);

      const m1 = node1.radius;
      const m2 = node2.radius;

      const u1 = this.rotate(node1.velocity, angle);
      const u2 = this.rotate(node2.velocity, angle);

      const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
      const v2 = { x: u2.x * (m2 - m1) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2), y: u2.y };

      const vFinal1 = this.rotate(v1, -angle);
      const vFinal2 = this.rotate(v2, -angle);

      node1.velocity = vFinal1;
      node2.velocity = vFinal2;
    }
    if(xVelocityDiff * xDist + yVelocityDiff * yDist == 0) {
      node1.velocity = { x: rnd(-2, 2), y: rnd(-2, 2) } 
      node2.velocity = { x: rnd(-2, 2), y: rnd(-2, 2) } 
    }
  }

  private rotate(velocity: Vector, angle: number): Vector {
    return {
      x: Number((velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle)).toFixed(2)),
      y: Number((velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)).toFixed(2))
    }
  }

  private applyFricction(): void {
    this.flowNodes = this.flowNodes.map(node => {
      return {
        id: node.id,
        position: node.position,
        velocity: { x: node.velocity.x * this.fricctionFactor, y: node.velocity.y * this.fricctionFactor },
        radius: node.radius
      }
    });
  }

}
