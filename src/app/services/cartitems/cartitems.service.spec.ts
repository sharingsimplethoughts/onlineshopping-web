import { TestBed } from '@angular/core/testing';

import { CartitemsService } from './cartitems.service';

describe('CartitemsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CartitemsService = TestBed.get(CartitemsService);
    expect(service).toBeTruthy();
  });
});
