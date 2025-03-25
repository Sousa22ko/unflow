import { AfterViewInit, Component, ElementRef, input, ViewChild } from '@angular/core';
import { vertexType } from '../infraestructure/vertex.model';

@Component({
  selector: 'app-flow-vertex',
  imports: [],
  templateUrl: './flow-vertex.component.html',
  styleUrl: './flow-vertex.component.scss'
})
export class VertexComponent implements AfterViewInit{

  @ViewChild('svg') svgElement: ElementRef

  data = input<vertexType>();
  heigh: number
  width: number

  ngAfterViewInit(): void {
    this.heigh = this.svgElement.nativeElement.clientHeight
    this.width = this.svgElement.nativeElement.clientWidth
  }

}
