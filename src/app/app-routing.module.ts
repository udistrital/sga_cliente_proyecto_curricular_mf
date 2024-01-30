import { APP_BASE_HREF } from "@angular/common";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EmptyRouteComponent } from "./components/empty-route/empty-route.component";
import { RegistroProyectoAcademicoComponent } from "./components/registro-proyecto-academico/registro-proyecto-academico.component";
import { ListRegistroProyectoAcademicoComponent } from "./components/list-registro-proyecto-academico/list-registro-proyecto-academico.component";
import { ListProyectoAcademicoComponent } from "./components/list-proyecto-academico.component/list-proyecto-academico.component.component";

const routes: Routes = [
  { path: "lista", component: ListProyectoAcademicoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: "/proyecto_academico/" }],
})
export class AppRoutingModule {}