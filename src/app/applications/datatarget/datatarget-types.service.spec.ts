/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DatatargetTypesService } from './datatarget-types.service';

describe('Service: DatatargetTypesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatatargetTypesService]
    });
  });

  it('should ...', inject([DatatargetTypesService], (service: DatatargetTypesService) => {
    expect(service).toBeTruthy();
  }));
});
