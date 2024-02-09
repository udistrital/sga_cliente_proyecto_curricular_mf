import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProyectoAcademicoComponent } from './list-proyecto-academico.component.component';

describe('ListProyectoAcademicoComponentComponent', () => {
  let component: ListProyectoAcademicoComponent;
  let fixture: ComponentFixture<ListProyectoAcademicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListProyectoAcademicoComponent]
    });
    fixture = TestBed.createComponent(ListProyectoAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
