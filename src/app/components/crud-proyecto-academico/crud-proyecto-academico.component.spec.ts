import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudProyectoAcademicoComponent } from './crud-proyecto-academico.component';

describe('CrudProyectoAcademicoComponent', () => {
  let component: CrudProyectoAcademicoComponent;
  let fixture: ComponentFixture<CrudProyectoAcademicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrudProyectoAcademicoComponent]
    });
    fixture = TestBed.createComponent(CrudProyectoAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
