import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistroProyectoAcademicoComponent } from './components/registro-proyecto-academico/registro-proyecto-academico.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListRegistroProyectoAcademicoComponent } from './components/list-registro-proyecto-academico/list-registro-proyecto-academico.component';
import { ConsultaProyectoAcademicoComponent } from './components/consulta-proyecto-academico/consulta-proyecto-academico.component';
import { SgaMidService } from './services/sga_mid.service';
import { DocumentoService } from './services/documento.service';
import { OikosService } from './services/oikos.service';
import { AnyService } from './services/any.service';
import { NewNuxeoService } from './utils/services/new_nuxeo.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ListProyectoAcademicoComponent } from './components/list-proyecto-academico.component/list-proyecto-academico.component.component';
import { CrudProyectoAcademicoComponent } from './components/crud-proyecto-academico/crud-proyecto-academico.component';
import { ModificarProyectoAcademicoComponent } from './components/modificar-proyecto-academico/modificar-proyecto-academico.component';
import { ProyectoAcademicoService } from './services/proyecto_academico.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { TercerosService } from './services/terceros.service';
import { CoreService } from './services/core.service';
import {MatTabsModule} from '@angular/material/tabs';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.apiUrl+'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    RegistroProyectoAcademicoComponent,
    ListRegistroProyectoAcademicoComponent,
    ConsultaProyectoAcademicoComponent,
    ListProyectoAcademicoComponent,
    CrudProyectoAcademicoComponent,
    ModificarProyectoAcademicoComponent
  ],
  imports: [
    MatTabsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatTableModule, 
    MatPaginatorModule,
    MatDialogModule,
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  exports:[
    MatDialogModule,
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    SgaMidService,
    DocumentoService,
    OikosService,
    AnyService,
    NewNuxeoService,
    ProyectoAcademicoService,
    TercerosService,
    CoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
