import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { createNodeHelperOptions, nodeType } from '../infraestructure/nodeType.model';
import { FlowNodeComponent } from '../flow-node/flow-node.component';
import { NgFor } from '@angular/common';
import { NodeService } from '../node.service';
import { Vector } from '../infraestructure/vector.model';
import { rnd } from '../infraestructure/rng.util';
import { FrictionService } from '../friction.service';
import { FrictionMode } from '../infraestructure/frictionMode.model';

@Component({
  selector: 'app-flow-board',
  imports: [FlowNodeComponent, NgFor],
  providers: [NodeService],
  templateUrl: './flow-board.component.html',
  styleUrl: './flow-board.component.scss'
})
export class FlowBoardComponent implements AfterViewInit {

  @ViewChild('board') flowBoard: any;

  flowNodes: nodeType[] = [];
  boardHeight = 400;
  boardWidth = 800;
  frictionMode: FrictionMode;
  frictionFactor = 0.9999;


  constructor(private nodeService: NodeService, private cdRef: ChangeDetectorRef, private frictionService: FrictionService) { }

  adicionarNode() {
    this.flowNodes.push(createNodeHelperOptions({ id: this.nodeService.getUniqueId(), velocity: { x: 100, y: 250 } }));
    //, velocity: {x: 1, y: 2}
  }

  switchFrictionMode() {

  }

  ngAfterViewInit(): void {
    this.boardHeight = this.flowBoard.nativeElement.offsetHeight / 2;
    this.boardWidth = this.flowBoard.nativeElement.offsetWidth / 2;
    this.animate();
  }

  private animate(): void {
    this.flowNodes = this.flowNodes.map(node => this.updatePosition(node));
    this.checkAllColisions();
    this.cdRef.detectChanges();
    this.applyFricction();
    // setTimeout(() => {
    requestAnimationFrame(() => this.animate())
    //FPS
    // }, 1000 / 3);
  }

  // physics engine

  private updatePosition(node: nodeType): nodeType {
    node.position = {
      x: node.position.x + node.velocity.x,
      y: node.position.y + node.velocity.y
    }

    return node;
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
    return distance <= (((node1.radius / 2) + (node2.radius / 2)) + 4);
    // +4 descontando 2 pixels de borda de cada node 
  }

  private checkWallCollision(node: nodeType): void {
    if (node.position.x + node.radius / 2 >= this.boardWidth + 2 || node.position.x - node.radius / 2 <= -this.boardWidth + 2) {
      node.velocity.x = -node.velocity.x;
    }
    if (node.position.y + node.radius / 2 >= this.boardHeight + 2 || node.position.y - node.radius / 2 <= -this.boardHeight + 2) {
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
    if (xVelocityDiff * xDist + yVelocityDiff * yDist == 0) {
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
    this.frictionMode = this.frictionService.getCurrentFrictionMode();
    if (this.frictionMode.value == 0) { return } // sem fricção
    if (this.frictionMode.value == 1) { // fricção fixa
      this.flowNodes = this.flowNodes.map(node => {
        node.velocity = { x: node.velocity.x * this.frictionFactor, y: node.velocity.y * this.frictionFactor };
        return node;
      });
    }
    if (this.frictionMode.value == 2) { // fricção exponencial
      this.flowNodes = this.flowNodes.map(node => {
        let velocityTotal = Math.sqrt(node.velocity.x ** 2 + node.velocity.y ** 2);
        let friction = Math.pow(this.frictionFactor, velocityTotal)
        
        // Aplica fricção suavemente
        node.velocity.x *= friction;
        node.velocity.y *= friction;

        return node;
      });
    }
  }

  // possivelmente possui alguns problemas
  panEvent(event: any, node: nodeType): void {
    this.accessNode(node, n => {
      n.position = { x: event.deltaX + n.positionOffset.x, y: event.deltaY + n.positionOffset.y };
      n.momentum = Math.max(n.momentum, Math.abs(n.velocity.x) + Math.abs(n.velocity.y));
      n.velocity = { x: 0, y: 0 };
    })

  }

  onPanEnd(event: any, node: nodeType): void {
    console.log(event, this.vectorConversion(event.angle, node.momentum), node.momentum);
    this.flowNodes = this.flowNodes.map(n => {
      if (n.id === node.id) {
        n.positionOffset = { x: n.position.x, y: n.position.y };
        n.velocity = this.vectorConversion(event.angle, node.momentum);
        n.momentum = 0;
      }
      return n;
    });
  }

  // converte o angulo do evento do pan (hammerJs) para um vetor de velocidade para quando soltar o click ele retornar ao movimento
  private vectorConversion(angle: number, intensidade: number): Vector {
    let radiano = angle * (Math.PI / 180);
    return { x: (Math.cos(radiano)) * intensidade, y: -Math.sin(radiano) * intensidade };
  }

  // chamado no instante que o usuario clica no node (prevem ele de mover e registra o momentum)
  // possui alguns problemas
  click(event: any, node: nodeType) {
    console.log(event)
    this.accessNode(node, n => {
      n.positionOffset = { x: event.clientX - this.boardWidth, y: event.clientY - this.boardHeight };
      n.momentum = Math.sqrt(Math.max(n.momentum, Math.abs(n.velocity.x) + Math.abs(n.velocity.y)));
      n.velocity = { x: 0, y: 0 };
    });
  }


  // generico para acessar o node
  private accessNode(node: nodeType, callback: (value: nodeType) => void): void {
    this.flowNodes = this.flowNodes.map(n => {
      if (n.id === node.id) {
        callback(n)
      }
      return n;
    });
  }

}
