import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRegistroProyectoAcademicoComponent } from './list-registro-proyecto-academico.component';

describe('ListRegistroProyectoAcademicoComponent', () => {
  let component: ListRegistroProyectoAcademicoComponent;
  let fixture: ComponentFixture<ListRegistroProyectoAcademicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListRegistroProyectoAcademicoComponent]
    });
    fixture = TestBed.createComponent(ListRegistroProyectoAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
