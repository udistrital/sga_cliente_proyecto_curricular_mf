import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment-timezone';
import * as momentTimezone from 'moment-timezone';
import { Coordinador } from 'src/app/models/coordinador';
import { Enfasis } from 'src/app/models/enfasis';
import { InformacionBasicaPut } from 'src/app/models/informacion_basica_put';
import { InstitucionEnfasis } from 'src/app/models/institucion_enfasis';
import { Metodologia } from 'src/app/models/metodologia';
import { NivelFormacion } from 'src/app/models/nivel_formacion';
import { Dependencia } from 'src/app/models/oikos/dependencia';
import { DependenciaTipoDependencia } from 'src/app/models/oikos/dependencia_tipo_dependencia';
import { TipoDependencia } from 'src/app/models/oikos/tipo_dependencia';
import { ProyectoAcademicoInstitucion } from 'src/app/models/proyecto_academico_institucion';
import { ProyectoAcademicoPost } from 'src/app/models/proyecto_academico_post';
import { RegistroCalificadoAcreditacion } from 'src/app/models/registro_calificado_acreditacion';
import { RegistroPut } from 'src/app/models/registro_put';
import { Tercero } from 'src/app/models/terceros/tercero';
import { Vinculacion } from 'src/app/models/terceros/vinculacion';
import { TipoRegistro } from 'src/app/models/tipo_registro';
import { TipoTitulacion } from 'src/app/models/tipo_titulacion';
import { Titulacion } from 'src/app/models/titulacion';
import { CoreService } from 'src/app/services/core.service';
import { OikosService } from 'src/app/services/oikos.service';
import { ProyectoAcademicoService } from 'src/app/services/proyecto_academico.service';
import { SgaMidService } from 'src/app/services/sga_mid.service';
import { TercerosService } from 'src/app/services/terceros.service';
import { NewNuxeoService } from 'src/app/services/new_nuxeo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-proyecto-academico',
  templateUrl: './modificar-proyecto-academico.component.html',
  styleUrls: ['./modificar-proyecto-academico.component.scss']
})
export class ModificarProyectoAcademicoComponent {
  settings: any;
  basicform: any;
  resoluform: any;
  resolualtaform: any;
  actoform: any;
  compleform: any;
  coordinador: any;
  facultad = [];
  espacio= [];
  area = [];
  opcionSeleccionadoFacultad: any;
  opcionSeleccionadoEspacio: any;
  opcionSeleccionadoUnidad: any;
  opcionSeleccionadoArea: any;
  opcionSeleccionadoNucleo: any;
  opcionSeleccionadoEnfasis: any;
  opcionSeleccionadoNivel: any;
  opcionSeleccionadoMeto: any;
  checkenfasis: boolean = false;
  checkciclos: boolean = false;
  checkalta: boolean = false;
  checkofrece: boolean = false;
  nucleo = [];
  unidad = [];
  enfasis = [];
  nivel = [];
  metodo = [];
  fecha_creacion_calificado: Date;
  fecha_creacion_alta!: Date | null;
  fecha_inicio_coordinador!: Date;
  fecha_creacion_cordin!: Date | null ;
  fecha_vencimiento!: string;
  fecha_vencimiento_alta!: string;
  fecha_vigencia!: string;
  check_alta_calidad!: boolean;
  fecha_calculada_vencimiento!: string;
  fecha_vencimiento_mostrar!: string;
  fecha_creacion!: Date;
  proyecto_academicoPost: ProyectoAcademicoPost = new ProyectoAcademicoPost;
  informacion_basicaPut: InformacionBasicaPut = new InformacionBasicaPut;
  registro_put: RegistroPut = new RegistroPut;
  proyecto_academico: ProyectoAcademicoInstitucion = new ProyectoAcademicoInstitucion;
  tipo_titulacion: TipoTitulacion = new TipoTitulacion;
  metodologia: Metodologia = new Metodologia;
  nivel_formacion: NivelFormacion = new NivelFormacion;
  registro_califacado_acreditacion: RegistroCalificadoAcreditacion = new RegistroCalificadoAcreditacion;
  registro_califacado_alta_calidad: RegistroCalificadoAcreditacion = new RegistroCalificadoAcreditacion;
  tipo_registro: TipoRegistro = new TipoRegistro;
  enfasis_proyecto: InstitucionEnfasis = new InstitucionEnfasis;
  coordinador_data: Coordinador = new Coordinador;
  coordinadorSeleccionado: Tercero = new Tercero;
  enfasis_basico: Enfasis = new Enfasis;
  titulacion_proyecto_snies: Titulacion = new Titulacion;
  titulacion_proyecto_mujer: Titulacion = new Titulacion;
  titulacion_proyecto_hombre: Titulacion = new Titulacion;
  tipo_dependencia: TipoDependencia = new TipoDependencia;
  dependencia_tipo_dependencia: DependenciaTipoDependencia = new DependenciaTipoDependencia;
  dependencia: Dependencia = new Dependencia;
  terceros: Array<Tercero> = [];
  vinculaciones!: Array<Vinculacion>;
  creandoAutor: boolean = true;
  dataSource!: MatTableDataSource<any>;

