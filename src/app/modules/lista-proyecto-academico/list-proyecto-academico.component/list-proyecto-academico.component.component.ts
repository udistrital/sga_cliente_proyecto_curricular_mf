import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ProyectoAcademicoInstitucion } from 'src/app/models/proyecto_academico_institucion';
import { SgaMidService } from 'src/app/services/sga_mid.service';
import Swal from 'sweetalert2';
import { ConsultaProyectoAcademicoComponent } from '../consulta-proyecto-academico/consulta-proyecto-academico.component';
import { ModificarProyectoAcademicoComponent } from '../modificar-proyecto-academico/modificar-proyecto-academico.component';
import { ProyectoAcademicoService } from 'src/app/services/proyecto_academico.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProyectoCurricularService } from 'src/app/services/proyecto-curricular.service';
import {
  DetalleProyectoAcademico,
  Enfasi,
  Proyecto,
  ProyectoAcademico,
} from 'src/app/models/api/sga_proyecto_curricular_mid/proyecto_curricular.models';
import { RowProyecto } from 'src/app/models/proyecto_academico/proyecto_academico.models';
import { ResponseAPI } from 'src/app/models/api/response-api.models';

const TRANSLATIONS = {
  INHABILITAR: {
    TITLE: 'consultaproyecto.inhabilitar_proyecto',
    TEXT: 'consultaproyecto.seguro_continuar_inhabilitar_proyecto',
    OK: 'consultaproyecto.proyecto_inhabilitado',
    ERROR: 'consultaproyecto.proyecto_no_inhabilitado',
  },
  HABILITAR: {
    TITLE: 'consultaproyecto.habilitar_proyecto',
    TEXT: 'consultaproyecto.seguro_continuar_habilitar_proyecto',
    OK: 'consultaproyecto.proyecto_habilitado',
    ERROR: 'consultaproyecto.proyecto_no_habilitado',
  },
};

