import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { BodyOutputType, Toast, ToasterConfig, ToasterService } from 'angular2-toaster';

import { DocumentoService } from 'src/app/services/documento.service';
import { SgaMidService } from 'src/app/services/sga_mid.service';
import { NewNuxeoService } from 'src/app/utils/services/new_nuxeo.service';
import Swal from 'sweetalert2';
import { RegistroProyectoAcademicoComponent } from '../registro-proyecto-academico/registro-proyecto-academico.component';
import * as momentTimezone from 'moment-timezone';
import { ConsultaProyectoAcademicoComponent } from '../consulta-proyecto-academico/consulta-proyecto-academico.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-list-registro-proyecto-academico',
  templateUrl: './list-registro-proyecto-academico.component.html',
  styleUrls: ['./list-registro-proyecto-academico.component.scss']
})
export class ListRegistroProyectoAcademicoComponent implements OnInit {
  config!: ToasterConfig;
  settings: any;
  index: any;
  idproyecto: any;
  displayedColumns = ['Id', 'Registro', 'Vigencia', 'Tipo de registro', 'Tiempo de vigencia', 'Activo',
    'Fecha Inicio Registro', 'Fecha Vencimiento Registro', 'Documento'];
    
  dataSource!: MatTableDataSource<any>;

  //source: LocalDataSource = new LocalDataSource();
  listaDatos = [];
  proyectoJson: any;
  cardSize = 4;

  constructor(private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConsultaProyectoAcademicoComponent>,
    private sgamidService: SgaMidService,
    private nuxeoService: NewNuxeoService,
    private documentoService: DocumentoService,
    private newNuxeoService: NewNuxeoService,
    public dialog: MatDialog,
    private toasterService: ToasterService) {
    this.loadData();
  }

  

  loadData(): void {
    const opt1: any = {
      title: this.translate.instant('GLOBAL.atencion'),
      text: this.translate.instant('oferta.evento'),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    }
    this.sgamidService.get('consulta_proyecto_academico/get_registro/' + this.data.Id)
      .subscribe(res => {
        if (res !== null && res[0] !== 'error') {
          const data = <Array<any>>res;
          data.forEach(element => {
            element.TipoRegistroIdNombre = element.TipoRegistroId.Nombre
            element.FechaCreacionActoAdministrativo = momentTimezone.tz(element.FechaCreacionActoAdministrativo, 'America/Bogota').format('DD-MM-YYYY')
            element.VencimientoActoAdministrativo = momentTimezone.tz(element.VencimientoActoAdministrativo, 'America/Bogota').format('DD-MM-YYYY')
            console.log(data)
            this.dataSource = new MatTableDataSource(data);
          });
        } else {
          Swal.fire(opt1)
            .then((willDelete) => {
              if (willDelete.value) {
              }
            });
        }
      },
        (error: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: error.status + '',
            text: this.translate.instant('ERROR.' + error.status),
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          });
        });
  }

  onAction(event:any) {
    console.log("Se llamo al botón")

    this.highlight(event)
    console.log(event)
    switch (event.action) {
      case 'Documento':
        this.downloadFile(event);
        break;
    }
  }

  downloadFile(id_documento: any) {
    console.log("Se llamo a download")
    let filesToGet = [
      {
        Id: id_documento.data.EnlaceActo,
        key: id_documento.data.EnlaceActo,
      },
    ];
    this.newNuxeoService.get(filesToGet).subscribe(
      response => {
        console.log(response)
        const filesResponse = <any>response;
        if (Object.keys(filesResponse).length === filesToGet.length) {
          // console.log("files", filesResponse);
          filesToGet.forEach((file: any) => {
            console.log("--", file)
            const url = filesResponse[0].url;
            window.open(url);
          });
        }
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: error.status + '',
          text: this.translate.instant('ERROR.' + error.status),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      });
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit() {
  }

  onclick(): void {
    this.dialogRef.close();
  }

  highlight(row:any): void {
    this.idproyecto = row.data.ProyectoAcademicoInstitucionId.Id;
  }

  OpenRegistroCalificado(): void {
    const dialogRef = this.dialog.open(RegistroProyectoAcademicoComponent, {
      width: '550px',
      height: '750px',
      data: { IdProyecto: this.data.Id, endpoint: 'registro_calificado', tipo_registro: 1 },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
    });
  }

  OpenRegistroAlta(): void {
    const dialogRef = this.dialog.open(RegistroProyectoAcademicoComponent, {
      width: '550px',
      height: '750px',
      data: { IdProyecto: this.data.Id, endpoint: 'registro_alta_calidad', tipo_registro: 2 },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
    });
  }

  private showToast(type: string, title: string, body: string) {
    this.config = new ToasterConfig({
      // 'toast-top-full-width', 'toast-bottom-full-width', 'toast-top-left', 'toast-top-center'
      positionClass: 'toast-top-center',
      timeout: 5000,  // ms
      newestOnTop: true,
      tapToDismiss: false, // hide on click
      preventDuplicates: true,
      animation: 'slideDown', // 'fade', 'flyLeft', 'flyRight', 'slideDown', 'slideUp'
      limit: 5,
    });
    const toast: Toast = {
      type: 'info', // 'default', 'info', 'success', 'warning', 'error'
      title: title,
      body: body,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.toasterService.popAsync(toast);
  }
}