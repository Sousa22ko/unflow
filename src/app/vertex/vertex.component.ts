import { AfterViewInit, Component, ElementRef, input, ViewChild } from '@angular/core';
import { Vertex } from '../infraestructure/vertex.model';

@Component({
  selector: 'app-flow-vertex',
  imports: [],
  templateUrl: './vertex.component.html',
  styleUrl: './vertex.component.scss'
})
export class VertexComponent implements AfterViewInit{

  @ViewChild('svg') svgElement: ElementRef

  data = input<Vertex>();
  heigh = window.innerHeight
  width = window.innerWidth

  ngAfterViewInit(): void {
    console.log(this.svgElement)
    this.heigh = this.svgElement.nativeElement.clientHeight
    this.width = this.svgElement.nativeElement.clientWidth
  }

}
