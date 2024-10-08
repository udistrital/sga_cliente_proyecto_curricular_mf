import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { InstitucionEnfasis } from 'src/app/models/institucion_enfasis';
import { NuevoRegistro } from 'src/app/models/nuevo_registro';
import { RegistroCalificadoAcreditacion } from 'src/app/models/registro_calificado_acreditacion';
import { TipoRegistro } from 'src/app/models/tipo_registro';
import { DocumentoService } from 'src/app/services/documento.service';
import { NewNuxeoService } from 'src/app/services/new_nuxeo.service';
// @ts-ignore
import Swal from 'sweetalert2/dist/sweetalert2';
import { ListRegistroProyectoAcademicoComponent } from '../list-registro-proyecto-academico/list-registro-proyecto-academico.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SgaProyectoCurricularMidService } from 'src/app/services/sga-proyecto-curricular-mid.service';

@Component({
  selector: 'app-registro-proyecto-academico',
  templateUrl: './registro-proyecto-academico.component.html',
  styleUrls: ['./registro-proyecto-academico.component.scss'],
})
export class RegistroProyectoAcademicoComponent implements OnInit {
  settings: any;

  resoluform: any;

  fecha_creacion!: Date;
  fecha_vencimiento!: string;
  fecha_vencimiento_mostrar!: string;
  fecha_vigencia!: string;
  registro_califacado_acreditacion!: RegistroCalificadoAcreditacion;
  tipo_registro!: TipoRegistro;
  fecha_calculada_vencimiento!: string;
  registro_nuevo!: NuevoRegistro;
  picker: any;

  Campo11Control = new FormControl('', [
    Validators.required,
    Validators.maxLength(4),
  ]);
  Campo13Control = new FormControl('', [
    Validators.required,
    Validators.maxLength(4),
  ]);
  Campo14Control = new FormControl('', [Validators.required]);
  Campo22Control = new FormControl('', [
    Validators.required,
    Validators.maxLength(2),
  ]);
  Campo23Control = new FormControl('', [
    Validators.required,
    Validators.maxLength(1),
  ]);
  @Output() eventChange = new EventEmitter();

  subscription!: Subscription;
  arr_enfasis_proyecto: InstitucionEnfasis[] = [];
  settings_emphasys: any;

  fileDocumento: any;
  uidDocumento!: string;
  idDocumento!: number;

  constructor(
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ListRegistroProyectoAcademicoComponent>,
    private sanitization: DomSanitizer,
    private newNuxeoService: NewNuxeoService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private sgaProyectoCurricularMidService: SgaProyectoCurricularMidService
  ) {
    this.resoluform = formBuilder.group({
      resolucion: ['', Validators.required],
      ano_resolucion: ['', [Validators.required, Validators.maxLength(4)]],
      fecha_creacion: ['', Validators.required],
      mes_vigencia: ['', [Validators.required, Validators.maxLength(2)]],
      ano_vigencia: ['', [Validators.required, Validators.maxLength(1)]],
    });
  }

  mostrarfecha() {
    this.calculateEndDateMostrar(
      this.fecha_creacion,
      this.resoluform.value.ano_vigencia,
      this.resoluform.value.mes_vigencia,
      0
    );
    this.fecha_calculada_vencimiento = this.fecha_vencimiento_mostrar;
  }

  calculateEndDateMostrar(
    date: Date,
    years: number,
    months: number,
    days: number
  ): Date {
    const convertDate = moment(date)
      .add(years, 'year')
      .add(months, 'month')
      .add(days, 'day')
      .format('YYYY-MM-DD');
    this.fecha_vencimiento_mostrar = convertDate;
    return new Date(convertDate);
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }
  ngOnInit() {}

  registroproyecto() {}

  cleanURL(oldURL: string): SafeResourceUrl {
    return this.sanitization.bypassSecurityTrustUrl(oldURL);
  }

