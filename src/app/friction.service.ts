import { Injectable } from '@angular/core';
import { DEFAULT_FRICTION_MODE, FrictionMode } from './infraestructure/frictionMode.model';

@Injectable({
  providedIn: 'root'
})
export class FrictionService {

  private currentFrictionMode: FrictionMode;

  constructor() {
    this.currentFrictionMode = DEFAULT_FRICTION_MODE;
  }

  public setCurrentFrictionMode(friction: FrictionMode): void {
    this.currentFrictionMode = friction;
  }

  public getCurrentFrictionMode(): FrictionMode {
    return this.currentFrictionMode
  }

}
