import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudEnfasisComponent } from './crud-enfasis.component';

describe('CrudEnfasisComponent', () => {
  let component: CrudEnfasisComponent;
  let fixture: ComponentFixture<CrudEnfasisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrudEnfasisComponent]
    });
    fixture = TestBed.createComponent(CrudEnfasisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