  onInputFileDocumento(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type === 'application/pdf') {
        file.urlTemp = URL.createObjectURL(event.srcElement.files[0]);
        file.url = this.cleanURL(file.urlTemp);
        file.IdDocumento = 9;
        file.file = event.target.files[0];
        this.fileDocumento = file;
      } else {
        this.snackBar.open(
          this.translate.instant('ERROR.formato_documento_pdf'),
          '',
          { duration: 3000, panelClass: ['error-snackbar'] }
        );
      }
    }
  }

  uploadFilesCreacionRegistro(files: any) {
    return new Promise((resolve, reject) => {
      files.forEach((file: any) => {
        (file.Id = file.nombre),
          (file.nombre =
            'soporte_' +
            file.IdDocumento +
            '_actualizacion_registro_proyecto_' +
            this.data.IdProyecto +
            '_tipo_registro_' +
            Number(this.data.tipo_registro));
        // file.key = file.Id;
        file.key = 'soporte_' + file.IdDocumento;
      });
      this.newNuxeoService.uploadFiles(files).subscribe(
        (responseNux: any[]) => {
          if (Object.keys(responseNux).length === files.length) {
            files.forEach((file: any) => {
              this.uidDocumento = file.uid;
              let f = responseNux.find((res) => res.res.Nombre == file.nombre);
              this.idDocumento = f.res.Id;
            });
            resolve(true);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  calculateEndDate(
    date: Date,
    years: number,
    months: number,
    days: number
  ): Date {
    const convertDate = moment(date)
      .add(years, 'year')
      .add(months, 'month')
      .add(days, 'day')
      .format('YYYY-MM-DDTHH:mm:ss');
    this.fecha_vencimiento = convertDate;
    return new Date(convertDate);
  }

  crearregistro() {
    if (this.resoluform.valid && this.fileDocumento) {
      this.calculateEndDate(
        this.fecha_creacion,
        this.resoluform.value.ano_vigencia,
        this.resoluform.value.mes_vigencia,
        0
      );

      this.registro_nuevo = {
        AnoActoAdministrativoId: this.resoluform.value.ano_resolucion,
        NumeroActoAdministrativo: Number(this.resoluform.value.resolucion),
        // FechaCreacionActoAdministrativo: this.fecha_creacion + ':00Z',
        FechaCreacionActoAdministrativo:
          moment(this.fecha_creacion).format('YYYY-MM-DDTHH:mm') + ':00Z',
        VigenciaActoAdministrativo:
          'Meses:' +
          this.resoluform.value.mes_vigencia +
          'Años:' +
          this.resoluform.value.ano_vigencia,
        VencimientoActoAdministrativo: this.fecha_vencimiento + 'Z',
        EnlaceActo: 'Ejemploenalce.udistrital.edu.co',
        // EnlaceActo: this.idDocumento + '',
        Activo: true,
        ProyectoAcademicoInstitucionId: {
          Id: this.data.IdProyecto,
        },
        TipoRegistroId: (this.tipo_registro = {
          Id: Number(this.data.tipo_registro),
        }),
      };

      const opt: any = {
        title: this.translate.instant('GLOBAL.crear'),
        text: this.translate.instant(
          'historial_registro.seguro_continuar_registrar'
        ),
        icon: 'warning',
        buttons: true,
        dangerMode: true,
        showCancelButton: true,
      };
      Swal.fire(opt)
        .then(async (willCreate: any) => {
          if (willCreate.value) {
            await this.uploadFilesCreacionRegistro([this.fileDocumento]);
            this.registro_nuevo.EnlaceActo = this.idDocumento + '';
            this.sgaProyectoCurricularMidService
              .post(
                'proyecto-academico/' + String(this.data.endpoint),
                this.registro_nuevo
              )
              .subscribe((res: any) => {
                if (res.succes) {
                  Swal.fire({
                    icon: 'error',
                    title: res.Code,
                    text: this.translate.instant('ERROR.' + res.Code),
                    confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                  });
                  this.snackBar.open(
                    this.translate.instant(
                      'historial_registro.registro_no_creado'
                    ),
                    '',
                    { duration: 3000, panelClass: ['error-snackbar'] }
                  );
                } else {
                  const opt1: any = {
                    title: this.translate.instant('historial_registro.creado'),
                    text: this.translate.instant(
                      'historial_registro.registro_creado'
                    ),
                    icon: 'success',
                    buttons: true,
                    dangerMode: true,
                    showCancelButton: true,
                  }; Swal.fire(opt1)
                    .then((willDelete: any) => {
                      if (willDelete.value) {
                      }
                    });
                  this.dialogRef.close();
                }
              });
          }
        })
        .catch((res: any) => {
          Swal.fire({
            icon: 'error',
            title: res.Code,
            text: this.translate.instant('ERROR.' + res.Code),
            confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
          });
          this.snackBar.open(
            this.translate.instant('historial_registro.registro_no_creado'),
            '',
            { duration: 3000, panelClass: ['error-snackbar'] }
          );
        });
    } else {
      const opt1: any = {
        title: this.translate.instant('GLOBAL.atencion'),
        text: this.translate.instant('proyecto.error_datos'),
        icon: 'error',
        buttons: true,
        dangerMode: true,
        showCancelButton: true,
      }; Swal.fire(opt1)
        .then((willDelete: any) => {
          if (willDelete.value) {

          }
        });
    }
  }
}
