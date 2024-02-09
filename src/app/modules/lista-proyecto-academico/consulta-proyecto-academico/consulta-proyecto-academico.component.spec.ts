import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaProyectoAcademicoComponent } from './consulta-proyecto-academico.component';

describe('ConsultaProyectoAcademicoComponent', () => {
  let component: ConsultaProyectoAcademicoComponent;
  let fixture: ComponentFixture<ConsultaProyectoAcademicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultaProyectoAcademicoComponent]
    });
    fixture = TestBed.createComponent(ConsultaProyectoAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
