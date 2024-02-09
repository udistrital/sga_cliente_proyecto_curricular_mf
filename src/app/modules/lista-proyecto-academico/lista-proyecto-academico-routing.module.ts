import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProyectoAcademicoComponent } from './list-proyecto-academico.component/list-proyecto-academico.component.component';

const routes: Routes = [
  { path: "", component: ListProyectoAcademicoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaProyectoAcademicoRoutingModule { }
