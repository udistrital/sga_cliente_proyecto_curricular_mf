import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEnfasisComponent } from './list-enfasis.component';

describe('ListEnfasisComponent', () => {
  let component: ListEnfasisComponent;
  let fixture: ComponentFixture<ListEnfasisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListEnfasisComponent]
    });
    fixture = TestBed.createComponent(ListEnfasisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
