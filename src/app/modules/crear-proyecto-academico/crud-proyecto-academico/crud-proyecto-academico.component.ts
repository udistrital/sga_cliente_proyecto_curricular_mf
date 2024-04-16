import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, NgZone, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Subscription, take } from 'rxjs';
import { Enfasis } from 'src/app/models/enfasis';
import { InstitucionEnfasis } from 'src/app/models/institucion_enfasis';
import { Metodologia } from 'src/app/models/metodologia';
import { NivelFormacion } from 'src/app/models/nivel_formacion';
import { Dependencia } from 'src/app/models/oikos/dependencia';
import { DependenciaTipoDependencia } from 'src/app/models/oikos/dependencia_tipo_dependencia';
import { TipoDependencia } from 'src/app/models/oikos/tipo_dependencia';
import { TrDependenciaPadre } from 'src/app/models/oikos/tr_dependencia_padre';
import { ProyectoAcademicoInstitucion } from 'src/app/models/proyecto_academico_institucion';
import { ProyectoAcademicoPost } from 'src/app/models/proyecto_academico_post';
import { RegistroCalificadoAcreditacion } from 'src/app/models/registro_calificado_acreditacion';
import { TipoRegistro } from 'src/app/models/tipo_registro';
import { TipoTitulacion } from 'src/app/models/tipo_titulacion';
import { Titulacion } from 'src/app/models/titulacion';
import { CoreService } from 'src/app/services/core.service';
import { DocumentoService } from 'src/app/services/documento.service';
import { ListEnfasisService } from 'src/app/services/list_enfasis.service';
import { OikosService } from 'src/app/services/oikos.service';
import { ProyectoAcademicoService } from 'src/app/services/proyecto_academico.service';
import { NewNuxeoService } from 'src/app/services/new_nuxeo.service';
import Swal from 'sweetalert2';
import { ListEnfasisComponent } from '../list-enfasis/list-enfasis.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SgaProyectoCurricularMidService } from 'src/app/services/sga-proyecto-curricular-mid.service';

@Component({
  selector: 'app-crud-proyecto-academico',
  templateUrl: './crud-proyecto-academico.component.html',
  styleUrls: ['./crud-proyecto-academico.component.scss']
})
export class CrudProyectoAcademicoComponent implements OnInit, OnDestroy {
  @ViewChild('autosize', { static: false }) autosize!: CdkTextareaAutosize;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  isLinear = true;
  checkregistro = false;
  settings: any;
  basicform: any;
  resoluform: any;
  actoform: any;
  compleform: any;
  facultad = [];
  espacio_fisico = [];
  area = [];
  opcionSeleccionadoFacultad: any;
  opcionSeleccionadoEspacioFisico: any;
  opcionSeleccionadoUnidad: any;
  opcionSeleccionadoArea: any;
  opcionSeleccionadoNucleo: any;
  opcionSeleccionadoEnfasis: any;
  opcionSeleccionadoNivel: any;
  opcionSeleccionadoMeto: any;
  checkenfasis: boolean = false;
  checkciclos: boolean = false;
  checkofrece: boolean = false;
  nucleo = [];
  unidad = [];
  enfasis = [];
  nivel = [];
  metodo = [];
  fecha_creacion!: Date;
  fecha_vencimiento!: string;
  fecha_vencimiento_mostrar!: string;
  fecha_vigencia!: string;
  proyecto_academicoPost: ProyectoAcademicoPost = new ProyectoAcademicoPost;
  proyecto_academico: ProyectoAcademicoInstitucion = new ProyectoAcademicoInstitucion;
  tipo_titulacion: TipoTitulacion = new TipoTitulacion;
  metodologia: Metodologia = new Metodologia;
  nivel_formacion: NivelFormacion = new NivelFormacion;
  registro_califacado_acreditacion: RegistroCalificadoAcreditacion = new RegistroCalificadoAcreditacion;
  tipo_registro: TipoRegistro = new TipoRegistro;
  enfasis_proyecto!: InstitucionEnfasis[];
  enfasis_basico: Enfasis = new Enfasis;
  titulacion_proyecto_snies: Titulacion = new Titulacion;
  titulacion_proyecto_mujer: Titulacion = new Titulacion;
  titulacion_proyecto_hombre: Titulacion = new Titulacion;
  tipo_dependencia: TipoDependencia = new TipoDependencia;
  dependencia_tipo_dependencia: DependenciaTipoDependencia = new DependenciaTipoDependencia;
  dependencia: Dependencia = new Dependencia;
  fecha_calculada_vencimiento!: string;
  fileResolucion: any;
  fileActoAdministrativo: any;
  uidResolucion!: string;
  uidActoAdministrativo!: string;
  idDocumentoAdministrativo!: number;
  disable: boolean = true;
  idDocumentoResolucion!: number;
  proyecto_padre_id: ProyectoAcademicoInstitucion = new ProyectoAcademicoInstitucion;

