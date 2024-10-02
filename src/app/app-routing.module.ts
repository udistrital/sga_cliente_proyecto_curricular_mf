import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListProyectoAcademicoComponent } from './modules/lista-proyecto-academico/list-proyecto-academico.component/list-proyecto-academico.component.component';
import { CrudProyectoAcademicoComponent } from './modules/crear-proyecto-academico/crud-proyecto-academico/crud-proyecto-academico.component';
import { ListEnfasisComponent } from './modules/crear-proyecto-academico/list-enfasis/list-enfasis.component';
import { AuthGuard } from 'src/_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        './modules/lista-proyecto-academico/lista-proyecto-academico.module'
      ).then((m) => m.ListaProyectoAcademicoModule),
  },
  {
    path: 'lista',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        './modules/lista-proyecto-academico/lista-proyecto-academico.module'
      ).then((m) => m.ListaProyectoAcademicoModule),
  },
  {
    path: 'crear',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        './modules/crear-proyecto-academico/crear-proyecto-academico.module'
      ).then((m) => m.CrearProyectoAcademicoModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: '/proyecto-curricular/' }],
})
export class AppRoutingModule {}
