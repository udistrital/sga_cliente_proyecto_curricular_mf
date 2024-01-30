import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarProyectoAcademicoComponent } from './modificar-proyecto-academico.component';

describe('ModificarProyectoAcademicoComponent', () => {
  let component: ModificarProyectoAcademicoComponent;
  let fixture: ComponentFixture<ModificarProyectoAcademicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificarProyectoAcademicoComponent]
    });
    fixture = TestBed.createComponent(ModificarProyectoAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
