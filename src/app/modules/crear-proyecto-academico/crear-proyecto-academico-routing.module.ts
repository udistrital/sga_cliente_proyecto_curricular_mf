import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudProyectoAcademicoComponent } from './crud-proyecto-academico/crud-proyecto-academico.component';

const routes: Routes = [
  { path: "", component: CrudProyectoAcademicoComponent },
  { path: ":proyecto_id", component: CrudProyectoAcademicoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrearProyectoAcademicoRoutingModule { }
