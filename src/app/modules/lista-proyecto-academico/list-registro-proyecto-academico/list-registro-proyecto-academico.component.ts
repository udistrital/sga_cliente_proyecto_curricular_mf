import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { DocumentoService } from 'src/app/services/documento.service';
import { NewNuxeoService } from 'src/app/services/new_nuxeo.service';
// @ts-ignore
import Swal from 'sweetalert2/dist/sweetalert2';
import { RegistroProyectoAcademicoComponent } from '../registro-proyecto-academico/registro-proyecto-academico.component';
import * as momentTimezone from 'moment-timezone';
import { ConsultaProyectoAcademicoComponent } from '../consulta-proyecto-academico/consulta-proyecto-academico.component';
import { MatTableDataSource } from '@angular/material/table';
import { SgaProyectoCurricularMidService } from 'src/app/services/sga-proyecto-curricular-mid.service';

@Component({
  selector: 'app-list-registro-proyecto-academico',
  templateUrl: './list-registro-proyecto-academico.component.html',
  styleUrls: ['./list-registro-proyecto-academico.component.scss']
})
export class ListRegistroProyectoAcademicoComponent implements OnInit {
  settings: any;
  index: any;
  idproyecto: any;
  displayedColumns = ['Id', 'Registro', 'Vigencia', 'Tipo de registro', 'Tiempo de vigencia', 'Activo',
    'Fecha Inicio Registro', 'Fecha Vencimiento Registro', 'Documento'];
    
  dataSource!: MatTableDataSource<any>;

  listaDatos = [];
  proyectoJson: any;
  cardSize = 4;

  constructor(private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConsultaProyectoAcademicoComponent>,
    private sgaProyectoCurricularMidService: SgaProyectoCurricularMidService,
    private nuxeoService: NewNuxeoService,
    private documentoService: DocumentoService,
    private newNuxeoService: NewNuxeoService,
    public dialog: MatDialog) {
    this.loadData();
  }

  

  loadData(): void {
    const opt1: any = {
      title: this.translate.instant('GLOBAL.atencion'),
      text: this.translate.instant('oferta.evento'),
      icon: 'warning',
      
      showCancelButton: true,
    }
    this.sgaProyectoCurricularMidService.get('proyecto-academico/registro/'+this.data.Id)
      .subscribe(res => {
        if (res.success) {
          const data = <Array<any>>res.data;
          data.forEach(element => {
            element.TipoRegistroIdNombre = element.TipoRegistroId.Nombre
            element.FechaCreacionActoAdministrativo = momentTimezone.tz(element.FechaCreacionActoAdministrativo, 'America/Bogota').format('DD-MM-YYYY')
            element.VencimientoActoAdministrativo = momentTimezone.tz(element.VencimientoActoAdministrativo, 'America/Bogota').format('DD-MM-YYYY')
            this.dataSource = new MatTableDataSource(data);
          });
        } else {
          Swal.fire(opt1)
            .then((willDelete: any) => {
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

    this.highlight(event)
    switch (event.action) {
      case 'Documento':
        this.downloadFile(event);
        break;
    }
  }

  downloadFile(id_documento: any) {

    let filesToGet = [
      {
        Id: id_documento,
        key: id_documento,
      },
    ];
    this.newNuxeoService.get(filesToGet).subscribe(
      response => {
        const filesResponse = <any>response;
        if (Object.keys(filesResponse).length === filesToGet.length) {
          filesToGet.forEach((file: any) => {
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
    this.idproyecto = row.ProyectoAcademicoInstitucionId.Id;
  }

  OpenRegistroCalificado(): void {
    const dialogRef = this.dialog.open(RegistroProyectoAcademicoComponent, {
      width: '550px',
      height: '750px',
      data: { IdProyecto: this.data.Id, endpoint: 'registros-calificados', tipo_registro: 1 },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
    });
  }

  OpenRegistroAlta(): void {
    const dialogRef = this.dialog.open(RegistroProyectoAcademicoComponent, {
      width: '550px',
      height: '750px',
      data: { IdProyecto: this.data.Id, endpoint: `${this.data.Id}/registros-alta-calidad/`, tipo_registro: 2 },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
    });
  }
}