  CampoControl = new FormControl('', [Validators.required]);
  CampoControl_espacio = new FormControl('', [Validators.required]);
  Campo1Control = new FormControl('', [Validators.required]);
  Campo2Control = new FormControl('', [Validators.required]);
  Campo3Control = new FormControl('', [Validators.required]);
  Campo4Control = new FormControl('', [Validators.required]);
  Campo5Control = new FormControl('', [Validators.required]);
  Campo6Control = new FormControl('', [Validators.required]);
  Campo7Control = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(3), Validators.pattern('^[0-9]*$')]);
  Campo8Control = new FormControl('', [Validators.required]);
  Campo9Control = new FormControl('', [Validators.required]);
  Campo10Control = new FormControl('', [Validators.required]);
  Campo11Control = new FormControl('', [Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]*$')]);
  Campo12Control = new FormControl('', [Validators.required]);
  Campo13Control = new FormControl('', [Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]*$')]);
  Campo14Control = new FormControl('', [Validators.required]);
  Campo16Control = new FormControl('', [Validators.required]);
  Campo17Control = new FormControl('', [Validators.required, Validators.maxLength(4)]);
  Campo18Control = new FormControl('', [Validators.required]);
  Campo19Control = new FormControl('', [Validators.required]);
  Campo20Control = new FormControl('', [Validators.required]);
  Campo21Control = new FormControl('', [Validators.required]);
  Campo22Control = new FormControl('', [Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]*$'), Validators.max(12)]);
  Campo23Control = new FormControl('', [Validators.required, Validators.maxLength(1), Validators.pattern('^[0-9]*$')]);
  Campo24Control = new FormControl('', [Validators.required]);
  CampoCorreoControl = new FormControl('', [Validators.required, Validators.email]);
  CampoCreditosControl = new FormControl('', [Validators.required, Validators.maxLength(4)]);
  selectFormControl = new FormControl('', Validators.required);
  @Output() eventChange = new EventEmitter();

  subscription: Subscription;
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['nombre','acciones'];
  arr_enfasis_proyecto: InstitucionEnfasis[] = [];
  settings_emphasys: any;

  dpDayPickerConfig: any;

  constructor(private translate: TranslateService,
    private oikosService: OikosService,
    private routerService: Router,
    private _ngZone: NgZone,
    private coreService: CoreService,
    private proyectoacademicoService: ProyectoAcademicoService,
    private sgaProyectoCurricularMidService: SgaProyectoCurricularMidService,
    private dialogService: MatDialog,
    private activatedRoute: ActivatedRoute,
    private sanitization: DomSanitizer,
    private listEnfasisService: ListEnfasisService,
    private newNuxeoService: NewNuxeoService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar) {

    this.dpDayPickerConfig = {
      locale: 'es',
      format: 'YYYY-MM-DD HH:mm',
      showTwentyFourHours: false,
      showSeconds: false,
      returnedValueicon: 'String',
    }
    this.basicform = formBuilder.group({
      codigo_snies: ['', Validators.required],
      codigo_interno: ['', Validators.required],
      nombre_proyecto: ['', Validators.required],
      abreviacion_proyecto: ['', Validators.required],
      correo_proyecto: ['', [Validators.required, Validators.email]],
      numero_proyecto: ['', Validators.required],
      creditos_proyecto: ['', [Validators.required, Validators.maxLength(4)]],
      duracion_proyecto: ['', Validators.required],
      selector: [''],
    })
    this.resoluform = formBuilder.group({
      resolucion: ['', [Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]*$')]],
      ano_resolucion: ['', [Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]*$')]],
      fecha_creacion: ['', Validators.required],
      mes_vigencia: ['', [Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]*$'), Validators.max(12)]],
      ano_vigencia: ['', [Validators.required, Validators.maxLength(1), Validators.pattern('^[0-9]*$')]],
      documento: ['', Validators.required],
      Campo4Control: [{ value: '', disabled: true }, Validators.required],
    })
    this.actoform = formBuilder.group({
      acto: ['', Validators.required],
      ano_acto: ['', [Validators.required, Validators.maxLength(4)]],
      documento: ['', Validators.required],
    })
    this.compleform = formBuilder.group({
      titulacion_snies: ['', Validators.required],
      titulacion_mujer: ['', Validators.required],
      titulacion_hombre: ['', Validators.required],
      competencias: ['', Validators.required],
    });

    this.subscription = this.listEnfasisService.getListEnfasis().subscribe(listEnfasis => {
      if (listEnfasis) {
        this.enfasis = listEnfasis;
      } else {
        // clear messages when empty message received
        // do not do anything on error
      }
    });

  }

  onCreateEmphasys(event: any) {
    const emphasys = event.value;
    if (!this.arr_enfasis_proyecto.find((enfasis: any) => emphasys.Id === enfasis.Id) && emphasys.Id) {
      this.arr_enfasis_proyecto.push(emphasys);
      this.dataSource = new MatTableDataSource(this.arr_enfasis_proyecto);
      const matSelect: MatSelect = event.source;
      matSelect.writeValue(null);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'ERROR',
        text: this.translate.instant('enfasis.error_enfasis_ya_existe'),
        confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
      });
    }
  }

  onDeleteEmphasys(event: any) {
    const findInArray = (value:any, array:any, attr:any) => {
      for (let i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
          return i;
        }
      }
      return -1;
    }
    this.arr_enfasis_proyecto.splice(findInArray(event.Id, this.arr_enfasis_proyecto, 'Id'), 1);
    this.dataSource = new MatTableDataSource(this.arr_enfasis_proyecto);
  }

  mostrarfecha() {
    this.calculateEndDateMostrar(this.fecha_creacion, this.resoluform.value.ano_vigencia, this.resoluform.value.mes_vigencia, 0)
    this.fecha_calculada_vencimiento = this.fecha_vencimiento_mostrar
  }

  calculateEndDateMostrar(date: Date, years: number, months: number, days: number): Date {
    const convertDate = moment(date).add(years, 'year').add(months, 'month').add(days, 'day').format('YYYY-MM-DD');
    this.fecha_vencimiento_mostrar = convertDate
    return new Date(convertDate);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  openListEnfasisComponent() {
    this.dialogService.open(ListEnfasisComponent, {
      width: '1050px',
      height: 'auto'
    });
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit() {
    this.loadespacio();
    this.loadfacultad();
    this.loadarea();
    this.loadnucleo();
    this.loadunidadtiempo();
    this.loadenfasis();
    this.loadnivel();
    this.loadmetodologia();

    // cargar data del proyecto que se clonara
    this.activatedRoute.paramMap.subscribe(params => {
      const clone_project_id = params.get('proyecto_id');
      if (clone_project_id) {
        this.loadCloneData(clone_project_id);
      }
    });
  }

  onSelectionChanged(value:any) {
    this.resoluform.enable();
  }

  loadCloneData(id: any): void {
    this.Campo2Control.setValidators([Validators.nullValidator]);
    //AQUI SGA_MID_SERVICE MODIFICADO
    // this.sgamidService.get('consulta_proyecto_academico/' + id)
    this.sgaProyectoCurricularMidService.get('proyecto-academico/' + id)
      .subscribe((res: any) => {
        console.log(res)
        if (res.success && res.data.length > 0) {
          const proyecto_a_clonar = res.data[0];
          this.proyecto_padre_id = proyecto_a_clonar.ProyectoAcademico;
          // enfasis
          this.arr_enfasis_proyecto = proyecto_a_clonar.Enfasis.map((enfasis: any) => enfasis.EnfasisId);
          // checks
          this.checkciclos = proyecto_a_clonar.ProyectoAcademico.CiclosPropedeuticos;
          this.checkofrece = proyecto_a_clonar.ProyectoAcademico.Oferta;
          // selects
          // unidad de tiempo
          this.opcionSeleccionadoUnidad = this.unidad.find((unidad_temp: any) => unidad_temp.Id === proyecto_a_clonar.ProyectoAcademico.UnidadTiempoId);
          this.opcionSeleccionadoNivel = this.nivel.find((nivel_temp: any) => nivel_temp.Id === proyecto_a_clonar.ProyectoAcademico.NivelFormacionId.Id);
          this.opcionSeleccionadoMeto = this.metodo.find((metodologia_temp: any) => metodologia_temp.Id === proyecto_a_clonar.ProyectoAcademico.MetodologiaId.Id);
          this.opcionSeleccionadoFacultad = this.facultad.find((facultad_temp: any) => facultad_temp.Id === proyecto_a_clonar.IdDependenciaFacultad);
          this.opcionSeleccionadoArea = this.area.find((area_temp: any) => area_temp.Id === proyecto_a_clonar.ProyectoAcademico.AreaConocimientoId);
          this.opcionSeleccionadoNucleo = this.nucleo.find((nucleo_temp: any) => nucleo_temp.Id === proyecto_a_clonar.ProyectoAcademico.NucleoBaseId);
          this.opcionSeleccionadoEspacioFisico = this.espacio_fisico.find((espacio_fisico_temp: any) => espacio_fisico_temp.Id === proyecto_a_clonar.IdEspacioFisico)
          // info basica
          this.basicform = this.formBuilder.group({
            codigo_snies: ['', Validators.required],
            codigo_interno: ['', Validators.required],
            nombre_proyecto: ['', Validators.required],
            abreviacion_proyecto: [proyecto_a_clonar.ProyectoAcademico.CodigoAbreviacion, Validators.required],
            correo_proyecto: [proyecto_a_clonar.ProyectoAcademico.CorreoElectronico, [Validators.required, Validators.email]],
            numero_proyecto: [proyecto_a_clonar.TelefonoDependencia, Validators.required],
            creditos_proyecto: [proyecto_a_clonar.ProyectoAcademico.NumeroCreditos, [Validators.required, Validators.maxLength(4)]],
            duracion_proyecto: [proyecto_a_clonar.ProyectoAcademico.Duracion, Validators.required],
            selector: [''],
          })
          // acto administrativo
          this.actoform = this.formBuilder.group({
            acto: ['', Validators.required],
            ano_acto: ['', [Validators.required, Validators.maxLength(4)]],
            documento: ['', Validators.required],
          })

          this.compleform = this.formBuilder.group({
            titulacion_snies: [proyecto_a_clonar.Titulaciones.find((titulacion: any) => titulacion.TipoTitulacionId.Id === 1).Nombre, Validators.required],
            titulacion_mujer: [proyecto_a_clonar.Titulaciones.find((titulacion: any) => titulacion.TipoTitulacionId.Id === 3).Nombre, Validators.required],
            titulacion_hombre: [proyecto_a_clonar.Titulaciones.find((titulacion: any) => titulacion.TipoTitulacionId.Id === 2).Nombre, Validators.required],
            competencias: [proyecto_a_clonar.ProyectoAcademico.Competencias, Validators.required],
          });
        } else {
          this.snackBar.open(this.translate.instant('proyecto.proyecto_no_cargado'), '', {duration: 3000,panelClass: ['error-snackbar']});
        }
      }, () => {
        this.snackBar.open(this.translate.instant('proyecto.proyecto_no_cargado'), '', {duration: 3000,panelClass: ['error-snackbar']});
      });
  }

  cleanURL(oldURL: string): SafeResourceUrl {
    return this.sanitization.bypassSecurityTrustUrl(oldURL);
  }

  onInputFileResolucion(event:any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type === 'application/pdf') {
        file.urlTemp = URL.createObjectURL(event.srcElement.files[0]);
        file.url = this.cleanURL(file.urlTemp);
        file.IdDocumento = 9;
        file.file = event.target.files[0];
        this.fileResolucion = file;
      } else {
        this.snackBar.open(this.translate.instant('ERROR.formato_documento_pdf'), '', {duration: 3000,panelClass: ['error-snackbar']});
      }
    }
  }

  onInputFileActo(event:any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type === 'application/pdf') {
        file.urlTemp = URL.createObjectURL(event.srcElement.files[0]);
        file.url = this.cleanURL(file.urlTemp);
        file.IdDocumento = 10;
        file.file = event.target.files[0];
        this.fileActoAdministrativo = file;
      } else {
        this.snackBar.open(this.translate.instant('ERROR.formato_documento_pdf'), '', {duration: 3000,panelClass: ['error-snackbar']});
      }
    }
  }

  uploadFilesCreacionProyecto(files:any) {
    return new Promise((resolve, reject) => {
      files.forEach((file:any) => {
        file.Id = file.nombre,
          file.nombre = 'soporte_' + file.IdDocumento + '_creacion_proyecto_curricular_'
          + this.basicform.value.codigo_snies + '_' + this.basicform.value.nombre_proyecto;
        // file.key = file.Id;
        file.key = 'soporte_' + file.IdDocumento;
      });
      this.newNuxeoService.uploadFiles(files).subscribe(
        (responseNux: any[]) => {
          if (Object.keys(responseNux).length === files.length) {
            files.forEach((file:any) => {
              if (file.IdDocumento === 9) {
                this.uidResolucion = file.uid;
                let f = responseNux.find((res) => res.res.Nombre == file.nombre);
                this.idDocumentoResolucion = f.res.Id;
              } else if (file.IdDocumento === 10) {
                this.uidActoAdministrativo = file.uid;
                let f = responseNux.find((res) => res.res.Nombre == file.nombre);
                this.idDocumentoAdministrativo = f.res.Id;
              }
            });
            resolve(true);
          }
        }, error => {
          reject(error);
        });
    });
  }

  loadfacultad() {
    this.oikosService.get('dependencia_tipo_dependencia/?query=TipoDependenciaId:2')
      .subscribe((res: any) => {
        const r = <any>res;
        if (res !== null && r.Type !== 'error') {
          this.facultad = res.map((data: any) => (data.DependenciaId));
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

  loadespacio() {
    this.oikosService.get('dependencia_tipo_dependencia/?query=TipoDependenciaId:1&limit=0')
      .subscribe((res: any) => {
        const r = <any>res;
        if (res !== null && r.Type !== 'error') {
          this.espacio_fisico = res.map((data: any) => (data.DependenciaId));
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

  loadarea() {
    this.coreService.get('area_conocimiento')
      .subscribe(res => {
        const r = <any>res;
        if (res !== null && r.Type !== 'error') {
          this.area = <any>res;
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

  loadnucleo() {
    this.coreService.get('nucleo_basico_conocimiento')
      .subscribe(res => {
        const r = <any>res;
        if (res !== null && r.Type !== 'error') {
          this.nucleo = <any>res;
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

  loadunidadtiempo() {
    this.coreService.get('unidad_tiempo')
      .subscribe(res => {
        const r = <any>res;
        if (res !== null && r.Type !== 'error') {
          this.unidad = <any>res;
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

  loadenfasis() {
    this.proyectoacademicoService.get('enfasis')
      .subscribe(res => {
        const r = <any>res;
        if (res !== null && r.Type !== 'error') {
          this.enfasis = <any>res;
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

  loadnivel() {
    this.proyectoacademicoService.get('nivel_formacion')
      .subscribe(res => {
        const r = <any>res;
        if (res !== null && r.Type !== 'error') {
          this.nivel = <any>res;
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

  loadmetodologia() {
    this.proyectoacademicoService.get('metodologia')
      .subscribe(res => {
        const r = <any>res;
        if (res !== null && r.Type !== 'error') {
          this.metodo = <any>res;
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

  calculateEndDate(date: Date, years: number, months: number, days: number): Date {
    const convertDate = moment(date).add(years, 'year').add(months, 'month').add(days, 'day').format('YYYY-MM-DDTHH:mm:ss');
    this.fecha_vencimiento = convertDate
    return new Date(convertDate);
  }

  openlist(): void {
    this.routerService.navigateByUrl(`pages/proyecto_academico/list-proyecto_academico`);
  }

  registroproyecto() {
    try {
      if (this.basicform.valid & this.resoluform.valid & this.compleform.valid & this.actoform.valid && this.arr_enfasis_proyecto.length > 0
        && this.fileActoAdministrativo) {
        this.metodologia = {
          Id: this.opcionSeleccionadoMeto['Id'],
        }
        this.nivel_formacion = <NivelFormacion>{
          Id: this.opcionSeleccionadoNivel['Id'],
        }
        this.proyecto_academico = {
          Id: 0,
          Nombre: this.basicform.value.nombre_proyecto,
          CodigoSnies: this.basicform.value.codigo_snies,
          Codigo: this.basicform.value.codigo_interno,
          Duracion: Number(this.basicform.value.duracion_proyecto),
          NumeroCreditos: Number(this.basicform.value.creditos_proyecto),
          CorreoElectronico: this.basicform.value.correo_proyecto,
          CiclosPropedeuticos: this.checkciclos,
          NumeroActoAdministrativo: Number(this.actoform.value.acto),
          EnlaceActoAdministrativo: 'Pruebalinkdocumento.udistrital.edu.co',
          Competencias: this.compleform.value.competencias,
          CodigoAbreviacion: this.basicform.value.abreviacion_proyecto,
          Activo: true,
          Oferta: this.checkofrece,
          UnidadTiempoId: this.opcionSeleccionadoUnidad['Id'],
          AnoActoAdministrativoId: this.actoform.value.ano_acto,
          DependenciaId: this.opcionSeleccionadoEspacioFisico['Id'],
          FacultadId: this.opcionSeleccionadoFacultad['Id'],
          AreaConocimientoId: this.opcionSeleccionadoArea['Id'],
          NucleoBaseId: this.opcionSeleccionadoNucleo['Id'],
          MetodologiaId: this.metodologia,
          NivelFormacionId: this.nivel_formacion,
          AnoActoAdministrativo: this.actoform.value.ano_acto,
          ProyectoPadreId: this.proyecto_padre_id,
        }

        this.calculateEndDate(this.fecha_creacion, this.resoluform.value.ano_vigencia, this.resoluform.value.mes_vigencia, 0)
        this.registro_califacado_acreditacion = {
          Id: 0,
          AnoActoAdministrativoId: this.resoluform.value.ano_resolucion,
          NumeroActoAdministrativo: Number(this.resoluform.value.resolucion),
          FechaCreacionActoAdministrativo: moment(this.fecha_creacion).format('YYYY-MM-DDTHH:mm') + ':00',
          VigenciaActoAdministrativo: 'Meses:' + this.resoluform.value.mes_vigencia + 'Años:' + this.resoluform.value.ano_vigencia,
          VencimientoActoAdministrativo: this.fecha_vencimiento + '',
          EnlaceActo: 'Ejemploenalce.udistrital.edu.co',
          Activo: true,
          ProyectoAcademicoInstitucionId: this.proyecto_academico,
          TipoRegistroId: this.tipo_registro = {
            Id: 1,
          },
        }

        this.enfasis_proyecto = [];
        this.arr_enfasis_proyecto.forEach((enfasis:any) => {
          this.enfasis_proyecto.push({
            Activo: true,
            ProyectoAcademicoInstitucionId: this.proyecto_academico,
            EnfasisId: {
              Id: enfasis['Id'],
            },
          });
        });

        this.titulacion_proyecto_snies = {
          Id: 0,
          Nombre: this.compleform.value.titulacion_snies,
          Activo: true,
          TipoTitulacionId: this.tipo_titulacion = {
            Id: 1,
          },
          ProyectoAcademicoInstitucionId: this.proyecto_academico,
        }
        this.titulacion_proyecto_mujer = {
          Id: 0,
          Nombre: this.compleform.value.titulacion_mujer,
          Activo: true,
          TipoTitulacionId: this.tipo_titulacion = {
            Id: 3,
          },
          ProyectoAcademicoInstitucionId: this.proyecto_academico,
        }
        this.titulacion_proyecto_hombre = {
          Id: 0,
          Nombre: this.compleform.value.titulacion_hombre,
          Activo: true,
          TipoTitulacionId: this.tipo_titulacion = {
            Id: 2,
          },
          ProyectoAcademicoInstitucionId: this.proyecto_academico,
        }
        this.tipo_dependencia = {
          Id: 2,
        }
        this.dependencia_tipo_dependencia = {
          Id: 0,
          TipoDependenciaId: this.tipo_dependencia,
        }
        this.dependencia = {
          Id: 0,
          Nombre: this.basicform.value.nombre_proyecto,
          TelefonoDependencia: this.basicform.value.numero_proyecto,
          CorreoElectronico: this.basicform.value.correo_proyecto,
          DependenciaTipoDependencia: [this.dependencia_tipo_dependencia],
        }
        const tr_dependencia_padre_post: TrDependenciaPadre = {
          PadreId: {
            Id: this.opcionSeleccionadoFacultad['Id'],
            Nombre: '',
            TelefonoDependencia: '',
            CorreoElectronico: '',
            DependenciaTipoDependencia: [],
          },
          HijaId: this.dependencia,
        }
        this.proyecto_academicoPost = {
          ProyectoAcademicoInstitucion: this.proyecto_academico,
          Registro: [this.registro_califacado_acreditacion],
          Enfasis: this.enfasis_proyecto,
          Titulaciones: [this.titulacion_proyecto_snies, this.titulacion_proyecto_mujer, this.titulacion_proyecto_hombre],
          Oikos: tr_dependencia_padre_post,
          // Oikos: this.dependencia,
        }
        const opt: any = {
          title: this.translate.instant('GLOBAL.registrar'),
          text: this.translate.instant('proyecto.seguro_continuar_registrar_proyecto'),
          icon: 'warning',
          buttons: true,
          dangerMode: true,
          showCancelButton: true,
        };
        Swal.fire(opt)
          .then(async (willCreate) => {
            if (willCreate.value) {
              let content = Swal.getHtmlContainer()
              if (content) {
                const b: any = content.querySelector('b')
                if (b) {
                  b.textContent = 'Subiendo Documentos ...'
                }
              }
              await this.uploadFilesCreacionProyecto([this.fileResolucion, this.fileActoAdministrativo]);
              content = Swal.getHtmlContainer()
              if (content) {
                const b: any = content.querySelector('b')
                if (b) {
                  b.textContent = 'Almacenando información ...'
                }
              }

              this.registro_califacado_acreditacion.EnlaceActo = this.idDocumentoResolucion + '';
              this.proyecto_academico.EnlaceActoAdministrativo = this.idDocumentoAdministrativo + '';
              //AQUI SGA_MID_SERVICE MODIFICADO
              // this.sgamidService.post('proyecto_academico', this.proyecto_academicoPost)
              this.sgaProyectoCurricularMidService.post('proyecto-academico/', this.proyecto_academicoPost)
                .subscribe((res: any) => {
                  if (res.Type === 'error') {
                    Swal.fire({
                      icon: 'error',
                      title: res.Code,
                      text: this.translate.instant('ERROR.' + res.Code),
                      confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
                    });
                    this.snackBar.open(this.translate.instant('proyecto.proyecto_no_creado'), '', {duration: 3000,panelClass: ['error-snackbar']});

                    Swal.close();
                  } else {
                    Swal.close();
                    const opt1: any = {
                      title: this.translate.instant('proyecto.creado'),
                      text: this.translate.instant('proyecto.proyecto_creado'),
                      icon: 'success',
                      showCancelButton: true,
                    }; Swal.fire(opt1)
                      .then((willDelete) => {
                        if (willDelete.value) {
                          this.checkregistro = true;
                          this.openlist();
                        }
                      });
                  }
                }, (error: any) => {
                  Swal.close();
                });
            }
          });
      } else {
        const opt1: any = {
          title: this.translate.instant('GLOBAL.atencion'),
          text: this.translate.instant('proyecto.error_datos'),
          icon: 'warning',
          buttons: true,
          dangerMode: true,
          showCancelButton: true,
        }; Swal.fire(opt1)
          .then((willDelete) => {
            if (willDelete.value) {

            }
          });
      }
    } catch (err) {
      const opt2: any = {
        title: this.translate.instant('GLOBAL.error'),
        text: this.translate.instant('ERROR.error_subir_documento'),
        icon: 'warning',
        buttons: true,
        dangerMode: true,
        showCancelButton: true,
      }; Swal.fire(opt2)
    }
  }
}