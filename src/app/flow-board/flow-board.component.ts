import { AfterViewInit, ChangeDetectorRef, Component, HostListener, inject, ViewChild } from '@angular/core';
import { createNodeHelperOptions, nodeType } from '../infraestructure/nodeType.model';
import { FlowNodeComponent } from '../flow-node/flow-node.component';
import { NgFor } from '@angular/common';
import { NodeService } from '../node.service';
import { Vector } from '../infraestructure/vector.model';
import { rnd } from '../infraestructure/rng.util';
import { FrictionService } from '../friction.service';
import { FrictionMode } from '../infraestructure/frictionMode.model';
import { vertexType } from '../infraestructure/vertex.model';
import { VertexComponent } from "../flow-vertex/flow-vertex.component";
import { FlowModalComponent } from "../flow-modal/flow-modal.component";
import { MatDialog } from '@angular/material/dialog';
import { modalType } from '../infraestructure/modalType.model';

@Component({
  selector: 'app-flow-board',
  imports: [NgFor, FlowNodeComponent, VertexComponent],
  providers: [],
  templateUrl: './flow-board.component.html',
  styleUrl: './flow-board.component.scss'
})
export class FlowBoardComponent implements AfterViewInit {

  @ViewChild('board') flowBoard: any;

  flowNodes: nodeType[] = [];
  flowVertex: vertexType[] = []
  dialog = inject(MatDialog)

  boardHeight = 400;
  boardWidth = 800;
  frictionMode: FrictionMode;
  frictionFactor = 0.9999;

  nodeHovered: nodeType | undefined;
  isPaused: boolean = false;


  constructor(private nodeService: NodeService, private cdRef: ChangeDetectorRef, private frictionService: FrictionService, ) {

    let node1: nodeType = createNodeHelperOptions({ id: this.nodeService.getUniqueId(), position: { x: 300, y: 200 }, velocity: { x: 10, y: 0 } })
    let node2: nodeType = createNodeHelperOptions({ id: this.nodeService.getUniqueId(), position: { x: 300, y: -200 }, velocity: { x: 0, y: 0 } })
    let vertexNovo: vertexType = { id: 0, node1, node2, type: 0 }
    node1.vertex.push(vertexNovo)
    node2.vertex.push(vertexNovo)
    // precisa?
    vertexNovo.node1 = node1
    vertexNovo.node2 = node2;

    this.flowNodes.push(node1);
    this.flowNodes.push(node2);
    this.flowVertex.push(vertexNovo)

    this.flowNodes.push(createNodeHelperOptions({id: this.nodeService.getUniqueId(), position: {x: 0, y: 0}}))    
    this.flowNodes.push(createNodeHelperOptions({id: this.nodeService.getUniqueId(), position: {x: -400, y: -200}}))    
  }

  // ----------------- animation -----------------

  ngAfterViewInit(): void {
    this.boardHeight = this.flowBoard.nativeElement.offsetHeight / 2;
    this.boardWidth = this.flowBoard.nativeElement.offsetWidth / 2;
    this.cdRef.detectChanges();
    this.animate();
  }

  private animate(): void {
    if(!this.isPaused){
      this.flowNodes = this.flowNodes.map(node => this.updatePosition(node));
      this.flowNodes = this.flowNodes.map(node => this.updateVertexPosition(node));
      this.checkAllColisions();
      this.cdRef.detectChanges();
      this.applyFricction();
      // setTimeout(() => {
      requestAnimationFrame(() => this.animate())
      //FPS
      // }, 1000 / 3);
    }
  }

  // ----------------- physics engine -----------------

  // atualiza a posição do node
  private updatePosition(node: nodeType): nodeType {
    node.position = {
      x: node.position.x + node.velocity.x,
      y: node.position.y + node.velocity.y
    }
    return node;
  }

  // atualiza a posição dos vertices
  private updateVertexPosition(node: nodeType): nodeType {
    node.vertex.map(vertex => {
      if (vertex.node1.id == node.id) {
        vertex.node1 = node
      }
      if (vertex.node2.id == node.id) {
        vertex.node2 = node
      }

      this.flowVertex.map(vertexList => {
        if (vertex.id == vertexList.id) {
          return vertex; // novo vertex atualizado
        }
        return vertexList
      })
    })
    return node;
  }

  // checa a colisão entre todos os nodes
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

  // checa uma colisão especifica (chamado pelo checkAllColisions)
  private checkCollisions(node1: nodeType, node2: nodeType): boolean {
    const distance = Math.sqrt(Math.pow(node1.position.x - node2.position.x, 2) + Math.pow(node1.position.y - node2.position.y, 2));
    return distance <= (((node1.radius / 2) + (node2.radius / 2)) + 4);
    // +4 descontando 2 pixels de borda de cada node 
  }

  // checa colisão entre um node e as paredes
  private checkWallCollision(node: nodeType): void {
    if (node.position.x + node.radius / 2 >= this.boardWidth + 2 || node.position.x - node.radius / 2 <= -this.boardWidth + 2) {
      node.velocity.x = -node.velocity.x;
    }
    if (node.position.y + node.radius / 2 >= this.boardHeight + 2 || node.position.y - node.radius / 2 <= -this.boardHeight + 2) {
      node.velocity.y = -node.velocity.y;
    }
  }

  // calculo de colisões
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


  // aplica uma das formas de fricção
  private applyFricction(): void {
    this.frictionMode = this.frictionService.getCurrentFrictionMode();

    // sem fricção
    if (this.frictionMode.value == 0) { return } 

    // fricção fixa
    if (this.frictionMode.value == 1) { 
      this.flowNodes = this.flowNodes.map(node => {
        node.velocity = { x: node.velocity.x * this.frictionFactor, y: node.velocity.y * this.frictionFactor };
        return node;
      });
    }

    // fricção exponencial
    if (this.frictionMode.value == 2) { 
      this.flowNodes = this.flowNodes.map(node => {
        let velocityTotal = Math.sqrt(node.velocity.x ** 2 + node.velocity.y ** 2);
        let friction = Math.pow(this.frictionFactor, velocityTotal)

        node.velocity.x *= friction;
        node.velocity.y *= friction;

        this.cdRef.detectChanges();
        return node;
      });
    }
  }


  // TO-DO 
  // converte o angulo do evento do pan (hammerJs) para um vetor de velocidade para quando soltar o click ele retornar ao movimento
  private vectorConversion(angle: number, intensidade: number): Vector {
    let radiano = angle * (Math.PI / 180);
    return { x: (Math.cos(radiano)) * intensidade, y: -Math.sin(radiano) * intensidade };
  }

  // ----------------- helpers -----------------

  // generico para acessar o node
  private accessNode(node: nodeType, callback: (value: nodeType) => void): void {
    this.flowNodes = this.flowNodes.map(n => {
      if (n.id === node.id) {
        callback(n)
      }
      return n;
    });
  }


  // ----------------- events menu -----------------

  adicionarNode() {
    this.flowNodes.push(createNodeHelperOptions({ id: this.nodeService.getUniqueId(), velocity: { x: 0, y: 0 } }));
    // , velocity: {x: 1, y: 2}

    // if (this.flowNodes.length % 2 == 0) {
    //   let node1 = this.flowNodes[this.flowNodes.length - 2]
    //   let node2 = this.flowNodes[this.flowNodes.length - 1]
    //   let vertex: vertexType = { id: 1, node1, node2, type: 0 }
    //   node1.vertex.push(vertex)
    //   node2.vertex.push(vertex)

    //   this.accessNode(this.flowNodes[this.flowNodes.length - 2], n => {
    //     n = node1;
    //   })

    //   this.accessNode(this.flowNodes[this.flowNodes.length - 1], n => {
    //     n = node2;
    //   })
    //   this.flowVertex.push(vertex)
    // }
  }

  pauseResume() {
    if (this.isPaused) {
      this.isPaused = false
      this.animate()
    } else {
      this.isPaused = true;
    }
  }

  // ----------------- events -----------------


  // chamado no instante que o usuario clica no node (prevem ele de mover e registra o momentum)
  // possui alguns problemas
  click(event: any, node: nodeType) {
    this.accessNode(node, n => {
      n.positionOffset = { x: event.clientX - this.boardWidth, y: event.clientY - this.boardHeight };
      n.momentum = Math.sqrt(Math.max(n.momentum, Math.abs(n.velocity.x) + Math.abs(n.velocity.y)));
      n.velocity = { x: 0, y: 0 };
    });
  }

  // TO-DO melhorar
  // chamado ao mover um node na tela
  panEvent(event: any, node: nodeType): void {
    this.accessNode(node, n => {
      n.position = { x: event.deltaX + n.positionOffset.x, y: event.deltaY + n.positionOffset.y };
      n.momentum = Math.max(n.momentum, Math.abs(n.velocity.x) + Math.abs(n.velocity.y));
      n.velocity = { x: 0, y: 0 };
    })

  }

  // chamado ao soltar o node
  onPanEnd(event: any, node: nodeType): void {
    this.flowNodes = this.flowNodes.map(n => {
      if (n.id === node.id) {
        n.positionOffset = { x: n.position.x, y: n.position.y };
        n.velocity = this.vectorConversion(event.angle, node.momentum);
        n.momentum = 0;
      }
      return n;
    });
  }
 
  // hover sobre o node
  onMouseEnter(event: any, node: nodeType): void {
    this.nodeHovered = node;
  }

  // sai do hover
  onMouseLeave(event: any, node: nodeType): void {
    this.nodeHovered = undefined;
  }

  
  // chamado ao pressionar Q sobre um node
  @HostListener('document:keydown', ['$event'])
  openMenu(event: any): void {
    
    if ((event.key === 'q' || event.key === 'Q') && !!this.nodeHovered ) {
      this.isPaused = true;

      let data: modalType = { selectedNode: this.nodeHovered, flowNodes: this.flowNodes, flowVertex: this.flowVertex }
      console.log("data", data)
      this.dialog.open(FlowModalComponent, {data})
      
      this.dialog.afterAllClosed.subscribe(response => {
        if(this.isPaused) {
          this.isPaused = false;
          this.animate();
        }
      })
    }


    // console de testes
    if(event.key === 'l'|| event.key === 'L') {
      console.log("flow nodes", this.flowNodes)
      console.log("flow vertex", this.flowVertex)
    }
  }

}
