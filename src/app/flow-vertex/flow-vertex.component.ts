import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, input, ViewChild } from '@angular/core';
import { vertexType } from '../infraestructure/vertexType.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flow-vertex',
  imports: [CommonModule],
  templateUrl: './flow-vertex.component.html',
  styleUrl: './flow-vertex.component.scss'
})
export class VertexComponent implements AfterViewInit{

  @ViewChild('svg') svgElement: ElementRef

  data = input<vertexType>();
  heigh: number
  width: number

  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.heigh = this.svgElement.nativeElement.clientHeight
    this.width = this.svgElement.nativeElement.clientWidth
    this.cdRef.detectChanges();
  }

}
