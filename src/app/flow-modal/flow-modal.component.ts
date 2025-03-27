import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { modalType } from '../infraestructure/modalType.model';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MatTable, MatTableModule } from '@angular/material/table';
import { vertexType } from '../infraestructure/vertexType.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { nodeType } from '../infraestructure/nodeType.model';
import { NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NodeService } from '../node.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-flow-modal',
  imports: [NgFor, MatDialogContent, MatTableModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './flow-modal.component.html',
  styleUrl: './flow-modal.component.scss'
})
export class FlowModalComponent implements OnInit {

  @ViewChild(MatTable) table!: MatTable<any>;

  data = inject<modalType>(MAT_DIALOG_DATA);

  vertexList: vertexType[]
  nodeNewVertex: nodeType
  excludedNodeList: nodeType[]

  displayedColumns = ['node', 'actions']

  constructor(private cdRef: ChangeDetectorRef, private service: NodeService) { }

  ngOnInit(): void {
    this.vertexList = this.data.flowVertex.filter(vertex => {
      return vertex.node1.id == this.data.selectedNode.id || vertex.node2.id == this.data.selectedNode.id
    })
    console.log(this.vertexList)

    this.cdRef.detectChanges();
    // se o o node selecionado for o node 2 da relação inverte node 1 com node 2
    this.vertexList.map(vertex => {
      if (vertex.node2.id == this.data.selectedNode.id) {
        let temp = vertex.node1
        vertex.node1 = vertex.node2
        vertex.node2 = temp
      }
      this.cdRef.detectChanges();
      return vertex
    })
    this.cdRef.detectChanges();

    this.preparaListas();
    console.log(this.vertexList)
  }

  // prepara a lista de nós e vertex
  // esse metodo modifica APENAS o campo excludedNodeList (usado na tabela) 
  preparaListas(): void {

    // remover os nós da lista de opções para adicionar novo vertice
    // 1, 2, 3, 4, 5, 6, 7 nós disponiveis na lista
    // 1 sou o
    // 2, 3, 4, 5, 6, 7 lista sem quem sou
    // 1, 4 mas tenho 
    // 5, 1 e tenho
    // 2, 3, 6, 7 lista final

    let excluded = [this.data.selectedNode.id]

    // exclui qualquer nó que ja possui conexão com o node selecionado
    this.vertexList.forEach(vertex => {
      if (vertex.node1.id == this.data.selectedNode.id) {
        excluded.push(vertex.node2.id)
      }
      if (vertex.node2.id == this.data.selectedNode.id) {
        excluded.push(vertex.node1.id)
      }
    })
    this.cdRef.detectChanges();

    this.excludedNodeList = this.data.flowNodes.filter(node => {
      return !excluded.includes(node.id)
    })
    this.cdRef.detectChanges();

  }

  addVertex(): void {

    // adiciona o vertex
    let node1 = this.data.selectedNode
    let node2 = this.nodeNewVertex
    let vertex: vertexType = { id: this.service.getUniqueIdVertex(), node1, node2, vertexStyleType: 0 }

    node1.vertex.push(vertex)
    node2.vertex.push(vertex)

    // atualiza as listas de node e vertex
    this.vertexList.push(vertex)
    this.preparaListas();

    this.data.flowVertex.push(vertex)

    this.table.renderRows();
  }

  removeVertex(vertex: vertexType): void {
    // this.data.flowVertex = this.data.flowVertex.filter(vertexFilter => vertex.id != vertexFilter.id)
    let index = this.data.flowVertex.findIndex(v => v.id === vertex.id);
    if (index !== -1) {
        this.data.flowVertex.splice(index, 1);
    }
    // atenção ! a forma de remover da linha de cima NÃO funciona pois ao reatribuir o valor a this.data.flowVertex 
    // é perdida a referencia ao this.flowVertex do flowboard, logo foi feito usando splice para preservar a referencia

    this.vertexList = this.vertexList.filter(vertexFilter => vertex.id != vertexFilter.id)

    let node1 = vertex.node1;
    let node2 = vertex.node2;

    node1.vertex = node1.vertex.filter(vertexFilter => vertex.id != vertexFilter.id)
    node2.vertex = node2.vertex.filter(vertexFilter => vertex.id != vertexFilter.id)

    this.data.flowNodes.map(nodes => {
      if (nodes.id == node1.id) {
        return node1
      }

      if (nodes.id == node2.id) {
        return node2;
      }
      return nodes
    })

    this.preparaListas()

    this.table.renderRows();
  }


}
