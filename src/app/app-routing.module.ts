import { APP_BASE_HREF } from "@angular/common";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListProyectoAcademicoComponent } from "./components/list-proyecto-academico.component/list-proyecto-academico.component.component";
import { CrudProyectoAcademicoComponent } from "./components/crud-proyecto-academico/crud-proyecto-academico.component";
import { ListEnfasisComponent } from "./components/list-enfasis/list-enfasis.component";

const routes: Routes = [
  { path: "lista", component: ListProyectoAcademicoComponent },
  { path: "", component: ListProyectoAcademicoComponent },
  { path: "crear", component: CrudProyectoAcademicoComponent },
  { path: "crear/:proyecto_id", component: CrudProyectoAcademicoComponent},
  { path: "ver",  component: ListEnfasisComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: "/proyecto_academico/" }],
})
export class AppRoutingModule {}