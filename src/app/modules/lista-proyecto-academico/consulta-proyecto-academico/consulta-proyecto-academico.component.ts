import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ListRegistroProyectoAcademicoComponent } from '../list-registro-proyecto-academico/list-registro-proyecto-academico.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NewNuxeoService } from 'src/app/utils/services/new_nuxeo.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import { OikosService } from 'src/app/services/oikos.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-consulta-proyecto-academico',
  templateUrl: './consulta-proyecto-academico.component.html',
  styleUrls: ['./consulta-proyecto-academico.component.scss']
})
export class ConsultaProyectoAcademicoComponent implements OnInit {

  @ViewChild('autosize', { static: false }) autosize!: CdkTextareaAutosize;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  basicform!: FormGroup;
  settings_emphasys: any;
  espacio= [];
  opcionSeleccionadoEspacio: boolean = false; 
  opcionSeleccionadoEspacioString!: string;
  CampoControl_espacio = new FormControl("", [Validators.required]);
  dataSource!: MatTableDataSource<any>;

  displayedColumns: string[] = ['nombre', 'activo'];



  constructor(private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _ngZone: NgZone,
    public dialogRef: MatDialogRef<ConsultaProyectoAcademicoComponent>,
    private routerService: Router,
    private oikosService: OikosService,
    private newNuxeoService: NewNuxeoService,
    private formBuilder: FormBuilder) {


    this.dataSource = new MatTableDataSource(data.enfasis);
      this.settings_emphasys = {
        actions: false,
        mode: 'external',
        hideSubHeader: true,
        columns: {
          EnfasisId: {
            title: this.translate.instant('GLOBAL.nombre'),
            // type: 'string;',
            valuePrepareFunction: (value: { Nombre: any; }) => {
              return value.Nombre;
            },
            width: '80%',
          },
          Activo: {
            title: this.translate.instant('GLOBAL.activo'),
            // type: 'string;',
            valuePrepareFunction: (value: any) => {
              return value ? translate.instant('GLOBAL.si') : translate.instant('GLOBAL.si');
            },
            width: '20%',
          },
        },
      };
    }


    onclick(): void {
      this.dialogRef.close();
    }

  downloadActoFile(project: any) {
    const filesToGet = [
      {
        Id: project.id_documento_acto,
        key: project.id_documento_acto,
      },
    ];
    this.newNuxeoService.get(filesToGet).subscribe(
      (      response: any) => {
        const filesResponse = <any>response;
        if (Object.keys(filesResponse).length === filesToGet.length) {
          // console.log("files", filesResponse);
          filesToGet.forEach((file: any) => {
            const url = filesResponse[0].url;
            window.open(url);
          });
        }
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          icon:'error',
          title: error.status + '',
          text: this.translate.instant('ERROR.' + error.status),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      });
  }

  cloneProject(project: any): void {
    this.routerService.navigateByUrl(`pages/proyecto_academico/crud-proyecto_academico/${project.Id}`);
    this.dialogRef.close();
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit() {
    this.loadespacio();
    this.basicform = this.formBuilder.group({
      codigo_interno: ['', Validators.required],
      codigo_snies: ['', Validators.required],
      facultad: ['', Validators.required],
      espacio: ['', Validators.required],
      nivel_proyecto: ['', Validators.required],
      metodologia_proyecto: ['', Validators.required],
      nombre_proyecto: ['', Validators.required],
      abreviacion_proyecto: ['', Validators.required],
      correo_proyecto: ['', [Validators.required, Validators.email]],
      numero_proyecto: ['', Validators.required],
      creditos_proyecto: ['', [Validators.required, Validators.maxLength(4)]],
      duracion_proyecto: ['', Validators.required],
      tipo_duracion_proyecto: ['', Validators.required],
      ciclos_proyecto: ['', Validators.required],
      ofrece_proyecto: ['', Validators.required],
      enfasis_proyecto: ['', Validators.required],
      proyecto_padre_id: ['', Validators.required],
   })

  }

  prueba() {
    this.openDialogRegistro()
  }

  openDialogRegistro(): void {
    const dialogRef = this.dialog.open(ListRegistroProyectoAcademicoComponent, {
      width: '1900px',
      height: '700px',
      data: {Id: this.data.Id},
    });
    dialogRef.afterClosed().subscribe((result: any) => {
    });
  }

  loadespacio() {
    this.oikosService
      .get("dependencia_tipo_dependencia/?query=TipoDependenciaId:"+this.data.Id+"&limit=0")
      .subscribe(
        (res: any) => {
          console.log(res)
          const r = <any>res;
          if (res !== null && r.Type !== "error") {
            this.espacio = res.map((data: any) => data.DependenciaId);
            
            this.espacio.forEach((esp: any) => {
              if (esp.Id === Number(this.data.iddependencia)) {
                 this.opcionSeleccionadoEspacio = esp;
               }
             });
          }
        },
        (error: HttpErrorResponse) => {
          Swal.fire({
            icon: "error",
            title: error.status + "",
            text: this.translate.instant("ERROR." + error.status),
            confirmButtonText: this.translate.instant("GLOBAL.aceptar")
          });
        }
      );
  }

}