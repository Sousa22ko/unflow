import { TestBed } from '@angular/core/testing';

import { FrictionService } from './friction.service';

describe('FrictionService', () => {
  let service: FrictionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrictionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
