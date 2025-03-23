import { Component, output } from '@angular/core';
import { FrictionService } from '../friction.service';
import { DEFAULT_FRICTION_MODE, FRICTION_MODES, FrictionMode } from '../infraestructure/frictionMode.model';

@Component({
  selector: 'app-header',
  imports: [],
  providers: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  adiconar = output<void>();
  frictionSpecter: FrictionMode[] = FRICTION_MODES
  frictionMode = DEFAULT_FRICTION_MODE;

  constructor(private frictionService: FrictionService) { }

  addNode() {
    this.adiconar.emit();
  }

  frictionToggle() {
    this.frictionMode = this.frictionSpecter[this.frictionMode.value + 1 == 3 ?  0 : this.frictionMode.value + 1]
    this.frictionService.setCurrentFrictionMode(this.frictionMode);
  }

}
