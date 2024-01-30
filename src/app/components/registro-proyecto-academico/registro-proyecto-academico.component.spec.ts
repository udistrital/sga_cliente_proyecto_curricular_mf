import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroProyectoAcademicoComponent } from './registro-proyecto-academico.component';

describe('RegistroProyectoAcademicoComponent', () => {
  let component: RegistroProyectoAcademicoComponent;
  let fixture: ComponentFixture<RegistroProyectoAcademicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroProyectoAcademicoComponent]
    });
    fixture = TestBed.createComponent(RegistroProyectoAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