@Component({
  selector: 'app-list-proyecto-academico.component',
  templateUrl: './list-proyecto-academico.component.component.html',
  styleUrls: ['./list-proyecto-academico.component.component.scss'],
})
export class ListProyectoAcademicoComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'facultad',
    'nombre_proyecto',
    'nivel_proyecto',
    'codigo',
    'cod_snies',
    'activo',
    'vencimiento_registro',
    'vencimiento_alta_calidad',
    'acciones',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  settings: any;
  index: any;
  idproyecto: any;
  codigosnies!: Number;
  codigo!: string;
  facultad!: string | null;
  nombre!: String;
  nivel!: string;
  iddependencia!: number;
  metodologia!: string;
  abreviacion!: string;
  correo!: string;
  numerocreditos!: Number;
  duracion!: Number;
  tipo_duracion!: string;
  ciclos!: string;
  oferta!: string;
  enfasis!: Enfasi[];
  consulta: boolean = false;
  idfacultad!: Number;
  idnivel!: Number;
  idmetodo!: Number;
  idunidad!: Number;
  idarea!: Number;
  idnucleo!: Number;
  coordinador: any[] = [];
  oferta_check: boolean = false;
  ciclos_check: boolean = false;
  loading: boolean = false;
  titulacion_snies!: string;
  numero_acto!: string;
  ano_acto!: string;
  titulacion_mujer!: string;
  titulacion_hombre!: string;
  competencias!: string;
  resolucion_acreditacion!: string;
  resolucion_acreditacion_ano!: string;
  fecha_creacion_resolucion!: Date;
  resolucion_alta_calidad!: string | null;
  resolucion_alta_calidad_ano!: string | null;
  fecha_creacion_resolucion_alta_calidad!: Date | null;
  vigencia_resolucion_meses_alta_calidad!: string;
  vigencia_resolucion_anos_alta_calidad!: string;
  existe_registro_alta_calidad: boolean = false;
  fecha_inicio_coordinador!: Date;
  vigencia_resolucion_meses!: string;
  vigencia_resolucion_anos!: string;
  id_coordinador: any;
  proyectoJson: any;
  id_documento_acto!: string;
  id_documento_registor_calificado!: string;
  id_documento_alta_calidad!: string | null;
  id_documento_registro_coordinador!: number;
  proyecto_padre_id!: ProyectoAcademicoInstitucion | null;

  listaDatos: any[] = [];

  constructor(
    private translate: TranslateService,
    private proyectoacademicoService: ProyectoAcademicoService,
    private proyectoCurricularService: ProyectoCurricularService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.loading = true;
    this.loadproyectos();
    // this.loadData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadData(): void {
    this.loading = true;
    this.proyectoCurricularService.getProyectosAcademicos().subscribe(
      (res: ProyectoAcademico[]) => {
        this.dataSource = new MatTableDataSource(res);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, 1000);
        this.loading = false;
      },

      (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error,
        });
      }
    );
  }

  onAction(event: any) {
    this.highlight(event);
    switch (event.action) {
      case 'consulta':
        this.promesaid_consulta(event);
        break;
      case 'editar':
        this.promesaid_modificar(event);
        break;
      case 'inhabilitar':
        this.inhabilitarProyecto(event.data);
        break;
    }
  }

  openDialogConsulta(id: number): void {
    const dialogRef = this.dialog.open(ConsultaProyectoAcademicoComponent, {
      width: '1000px',
      height: '750px',
      data: {
        codigointerno: this.codigo,
        codigosnies: this.codigosnies,
        nombre: this.nombre,
        facultad: this.facultad,
        nivel: this.nivel,
        metodologia: this.metodologia,
        abreviacion: this.abreviacion,
        correo: this.correo,
        numerocreditos: this.numerocreditos,
        duracion: this.duracion,
        tipoduracion: this.tipo_duracion,
        ciclos: this.ciclos,
        ofrece: this.oferta,
        enfasis: this.enfasis,
        Id: id,
        id_documento_acto: this.id_documento_acto,
        proyecto_padre_id: this.proyecto_padre_id,
        iddependencia: this.iddependencia,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openDialogModificar(id: number): void {
    const dialogRef = this.dialog.open(ModificarProyectoAcademicoComponent, {
      width: '1000px',
      height: '750px',
      data: {
        codigointerno: this.codigo,
        codigosnies: this.codigosnies,
        nombre: this.nombre,
        facultad: this.facultad,
        nivel: this.nivel,
        metodologia: this.metodologia,
        abreviacion: this.abreviacion,
        correo: this.correo,
        numerocreditos: this.numerocreditos,
        duracion: this.duracion,
        tipoduracion: this.tipo_duracion,
        ciclos: this.ciclos,
        ofrece: this.oferta,
        enfasis: this.enfasis,
        idfacultad: this.idfacultad,
        idnivel: this.idnivel,
        idmetodo: this.idmetodo,
        idunidad: this.idunidad,
        oferta_check: this.oferta_check,
        ciclos_check: this.ciclos_check,
        titulacion_snies: this.titulacion_snies,
        titulacion_mujer: this.titulacion_mujer,
        titulacion_hombre: this.titulacion_hombre,
        competencias: this.competencias,
        idarea: this.idarea,
        idnucleo: this.idnucleo,
        resolucion_acreditacion: this.resolucion_acreditacion,
        resolucion_acreditacion_ano: this.resolucion_acreditacion_ano,
        fecha_creacion_registro: this.fecha_creacion_resolucion,
        vigencia_meses: this.vigencia_resolucion_meses,
        vigencia_anos: this.vigencia_resolucion_anos,
        idproyecto: this.idproyecto,
        numero_acto: this.numero_acto,
        ano_acto: this.ano_acto,
        Id: id,
        proyectoJson: this.proyectoJson,
        fechainiciocoordinador: this.fecha_inicio_coordinador,
        idcoordinador: this.id_coordinador,
        tieneregistroaltacalidad: this.existe_registro_alta_calidad,
        resolucion_alta: this.resolucion_alta_calidad,
        resolucion_alta_ano: this.resolucion_alta_calidad_ano,
        vigencia_meses_alta: this.vigencia_resolucion_meses_alta_calidad,
        vigencia_ano_alta: this.vigencia_resolucion_anos_alta_calidad,
        fecha_creacion_registro_alta:
          this.fecha_creacion_resolucion_alta_calidad,
        id_documento_acto: this.id_documento_acto,
        id_documento_registor_calificado: this.id_documento_registor_calificado,
        id_documento_alta_calidad: this.id_documento_alta_calidad,
        id_documento_registro_coordinador:
          this.id_documento_registro_coordinador,
        proyecto_padre_id: this.proyecto_padre_id,
        iddependencia: this.iddependencia,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  filterPredicate(data: string, filter: string): boolean {
    data = data.trim().toLowerCase();
    filter = filter.trim().toLowerCase();
    return data.indexOf(filter) >= 0;
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit() {}

  loadproyectos() {
    this.loading = true;
    this.proyectoCurricularService.getProyectosAcademicos().subscribe(
      (res: ProyectoAcademico[]) => {
        this.listaDatos = [...res];
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: any, filter: string) =>
          this.filterPredicate(data.ProyectoAcademico.Nombre, filter);
        this.dataSource.data.forEach(
          (data: any) => (data.proyecto = data.ProyectoAcademico.Nombre)
        );
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, 1000);
        this.loading = false;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('GLOBAL.error'),
          text: error.message || this.translate.instant('GLOBAL.error_message'),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
        this.loading = false;
      }
    );
  }

  obteneridporid_consulta(id: number) {
    this.proyectoCurricularService.getProyectoAcademicoPorId(id).subscribe(
      (res: DetalleProyectoAcademico | null) => {
        // console.log("CONSULTA",res);
        if (res != null) {
          try {
            this.codigo = res.ProyectoAcademico.Codigo;
            this.codigosnies = parseInt(res.ProyectoAcademico.CodigoSnies);
            this.nombre = res.ProyectoAcademico.Nombre;
            this.facultad = res.NombreFacultad;
            this.nivel = res.ProyectoAcademico.NivelFormacionId.Nombre;
            this.metodologia = res.ProyectoAcademico.MetodologiaId.Nombre;
            this.abreviacion = res.ProyectoAcademico.CodigoAbreviacion;
            this.correo = res.ProyectoAcademico.CorreoElectronico;
            this.numerocreditos = res.ProyectoAcademico.NumeroCreditos;
            this.duracion = res.ProyectoAcademico.NumeroCreditos;
            this.duracion = res.ProyectoAcademico.Duracion;
            this.iddependencia = res.ProyectoAcademico.DependenciaId;
            this.tipo_duracion = res.NombreUnidad;
            this.ciclos = res.CiclosLetra;
            this.oferta = res.OfertaLetra;
            this.enfasis = res.Enfasis;
            this.id_documento_acto =
              res.ProyectoAcademico.EnlaceActoAdministrativo[0];
            this.proyecto_padre_id = res.ProyectoAcademico.ProyectoPadreId;
            this.openDialogConsulta(id);
          } catch (error) {
            console.info(error);
          }
        } else {
          Swal.fire({
            title: this.translate.instant('GLOBAL.atencion'),
            text: this.translate.instant('oferta.evento'),
            icon: 'warning',
            showCancelButton: true,
          }).then((willDelete) => {
            if (willDelete.value) {
            }
          });
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('GLOBAL.error'),
          text: error.message || this.translate.instant('GLOBAL.error_message'),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
        this.loading = false;
      }
    );
  }

  obteneridporid_modificar(id: number) {
    const opt1: any = {
      title: this.translate.instant('GLOBAL.atencion'),
      text: this.translate.instant('oferta.evento'),
      icon: 'warning',
      showCancelButton: true,
    };
    this.proyectoCurricularService.getProyectoAcademicoPorId(id).subscribe(
      (res: DetalleProyectoAcademico | null) => {
        if (res == null) throw new Error('No se encontró el proyecto');
        try {
          this.codigo = res.ProyectoAcademico.Codigo;
          this.codigosnies = parseInt(res.ProyectoAcademico.CodigoSnies);
          this.nombre = res.ProyectoAcademico.Nombre;
          this.facultad = res.NombreFacultad;
          this.nivel = res.ProyectoAcademico.NivelFormacionId.Nombre;
          this.metodologia = res.ProyectoAcademico.MetodologiaId.Nombre;
          this.abreviacion = res.ProyectoAcademico.CodigoAbreviacion;
          this.correo = res.ProyectoAcademico.CorreoElectronico;
          this.numerocreditos = res.ProyectoAcademico.NumeroCreditos;
          this.duracion = res.ProyectoAcademico.Duracion;
          this.tipo_duracion = res.NombreUnidad;
          this.ciclos = res.CiclosLetra;
          this.oferta = res.OfertaLetra;
          this.enfasis = res.Enfasis; //revisar enfasis
          this.idfacultad = res.ProyectoAcademico.FacultadId;
          this.idnivel = res.ProyectoAcademico.NivelFormacionId.Id;
          this.idmetodo = res.ProyectoAcademico.MetodologiaId.Id;
          this.idunidad = res.ProyectoAcademico.UnidadTiempoId;
          this.oferta_check = res.ProyectoAcademico.Oferta;
          this.ciclos_check = res.ProyectoAcademico.CiclosPropedeuticos;
          this.titulacion_snies = res.Titulaciones[0].Nombre;
          this.titulacion_mujer = res.Titulaciones[1].Nombre;
          this.titulacion_hombre = res.Titulaciones[2].Nombre;
          this.competencias = res.ProyectoAcademico.Competencias;
          this.idarea = res.ProyectoAcademico.AreaConocimientoId;
          this.idnucleo = res.ProyectoAcademico.NucleoBaseId;
          this.resolucion_acreditacion =
            res.Registro[0].NumeroActoAdministrativo;
          this.iddependencia = res.ProyectoAcademico.DependenciaId;
          this.resolucion_acreditacion_ano =
            res.Registro[0].AnoActoAdministrativoId;
          this.fecha_creacion_resolucion = new Date(
            res.Registro[0].FechaCreacionActoAdministrativo
          );
          this.vigencia_resolucion_meses =
            res.Registro[0].VigenciaActoAdministrativo.substr(6, 1);
          this.vigencia_resolucion_anos =
            res.Registro[0].VigenciaActoAdministrativo.substr(12, 1);
          this.id_documento_registor_calificado = res.Registro[0].EnlaceActo;
          this.numero_acto = res.ProyectoAcademico.NumeroActoAdministrativo;
          this.ano_acto = res.ProyectoAcademico.AnoActoAdministrativo;
          this.existe_registro_alta_calidad = Boolean(
            res.TieneRegistroAltaCalidad
          );
          this.resolucion_alta_calidad =
            res.NumeroActoAdministrativoAltaCalidad;
          this.resolucion_alta_calidad_ano =
            res.AnoActoAdministrativoIdAltaCalidad;
          this.fecha_creacion_resolucion_alta_calidad = new Date(
            res.FechaCreacionActoAdministrativoAltaCalidad
          );
          this.id_documento_alta_calidad =
            res.EnlaceActoAdministrativoAltaCalidad;
          this.id_documento_acto =
            res.ProyectoAcademico.EnlaceActoAdministrativo;
          if (this.existe_registro_alta_calidad === true) {
            this.vigencia_resolucion_meses_alta_calidad =
              res.VigenciaActoAdministrativoAltaCalidad.substr(6, 1);
            this.vigencia_resolucion_anos_alta_calidad =
              res.VigenciaActoAdministrativoAltaCalidad.substr(12, 1);
          } else {
            this.vigencia_resolucion_meses_alta_calidad = '';
            this.vigencia_resolucion_anos_alta_calidad = '';
          }
          this.proyectoJson = res.ProyectoAcademico;
        } catch (error) {
          console.info(error);
        }
        this.openDialogModificar(id);
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: error.status + '',
          text: this.translate.instant('ERROR.' + error.status),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      }
    );
  }

  promesaid_consulta(id: number): Promise<{ id: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: id });
        this.obteneridporid_consulta(id);
      }, 600);
    });
  }

  promesaid_modificar(id: number): Promise<{ id: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: id });
        this.obteneridporid_modificar(id);
        this.consultacoordinador(id);
      }, 600);
    });
  }

  highlight(row: any): void {
    this.idproyecto = row.data.ProyectoAcademico.Id;
  }

  consultacoordinador(id: number) {
    console.log('CONSULTANDO COORDINADORS');
    const opt1: any = {
      title: this.translate.instant('GLOBAL.atencion'),
      text: this.translate.instant('oferta.evento'),
      icon: 'warning',

      showCancelButton: true,
    };
    this.proyectoacademicoService
      .get(
        'proyecto_academico_rol_tercero_dependencia/?query=ProyectoAcademicoInstitucionId.Id:' +
          id
      )
      .subscribe(
        (res: any) => {
          const r = <any>res;
          if (res !== null && r.Type !== 'error') {
            this.coordinador = <any>res;
            this.coordinador.forEach((uni: any) => {
              if (uni.Activo === true) {
                this.coordinador = uni;
              }
            });
            this.id_coordinador = this.coordinador[0]['TerceroId'];
            this.fecha_inicio_coordinador = this.coordinador[0]['FechaInicio'];
            this.id_documento_registro_coordinador =
              this.coordinador[0]['ResolucionAsignacionId'];
          } else {
            Swal.fire(opt1).then((willDelete) => {
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
        }
      );
  }

  inhabilitarProyecto(row: Proyecto): void {
    const translationKey = row.Oferta
      ? TRANSLATIONS.INHABILITAR
      : TRANSLATIONS.HABILITAR;
    const opt: any = {
      title: this.translate.instant(translationKey.TITLE),
      text: this.translate.instant(translationKey.TEXT),
      icon: row.Activo ? 'success' : 'error',
      showCancelButton: true,
    };

    Swal.fire(opt).then((willDelete) => {
      if (willDelete.value) {
        this.proyectoCurricularService.cambiarHabilidadProyecto(row).subscribe(
          (res: ResponseAPI<any>) => {
            this.handleResponseInhabilitar(res, translationKey);
          },
          () => {
            this.snackBar.open(
              this.translate.instant(translationKey.ERROR),
              '',
              {
                duration: 6000,
                panelClass: ['error-snackbar'],
              }
            );
          }
        );
      }
    });
  }

  private handleResponseInhabilitar(res: ResponseAPI<any>, translationKey: any) {
    if (res.success) {
      this.loadproyectos();
      this.snackBar.open(this.translate.instant(translationKey.OK), '', {
        duration: 6000,
        panelClass: ['info-snackbar'],
      });
    } else {
      this.snackBar.open(this.translate.instant(translationKey.ERROR), '', {
        duration: 6000,
        panelClass: ['error-snackbar'],
      });
    }
  }
}


