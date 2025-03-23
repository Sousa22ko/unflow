import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { NgIf } from '@angular/common';
import { FlowBoardComponent } from "./flow-board/flow-board.component";

@Component({
  selector: 'app-root',
  imports: [FlowBoardComponent, HeaderComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'unflow';

  @ViewChild('board') board: FlowBoardComponent

  adicionarNode() {
    this.board.adicionarNode();
  }
}