  CampoControl = new FormControl("", [Validators.required]);
  CampoControl_espacio = new FormControl("", [Validators.required]);
  Campo1Control = new FormControl("", [Validators.required]);
  Campo2Control = new FormControl("", [Validators.required]);
  Campo3Control = new FormControl("", [Validators.required]);
  Campo4Control = new FormControl("", [Validators.required]);
  Campo5Control = new FormControl("", [Validators.required]);
  Campo6Control = new FormControl("", [Validators.required]);
  Campo7Control = new FormControl("", [Validators.required]);
  Campo8Control = new FormControl("", [Validators.required]);
  Campo9Control = new FormControl("", [Validators.required]);
  Campo10Control = new FormControl("", [Validators.required]);
  Campo11Control = new FormControl("", [Validators.required, Validators.maxLength(4)]);
  Campo12Control = new FormControl("", [Validators.required]);
  Campo13Control = new FormControl("", [Validators.required, Validators.maxLength(4)]);
  Campo14Control = new FormControl("", [Validators.required]);
  Campo16Control = new FormControl("", [Validators.required]);
  Campo17Control = new FormControl("", [Validators.required, Validators.maxLength(4)]);
  Campo18Control = new FormControl("", [Validators.required]);
  Campo19Control = new FormControl("", [Validators.required]);
  Campo20Control = new FormControl("", [Validators.required]);
  Campo21Control = new FormControl("", [Validators.required]);
  Campo22Control = new FormControl("", [Validators.required, Validators.maxLength(2)]);
  Campo23Control = new FormControl("", [Validators.required, Validators.maxLength(1)]);
  CampoCorreoControl = new FormControl("", [Validators.required, Validators.email]);
  CampoCreditosControl = new FormControl("", [Validators.required, Validators.maxLength(4)]);
  Campo24Control = new FormControl("", [Validators.required, Validators.maxLength(4)]);
  Campo25Control = new FormControl("", [Validators.required, Validators.maxLength(4)]);
  Campo26Control = new FormControl("", [Validators.required]);
  Campo28Control = new FormControl("", [Validators.required, Validators.maxLength(1)]);
  Campo27Control = new FormControl("", [Validators.required, Validators.maxLength(2)]);
  Campo29Control = new FormControl("", [Validators.required]);
  Campo30Control = new FormControl("", [Validators.required]);

  selectFormControl = new FormControl("", Validators.required);
  @Output() eventChange = new EventEmitter();

  arr_enfasis_proyecto: any[] = [];
  settings_emphasys: any;

  fileActoAdministrativo: any;
  fileRegistroCalificado: any;
  fileRegistroAltaCalidad: any;
  fileResolucionCoordinador: any;
  displayedColumns: string[] = ['nombre', 'activo','acciones'];

  dpDayPickerConfig: any = {
    locale: "es",
    format: "YYYY-MM-DD HH:mm",
    showTwentyFourHours: false,
    showSeconds: false,
    returnedValueType: "String"
  };

  constructor(
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModificarProyectoAcademicoComponent>,
    private sanitization: DomSanitizer,
    private oikosService: OikosService,
    private terceroService: TercerosService,
    private coreService: CoreService,
    private proyectoacademicoService: ProyectoAcademicoService,
    private sgamidService: SgaMidService,
    private routerService: Router,
    private newNuxeoService: NewNuxeoService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.dpDayPickerConfig = {
      locale: "es",
      format: "YYYY-MM-DD HH:mm",
      showTwentyFourHours: false,
      showSeconds: false,
      returnedValueType: "String"
    };
    this.basicform = this.formBuilder.group({
      codigo_interno: ["", Validators.required],
      codigo_snies: ["", Validators.required],
      nombre_proyecto: ["", Validators.required],
      abreviacion_proyecto: [
        "",
        [Validators.required, Validators.maxLength(20)]
      ],
      correo_proyecto: ["", [Validators.required, Validators.email]],
      creditos_proyecto: [
        "",
        [
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")
        ]
      ],
      duracion_proyecto: [
        "",
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")
        ]
      ]
    });

    this.resoluform = formBuilder.group({
      resolucion: ["", Validators.required],
      ano_resolucion: ["", [Validators.required, Validators.maxLength(4)]],
      fecha_creacion: ["", Validators.required],
      mes_vigencia: ["", [Validators.required, Validators.maxLength(2)]],
      ano_vigencia: ["", [Validators.required, Validators.maxLength(1)]]
    });

    this.resolualtaform = formBuilder.group({
      resolucion: ["", Validators.required],
      ano_resolucion: ["", [Validators.required, Validators.maxLength(4)]],
      fecha_creacion: ["", Validators.required],
      mes_vigencia: ["", [Validators.required, Validators.maxLength(2)]],
      ano_vigencia: ["", [Validators.required, Validators.maxLength(1)]]
    });

    this.actoform = formBuilder.group({
      acto: ["", Validators.required],
      ano_acto: ["", [Validators.required, Validators.maxLength(4)]]
    });

    this.compleform = formBuilder.group({
      titulacion_snies: ["", Validators.required],
      titulacion_mujer: ["", Validators.required],
      titulacion_hombre: ["", Validators.required],
      competencias: ["", Validators.required]
    });

    this.coordinador = formBuilder.group({
      fecha_creacion_coordinador: ["", Validators.required]
    });

