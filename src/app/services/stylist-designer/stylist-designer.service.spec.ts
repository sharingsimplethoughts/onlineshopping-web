import { TestBed } from '@angular/core/testing';

import { StylistDesignerService } from './stylist-designer.service';

describe('StylistDesignerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StylistDesignerService = TestBed.get(StylistDesignerService);
    expect(service).toBeTruthy();
  });
});
