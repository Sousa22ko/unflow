import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowBoardComponent } from './flow-board.component';

describe('FlowBoardComponent', () => {
  let component: FlowBoardComponent;
  let fixture: ComponentFixture<FlowBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