    this.loadfacultad();
    this.loadespacio();
    this.loadnivel();
    this.loadmetodologia();
    this.loadunidadtiempo();
    this.loadarea();
    this.loadnucleo();
    this.loadenfasis();
    this.loadterceros();
    this.loadfechacoordinador();
    this.loadfechaaltacalidad();
    this.checkofrece = Boolean(JSON.parse(this.data.oferta_check));
    this.checkciclos = Boolean(JSON.parse(this.data.ciclos_check));
    this.fecha_creacion_calificado = new Date(
      momentTimezone
        .tz(this.data.fecha_creacion_registro[0], "America/Bogota")
        .format("YYYY-MM-DDTHH:mm")
    );
    this.checkalta = Boolean(JSON.parse(this.data.tieneregistroaltacalidad));

    this.arr_enfasis_proyecto = this.data.enfasis;
    this.dataSource = new MatTableDataSource(data.enfasis);
  }

  loadfechaaltacalidad() {
    if (this.data.fecha_creacion_registro_alta[0] == null) {
      this.fecha_creacion_alta = null;
    } else {
      this.fecha_creacion_alta = new Date(
        momentTimezone
          .tz(this.data.fecha_creacion_registro_alta[0], "America/Bogota")
          .format("YYYY-MM-DD HH:mm")
      );
    }
  }

  loadfechacoordinador() {
    if (this.data.fechainiciocoordinador == null) {
      this.fecha_creacion_cordin = null;
    } else {
      this.fecha_creacion_cordin = new Date(
        momentTimezone
          .tz(this.data.fechainiciocoordinador, "America/Bogota")
          .format("YYYY-MM-DD HH:mm")
      );
    }
  }

  cleanURL(oldURL: string): SafeResourceUrl {
    return this.sanitization.bypassSecurityTrustUrl(oldURL);
  }

  onInputActoAdministrativo(event:any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type === "application/pdf") {
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

  onInputRegistroCalificado(event:any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type === "application/pdf") {
        file.urlTemp = URL.createObjectURL(event.srcElement.files[0]);
        file.url = this.cleanURL(file.urlTemp);
        file.IdDocumento = 9;
        file.file = event.target.files[0];
        this.fileRegistroCalificado = file;
      } else {
        this.snackBar.open(this.translate.instant('ERROR.formato_documento_pdf'), '', {duration: 3000,panelClass: ['error-snackbar']});
      }
    }
  }

  onInputRegistroAltaCalidad(event:any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type === "application/pdf") {
        file.urlTemp = URL.createObjectURL(event.srcElement.files[0]);
        file.url = this.cleanURL(file.urlTemp);
        file.IdDocumento = 9;
        file.file = event.target.files[0];
        this.fileRegistroAltaCalidad = file;
      } else {
        this.snackBar.open(this.translate.instant('ERROR.formato_documento_pdf'), '', {duration: 3000,panelClass: ['error-snackbar']});
      }
    }
  }

  downloadFile(id_documento: any) {
    const filesToGet = [
      {
        Id: id_documento,
        key: id_documento
      }
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
            icon: "error",
            title: error.status + "",
            text: this.translate.instant("ERROR." + error.status),
            confirmButtonText: this.translate.instant("GLOBAL.aceptar")
          });
        }
      );
  }

  loadenfasis() {
    this.proyectoacademicoService.get("enfasis").subscribe(
      res => {
        const r = <any>res;
        if (res !== null && r.Type !== "error") {
          this.enfasis = <any>res;
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

  onCreateEmphasys(event: any) {
    const emphasys = event.value;
    if (
      !this.arr_enfasis_proyecto.find(
        (enfasis: any) => emphasys.Id === enfasis.EnfasisId.Id
      ) &&
      emphasys.Id
    ) {
      const enfasis_temporal: any = {};
      enfasis_temporal.Activo = true;
      enfasis_temporal.EnfasisId = emphasys;
      enfasis_temporal.ProyectoAcademicoInstitucionId = this.data.proyectoJson;
      enfasis_temporal.esNuevo = true;
      enfasis_temporal.FechaCreacion = new Date(
        momentTimezone.tz("America/Bogota").format("YYYY-MM-DDTHH:mm")
      );;
      enfasis_temporal.FechaModificacion = new Date(
        momentTimezone.tz("America/Bogota").format("YYYY-MM-DDTHH:mm")
      );;
      this.arr_enfasis_proyecto.push(enfasis_temporal);
      this.dataSource = new MatTableDataSource(this.arr_enfasis_proyecto);
    } else {
      Swal.fire({
        icon: "error",
        title: "ERROR",
        text: this.translate.instant("enfasis.error_enfasis_ya_existe"),
        confirmButtonText: this.translate.instant("GLOBAL.aceptar")
      });
    }
    const matSelect: MatSelect = event.source;
    matSelect.writeValue(null);
  }

  onDeleteEmphasys(event: any) {
    const findInArray = (value: any, array: string | any[], attr: string) => {
      for (let i = 0; i < array.length; i += 1) {
        if (array[i]["EnfasisId"][attr] === value) {
          return i;
        }
      }
      return -1;
    };
    const to_delete = this.arr_enfasis_proyecto[
      findInArray(event.EnfasisId.Id, this.arr_enfasis_proyecto, "Id")
    ];
    if (to_delete.esNuevo) {
      this.arr_enfasis_proyecto.splice(
        findInArray(event.EnfasisId.Id, this.arr_enfasis_proyecto, "Id"),
        1
      );
    } else {
      to_delete.Activo = !to_delete.Activo;
    }
    this.dataSource = new MatTableDataSource(this.arr_enfasis_proyecto);
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }
  onclick(): void {
    this.dialogRef.close();
  }

  cloneProject(project: any): void {
    this.routerService.navigateByUrl(
      `crear/${project.Id}`
    );
    this.dialogRef.close();
  }

  ngOnInit() { }

  loadterceros(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.terceroService
        .get("vinculacion?query=TipoVinculacionId:292&limit=0")
        .subscribe(
          (          res: Vinculacion[]) => {
            if (Object.keys(res[0]).length > 0) {
              // Extracción de tercero desde vinculación
              this.vinculaciones = <Array<Vinculacion>>res;
              this.vinculaciones.forEach((vinculacion: Vinculacion) => {
                this.terceros.push(vinculacion.TerceroPrincipalId);
              });

              this.terceros.forEach((tercero: Tercero) => {
                if (tercero.Id === Number(this.data.idcoordinador)) {
                  this.coordinadorSeleccionado = tercero;
                }
              });
              resolve(true);
            } else {
              this.terceros = [];
              reject({ status: 404 });
            }
          },
          (error: HttpErrorResponse) => {
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
      .add(years, "year")
      .add(months, "month")
      .add(days, "day")
      .format("YYYY-MM-DDTHH:mm:ss");
    this.fecha_vencimiento = convertDate;
    return new Date(convertDate);
  }

  calculateEndDateAlta(
    date: Date,
    years: number,
    months: number,
    days: number
  ): Date {
    const convertDate = moment(date)
      .add(years, "year")
      .add(months, "month")
      .add(days, "day")
      .format("YYYY-MM-DDTHH:mm:ss");
    this.fecha_vencimiento_alta = convertDate;
    return new Date(convertDate);
  }

  loadfacultad() {
    this.oikosService
      .get("dependencia_tipo_dependencia/?query=TipoDependenciaId:2")
      .subscribe(
        (res: any) => {
          const r = <any>res;
          if (res !== null && r.Type !== "error") {
            this.facultad = res.map((data: any) => data.DependenciaId);
            this.facultad.forEach((fac: any) => {
              if (fac.Id === Number(this.data.idfacultad)) {
                this.opcionSeleccionadoFacultad = fac;
              }
              console.log(this.opcionSeleccionadoFacultad)
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

  loadespacio() {
    this.oikosService
      .get("dependencia_tipo_dependencia/?query=TipoDependenciaId:"+this.data.Id+"&limit=0")
      .subscribe(
        (res: any) => {
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

  loadnivel() {
    this.proyectoacademicoService.get("nivel_formacion").subscribe(
      res => {
        const r = <any>res;
        if (res !== null && r.Type !== "error") {
          this.nivel = <any>res;
          this.nivel.forEach((niv: any) => {
            if (niv.Id === Number(this.data.idnivel)) {
              this.opcionSeleccionadoNivel = niv;
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

  loadmetodologia() {
    this.proyectoacademicoService.get("metodologia").subscribe(
      res => {
        const r = <any>res;
        if (res !== null && r.Type !== "error") {
          this.metodo = <any>res;
          this.metodo.forEach((met: any) => {
            if (met.Id === Number(this.data.idmetodo)) {
              this.opcionSeleccionadoMeto = met;
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

  loadunidadtiempo() {
    this.coreService.get("unidad_tiempo").subscribe(
      (      res: null) => {
        const r = <any>res;
        if (res !== null && r.Type !== "error") {
          this.unidad = <any>res;
          this.unidad.forEach((uni: any) => {
            if (uni.Id === Number(this.data.idunidad)) {
              this.opcionSeleccionadoUnidad = uni;
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

  loadarea() {
    this.coreService.get("area_conocimiento").subscribe(
      (      res: null) => {
        const r = <any>res;
        if (res !== null && r.Type !== "error") {
          this.area = <any>res;
          this.area.forEach((are: any) => {
            if (are.Id === Number(this.data.idarea)) {
              this.opcionSeleccionadoArea = are;
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

  loadnucleo() {
    this.coreService.get("nucleo_basico_conocimiento").subscribe(
      (      res: null) => {
        const r = <any>res;
        if (res !== null && r.Type !== "error") {
          this.nucleo = <any>res;
          this.nucleo.forEach((nuc: any) => {
            if (nuc.Id === Number(this.data.idnucleo)) {
              this.opcionSeleccionadoNucleo = nuc;
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

  uploadFilesModificacionProyecto(files: any[]) {
    return new Promise((resolve, reject) => {
      files.forEach((file: { Id: any; nombre: string; IdDocumento: string; key: string; }) => {
        (file.Id = file.nombre),
          (file.nombre =
            "soporte_" +
            file.IdDocumento +
            "_modificacion_proyecto_curricular_" +
            this.basicform.value.codigo_snies +
            "_" +
            this.basicform.value.nombre_proyecto);
        file.key = "soporte_" + file.IdDocumento;
      });
      this.newNuxeoService.uploadFiles(files).subscribe(
        (responseNux: any[]) => {
          if (Object.keys(responseNux).length === files.length) {
            files.forEach((file: { nombre: any; }) => {
              // Se restringe carga a un archivo
              let f = responseNux.find((res) => res.res.Nombre == file.nombre)
              resolve(f.res.Id);
            });
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  putinformacionbasica() {

    if (this.compleform.valid && this.basicform.valid) {
      this.metodologia = {
        Id: this.opcionSeleccionadoMeto["Id"]
      };
      this.nivel_formacion = <NivelFormacion>{
        Id: this.opcionSeleccionadoNivel["Id"]
      };
      this.proyecto_academico = {
        Id: Number(this.data.Id),
        Codigo: String(this.basicform.value.codigo_interno),
        Nombre: String(this.basicform.value.nombre_proyecto),
        CodigoSnies: String(this.basicform.value.codigo_snies),
        Duracion: Number(this.basicform.value.duracion_proyecto),
        NumeroCreditos: Number(this.basicform.value.creditos_proyecto),
        CorreoElectronico: String(this.basicform.value.correo_proyecto),
        CiclosPropedeuticos: this.checkciclos,
        NumeroActoAdministrativo: Number(this.actoform.value.acto),
        // EnlaceActoAdministrativo: 'Pruebalinkdocumento.udistrital.edu.co',
        EnlaceActoAdministrativo: this.data.id_documento_acto,
        Competencias: String(this.compleform.value.competencias),
        CodigoAbreviacion: String(this.basicform.value.abreviacion_proyecto),
        Activo: true,
        Oferta: this.checkofrece,
        UnidadTiempoId: this.opcionSeleccionadoUnidad["Id"],
        AnoActoAdministrativoId: String(this.actoform.value.ano_acto),
        FacultadId: this.opcionSeleccionadoFacultad["Id"],
        DependenciaId: this.opcionSeleccionadoEspacio["Id"],
        AreaConocimientoId: this.opcionSeleccionadoArea["Id"],
        NucleoBaseId: this.opcionSeleccionadoNucleo["Id"],
        MetodologiaId: this.metodologia,
        NivelFormacionId: this.nivel_formacion,
        AnoActoAdministrativo: String(this.actoform.value.ano_acto),
        ProyectoPadreId: this.data.proyecto_padre_id
      };

      this.titulacion_proyecto_snies = {
        Id: 0,
        Nombre: String(this.compleform.value.titulacion_snies),
        Activo: true,
        TipoTitulacionId: this.tipo_titulacion = {
          Id: 1
        },
        ProyectoAcademicoInstitucionId: this.proyecto_academico
      };

      this.titulacion_proyecto_mujer = {
        Id: 0,
        Nombre: String(this.compleform.value.titulacion_mujer),
        Activo: true,
        TipoTitulacionId: this.tipo_titulacion = {
          Id: 3
        },
        ProyectoAcademicoInstitucionId: this.proyecto_academico
      };

      this.titulacion_proyecto_hombre = {
        Id: 0,
        Nombre: String(this.compleform.value.titulacion_hombre),
        Activo: true,
        TipoTitulacionId: this.tipo_titulacion = {
          Id: 2
        },
        ProyectoAcademicoInstitucionId: this.proyecto_academico
      };

      const informacion_basicaPut = {
        ProyectoAcademicoInstitucion: this.proyecto_academico,
        Titulaciones: [
          this.titulacion_proyecto_snies,
          this.titulacion_proyecto_mujer,
          this.titulacion_proyecto_hombre
        ],
        Enfasis: this.arr_enfasis_proyecto
      };

      const opt: any = {
        title: this.translate.instant("GLOBAL.actualizar"),
        text: this.translate.instant(
          "editarproyecto.seguro_continuar_actualizar_proyecto"
        ),
        icon: "warning",
        buttons: true,
        dangerMode: true,
        showCancelButton: true
      };

      Swal.fire(opt).then(async willCreate => {
        if (willCreate.value) {
          // Si se actualiza el acto administrativo
          if (this.fileActoAdministrativo) {
            const idFileActoAdministratico = await this.uploadFilesModificacionProyecto(
              [this.fileActoAdministrativo]
            );
            informacion_basicaPut.ProyectoAcademicoInstitucion.EnlaceActoAdministrativo =
              idFileActoAdministratico + "";
          }

          this.proyectoacademicoService
            .put(
              "tr_proyecto_academico/informacion_basica/" +
              Number(this.data.Id),
              informacion_basicaPut
            )
            .subscribe((res: any) => {
              if (res.Type === "error") {
                Swal.fire({
                  icon: "error",
                  title: res.Code,
                  text: this.translate.instant("ERROR." + res.Code),
                  confirmButtonText: this.translate.instant("GLOBAL.aceptar")
                });
                this.snackBar.open(this.translate.instant('editarproyecto.proyecto_no_actualizado'), '', {duration: 3000,panelClass: ['error-snackbar']});
              } else {
                this.arr_enfasis_proyecto.forEach((enfasis_temp: any) => {
                  enfasis_temp.esNuevo = false;
                });
                this.dialogRef.close();
                const opt1: any = {
                  title: this.translate.instant("editarproyecto.actualizado"),
                  text: this.translate.instant(
                    "editarproyecto.proyecto_actualizado"
                  ),
                  icon: "success",
                  buttons: true,
                  dangerMode: true,
                  showCancelButton: true
                };
                Swal.fire(opt1).then(willDelete => {
                  if (willDelete.value) {
                  }
                });
              }
            });
        }
      });
    } else {
      const opt1: any = {
        title: this.translate.instant("GLOBAL.atencion"),
        text: this.translate.instant("proyecto.error_datos"),
        icon: "warning",
        buttons: true,
        dangerMode: true,
        showCancelButton: true
      };
      Swal.fire(opt1).then(willDelete => {
        if (willDelete.value) {
        }
      });
    }
  }

  putinformacionregistro() {
    if (this.checkalta === true) {
      if (this.resolualtaform.valid) {
        this.metodologia = {
          Id: this.opcionSeleccionadoMeto["Id"]
        };
        this.nivel_formacion = <NivelFormacion>{
          Id: this.opcionSeleccionadoNivel["Id"]
        };
        this.proyecto_academico = {
          Id: Number(this.data.idproyecto),
          Codigo: String(this.basicform.value.codigo_interno),
          Nombre: String(this.basicform.value.nombre_proyecto),
          CodigoSnies: String(this.basicform.value.codigo_snies),
          Duracion: Number(this.basicform.value.duracion_proyecto),
          NumeroCreditos: Number(this.basicform.value.creditos_proyecto),
          CorreoElectronico: String(this.basicform.value.correo_proyecto),
          CiclosPropedeuticos: this.checkciclos,
          NumeroActoAdministrativo: Number(this.actoform.value.acto),
          // EnlaceActoAdministrativo: 'Pruebalinkdocumento.udistrital.edu.co',
          EnlaceActoAdministrativo: this.data.id_documento_acto,
          Competencias: String(this.compleform.value.competencias),
          CodigoAbreviacion: String(this.basicform.value.abreviacion_proyecto),
          Activo: true,
          Oferta: this.checkofrece,
          UnidadTiempoId: this.opcionSeleccionadoUnidad["Id"],
          AnoActoAdministrativoId: String(this.actoform.value.ano_acto),
          FacultadId: this.opcionSeleccionadoFacultad["Id"],
          DependenciaId: this.opcionSeleccionadoEspacio["Id"],
          AreaConocimientoId: this.opcionSeleccionadoArea["Id"],
          NucleoBaseId: this.opcionSeleccionadoNucleo["Id"],
          MetodologiaId: this.metodologia,
          NivelFormacionId: this.nivel_formacion,
          AnoActoAdministrativo: String(this.actoform.value.ano_acto),
          ProyectoPadreId: this.data.proyecto_padre_id
        };

        this.calculateEndDate(
          this.data.fecha_creacion_registro[0],
          this.resoluform.value.ano_vigencia,
          this.resoluform.value.mes_vigencia,
          0
        );

        this.registro_califacado_acreditacion = {
          Id: 0,
          AnoActoAdministrativoId: String(this.resoluform.value.ano_resolucion),
          NumeroActoAdministrativo: Number(this.resoluform.value.resolucion),
          // FechaCreacionActoAdministrativo: this.fecha_creacion_calificado + ':00Z',
          FechaCreacionActoAdministrativo:
            moment(this.fecha_creacion_calificado).format("YYYY-MM-DDTHH:mm") +
            ":00Z",
          VigenciaActoAdministrativo:
            "Meses:" +
            this.resoluform.value.mes_vigencia +
            "Años:" +
            this.resoluform.value.ano_vigencia,
          VencimientoActoAdministrativo: this.fecha_vencimiento + "Z",
          // EnlaceActo: 'Ejemploenalce.udistrital.edu.co',
          EnlaceActo: this.data.id_documento_registor_calificado,
          Activo: true,
          ProyectoAcademicoInstitucionId: this.proyecto_academico,
          TipoRegistroId: this.tipo_registro = {
            Id: 1
          }
        };

        if (this.fecha_creacion_alta !== null) {
          this.calculateEndDateAlta(
            this.fecha_creacion_alta,
            this.resolualtaform.value.ano_vigencia,
            this.resolualtaform.value.mes_vigencia,
            0
          )
        }

        this.registro_califacado_alta_calidad = {
          Id: 0,
          AnoActoAdministrativoId: String(
            this.resolualtaform.value.ano_resolucion
          ),
          NumeroActoAdministrativo: Number(
            this.resolualtaform.value.resolucion
          ),
          // FechaCreacionActoAdministrativo: this.fecha_creacion_alta + ':00Z',
          FechaCreacionActoAdministrativo:
            moment(this.fecha_creacion_alta).format("YYYY-MM-DDTHH:mm") +
            ":00Z",
          VigenciaActoAdministrativo:
            "Meses:" +
            this.resolualtaform.value.mes_vigencia +
            "Años:" +
            this.resolualtaform.value.ano_vigencia,
          VencimientoActoAdministrativo: this.fecha_vencimiento_alta + "Z",
          // EnlaceActo: 'Ejemploenalce.udistrital.edu.co',
          EnlaceActo: this.data.id_documento_alta_calidad,
          Activo: true,
          ProyectoAcademicoInstitucionId: this.proyecto_academico,
          TipoRegistroId: this.tipo_registro = {
            Id: 2
          }
        };

        const registro_put = {
          ProyectoAcademicoInstitucion: this.proyecto_academico,
          Registro: [
            this.registro_califacado_acreditacion,
            this.registro_califacado_alta_calidad
          ]
        };

        const opt: any = {
          title: this.translate.instant("GLOBAL.actualizar"),
          text: this.translate.instant(
            "editarproyecto.seguro_continuar_actualizar_proyecto"
          ),
          icon: "warning",
          buttons: true,
          dangerMode: true,
          showCancelButton: true
        };

        Swal.fire(opt).then(async willCreate => {
          if (willCreate.value) {
            if (this.fileRegistroCalificado) {
              const idFileRegistroCalificado = await this.uploadFilesModificacionProyecto(
                [this.fileRegistroCalificado]
              );
              registro_put.Registro[0].EnlaceActo =
                idFileRegistroCalificado + "";
            }
            if (this.fileRegistroAltaCalidad) {
              const idFileRegistroAlta = await this.uploadFilesModificacionProyecto(
                [this.fileRegistroAltaCalidad]
              );
              registro_put.Registro[1].EnlaceActo = idFileRegistroAlta + "";
            }
            this.proyectoacademicoService
              .put("tr_proyecto_academico/registro/" + Number(this.data.idproyecto), registro_put)
              .subscribe((res: any) => {
                if (res.Type === "error") {
                  Swal.fire({
                    icon: "error",
                    title: res.Code,
                    text: this.translate.instant("ERROR." + res.Code),
                    confirmButtonText: this.translate.instant("GLOBAL.aceptar")
                  });
                  this.snackBar.open(this.translate.instant('editarproyecto.proyecto_no_actualizado'), '', {duration: 3000,panelClass: ['error-snackbar']});
                } else {
                  this.dialogRef.close();
                  const opt1: any = {
                    title: this.translate.instant("editarproyecto.actualizado"),
                    text: this.translate.instant(
                      "editarproyecto.proyecto_actualizado"
                    ),
                    icon: "success",
                    buttons: true,
                    dangerMode: true,
                    showCancelButton: true
                  };
                  Swal.fire(opt1).then(willDelete => {
                    if (willDelete.value) {
                    }
                  });
                }
              });
          }
        });
      } else {
        const opt1: any = {
          title: this.translate.instant("GLOBAL.atencion"),
          text: this.translate.instant("proyecto.error_datos"),
          icon: "warning",
          buttons: true,
          dangerMode: true,
          showCancelButton: true
        };
        Swal.fire(opt1).then(willDelete => {
          if (willDelete.value) {
          }
        });
      }
    } else {
      if (this.resoluform.valid) {
        this.metodologia = {
          Id: this.opcionSeleccionadoMeto["Id"]
        };
        this.nivel_formacion = <NivelFormacion>{
          Id: this.opcionSeleccionadoNivel["Id"]
        };
        this.proyecto_academico = {
          Id: Number(this.data.idproyecto),
          Codigo: String(this.basicform.value.codigo_interno),
          Nombre: String(this.basicform.value.nombre_proyecto),
          CodigoSnies: String(this.basicform.value.codigo_snies),
          Duracion: Number(this.basicform.value.duracion_proyecto),
          NumeroCreditos: Number(this.basicform.value.creditos_proyecto),
          CorreoElectronico: String(this.basicform.value.correo_proyecto),
          CiclosPropedeuticos: this.checkciclos,
          NumeroActoAdministrativo: Number(this.actoform.value.acto),
          // EnlaceActoAdministrativo: 'Pruebalinkdocumento.udistrital.edu.co',
          EnlaceActoAdministrativo: this.data.id_documento_acto,
          Competencias: String(this.compleform.value.competencias),
          CodigoAbreviacion: String(this.basicform.value.abreviacion_proyecto),
          Activo: true,
          Oferta: this.checkofrece,
          UnidadTiempoId: this.opcionSeleccionadoUnidad["Id"],
          AnoActoAdministrativoId: String(this.actoform.value.ano_acto),
          FacultadId: this.opcionSeleccionadoFacultad["Id"],
          DependenciaId: this.opcionSeleccionadoEspacio["Id"],
          AreaConocimientoId: this.opcionSeleccionadoArea["Id"],
          NucleoBaseId: this.opcionSeleccionadoNucleo["Id"],
          MetodologiaId: this.metodologia,
          NivelFormacionId: this.nivel_formacion,
          AnoActoAdministrativo: String(this.actoform.value.ano_acto),
          ProyectoPadreId: this.data.proyecto_padre_id
        };

        this.calculateEndDate(
          this.data.fecha_creacion_registro[0],
          this.resoluform.value.ano_vigencia,
          this.resoluform.value.mes_vigencia,
          0
        );

        this.registro_califacado_acreditacion = {
          Id: 0,
          AnoActoAdministrativoId: String(this.resoluform.value.ano_resolucion),
          NumeroActoAdministrativo: Number(this.resoluform.value.resolucion),
          // FechaCreacionActoAdministrativo: this.fecha_creacion_calificado + ':00Z',
          FechaCreacionActoAdministrativo:
            moment(this.fecha_creacion_calificado).format("YYYY-MM-DDTHH:mm") +
            ":00Z",
          VigenciaActoAdministrativo:
            "Meses:" +
            this.resoluform.value.mes_vigencia +
            "Años:" +
            this.resoluform.value.ano_vigencia,
          VencimientoActoAdministrativo: this.fecha_vencimiento + "Z",
          EnlaceActo: "Ejemploenalce.udistrital.edu.co",
          Activo: true,
          ProyectoAcademicoInstitucionId: this.proyecto_academico,
          TipoRegistroId: this.tipo_registro = {
            Id: 1
          }
        };

        const registro_put = {
          ProyectoAcademicoInstitucion: this.proyecto_academico,
          Registro: [this.registro_califacado_acreditacion]
        };

        const opt: any = {
          title: this.translate.instant("GLOBAL.actualizar"),
          text: this.translate.instant(
            "editarproyecto.seguro_continuar_actualizar_proyecto"
          ),
          icon: "warning",
          buttons: true,
          dangerMode: true,
          showCancelButton: true
        };

        Swal.fire(opt).then(async willCreate => {
          if (willCreate.value) {
            if (this.fileRegistroCalificado) {
              const idFileRegistroCalificado = await this.uploadFilesModificacionProyecto(
                [this.fileRegistroCalificado]
              );
              registro_put.Registro[0].EnlaceActo =
                idFileRegistroCalificado + "";
            }
            this.proyectoacademicoService
              .put("tr_proyecto_academico/registro/" +
                Number(this.data.idproyecto),
                registro_put
              )
              .subscribe((res: any) => {
                if (res.Type === "error") {
                  Swal.fire({
                    icon: "error",
                    title: res.Code,
                    text: this.translate.instant("ERROR." + res.Code),
                    confirmButtonText: this.translate.instant("GLOBAL.aceptar")
                  });
                  this.snackBar.open(this.translate.instant('editarproyecto.proyecto_no_actualizado'), '', {duration: 3000,panelClass: ['error-snackbar']});
                } else {
                  this.dialogRef.close();
                  const opt1: any = {
                    title: this.translate.instant("editarproyecto.actualizado"),
                    text: this.translate.instant(
                      "editarproyecto.proyecto_actualizado"
                    ),
                    icon: "success",
                    buttons: true,
                    dangerMode: true,
                    showCancelButton: true
                  };
                  Swal.fire(opt1).then(willDelete => {
                    if (willDelete.value) {
                    }
                  });
                }
              });
          }
        });
      } else {
        const opt1: any = {
          title: this.translate.instant("GLOBAL.atencion"),
          text: this.translate.instant("proyecto.error_datos"),
          icon: "warning",
          buttons: true,
          dangerMode: true,
          showCancelButton: true
        };
        Swal.fire(opt1).then(willDelete => {
          if (willDelete.value) {
          }
        });
      }
    }
  }

  onInputResolucionCoordinador(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type === "application/pdf") {
        file.urlTemp = URL.createObjectURL(event.srcElement.files[0]);
        file.url = this.cleanURL(file.urlTemp);
        file.IdDocumento = 11;
        file.file = event.target.files[0];
        this.fileResolucionCoordinador = file;
      } else {
        this.snackBar.open(this.translate.instant('ERROR.formato_documento_pdf'), '', {duration: 3000,panelClass: ['error-snackbar']});
      }
    }
  }

  registrocoordinador() {
    if (this.coordinador.valid && this.fileResolucionCoordinador) {
      this.coordinador_data = {
        TerceroId: this.coordinadorSeleccionado["Id"],
        DependenciaId: 0,
        Activo: true,
        ResolucionAsignacionId: this.data.id_documento_registro_coordinador,
        // FechaInicio: this.coordinador.value.fecha_creacion_coordinador + ':00Z',
        FechaInicio:
          moment(this.coordinador.value.fecha_creacion_coordinador).format("YYYY-MM-DDTHH:mm") + ":00Z",
        ProyectoAcademicoInstitucionId: {
          Id: Number(this.data.idproyecto)
        }
      };
      const opt: any = {
        title: this.translate.instant("GLOBAL.asignar"),
        text: this.translate.instant("editarproyecto.seguro_continuar_asignar"),
        icon: "warning",
        buttons: true,
        dangerMode: true,
        showCancelButton: true
      };
      Swal.fire(opt).then(async willCreate => {
        if (willCreate.value) {
          if (this.fileResolucionCoordinador) {
            const idFileResolucionCoordinador = await this.uploadFilesModificacionProyecto(
              [this.fileResolucionCoordinador]
            );
            this.coordinador_data.ResolucionAsignacionId = Number(
              idFileResolucionCoordinador
            );
          }

          this.sgamidService.post("proyecto_academico/coordinador/", this.coordinador_data)
            .subscribe((res: any) => {
              if (res.Type === "error") {
                Swal.fire({
                  icon: "error",
                  title: res.Code,
                  text: this.translate.instant("ERROR." + res.Code),
                  confirmButtonText: this.translate.instant("GLOBAL.aceptar")
                });
                this.snackBar.open(this.translate.instant('editarproyecto.coordinador_no_asignado'), '', {duration: 3000,panelClass: ['error-snackbar']});
              } else {
                this.dialogRef.close();
                const opt1: any = {
                  title: this.translate.instant("editarproyecto.creado"),
                  text: this.translate.instant(
                    "editarproyecto.coordinador_asignado"
                  ),
                  icon: "succes",
                  buttons: true,
                  dangerMode: true,
                  showCancelButton: true
                };
                Swal.fire(opt1).then(willDelete => {
                  if (willDelete.value) {
                  }
                });
              }
            });
        }
      });
    } else {
      const opt1: any = {
        title: this.translate.instant("GLOBAL.atencion"),
        text: this.translate.instant("proyecto.error_datos"),
        icon: "warning",
        buttons: true,
        dangerMode: true,
        showCancelButton: true
      };
      Swal.fire(opt1).then(willDelete => {
        if (willDelete.value) {
        }
      });
    }
  }
}
