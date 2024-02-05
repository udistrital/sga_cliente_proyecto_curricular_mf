import { APP_BASE_HREF } from "@angular/common";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListProyectoAcademicoComponent } from "./components/list-proyecto-academico.component/list-proyecto-academico.component.component";
import { RegistroProyectoAcademicoComponent } from "./components/registro-proyecto-academico/registro-proyecto-academico.component";
import { ListRegistroProyectoAcademicoComponent } from "./components/list-registro-proyecto-academico/list-registro-proyecto-academico.component";
import { ConsultaProyectoAcademicoComponent } from "./components/consulta-proyecto-academico/consulta-proyecto-academico.component";

const routes: Routes = [
  { path: "lista", component: ListProyectoAcademicoComponent },
  { path: "ver",  component: ConsultaProyectoAcademicoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: "/proyecto_academico/" }],
})
export class AppRoutingModule {}