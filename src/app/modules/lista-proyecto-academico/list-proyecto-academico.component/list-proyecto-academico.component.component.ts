import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ProyectoAcademicoInstitucion } from 'src/app/models/proyecto_academico_institucion';
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

  idproyecto: any;
  coordinador: any = null;
  existe_registro_alta_calidad: boolean = false;

  listaDatos: any[] = [];

  constructor(
    private translate: TranslateService,
    private proyectoacademicoService: ProyectoAcademicoService,
    private proyectoCurricularService: ProyectoCurricularService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
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
    this.proyectoCurricularService.getProyectosAcademicos().subscribe(
      (res: ProyectoAcademico[]) => {
        this.dataSource = new MatTableDataSource(res);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, 1000);
      },

      (error) => {
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

  openDialogConsulta(id: number, proyectoConsultaData: any): void {
    const dialogRef = this.dialog.open(ConsultaProyectoAcademicoComponent, {
      width: '1000px',
      height: '750px',
      data: {
        codigointerno: proyectoConsultaData.codigo,
        codigosnies: proyectoConsultaData.codigosnies,
        nombre: proyectoConsultaData.nombre,
        facultad: proyectoConsultaData.facultad,
        nivel: proyectoConsultaData.nivel,
        metodologia: proyectoConsultaData.metodologia,
        abreviacion: proyectoConsultaData.abreviacion,
        correo: proyectoConsultaData.correo,
        numerocreditos: proyectoConsultaData.numerocreditos,
        duracion: proyectoConsultaData.duracion,
        tipoduracion: proyectoConsultaData.tipo_duracion,
        ciclos: proyectoConsultaData.ciclos,
        ofrece: proyectoConsultaData.oferta,
        enfasis: proyectoConsultaData.enfasis,
        Id: id,
        id_documento_acto: proyectoConsultaData.id_documento_acto,
        proyecto_padre_id: proyectoConsultaData.proyecto_padre_id,
        iddependencia: proyectoConsultaData.iddependencia,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openDialogModificar(id: number, proyectoData: any): void {
    this.idproyecto = id;
    const dialogRef = this.dialog.open(ModificarProyectoAcademicoComponent, {
      width: '1000px',
      height: '750px',
      data: {
        codigointerno: proyectoData.codigo,
        codigosnies: proyectoData.codigosnies,
        nombre: proyectoData.nombre,
        facultad: proyectoData.facultad,
        nivel: proyectoData.nivel,
        metodologia: proyectoData.metodologia,
        abreviacion: proyectoData.abreviacion,
        correo: proyectoData.correo,
        numerocreditos: proyectoData.numerocreditos,
        duracion: proyectoData.duracion,
        tipoduracion: proyectoData.tipo_duracion,
        ciclos: proyectoData.ciclos,
        ofrece: proyectoData.oferta,
        enfasis: proyectoData.enfasis,
        idfacultad: proyectoData.idfacultad,
        idnivel: proyectoData.idnivel,
        idmetodo: proyectoData.idmetodo,
        idunidad: proyectoData.idunidad,
        oferta_check: proyectoData.oferta_check,
        ciclos_check: proyectoData.ciclos_check,
        titulacion_snies: proyectoData.titulacion_snies,
        titulacion_mujer: proyectoData.titulacion_mujer,
        titulacion_hombre: proyectoData.titulacion_hombre,
        competencias: proyectoData.competencias,
        idarea: proyectoData.idarea,
        idnucleo: proyectoData.idnucleo,
        resolucion_acreditacion: proyectoData.resolucion_acreditacion,
        resolucion_acreditacion_ano: proyectoData.resolucion_acreditacion_ano,
        fecha_creacion_registro: proyectoData.fecha_creacion_resolucion,
        vigencia_meses: proyectoData.vigencia_resolucion_meses,
        vigencia_anos: proyectoData.vigencia_resolucion_anos,
        idproyecto: id, // No hay necesidad de cambiar esto
        numero_acto: proyectoData.numero_acto,
        ano_acto: proyectoData.ano_acto,
        Id: id, // No hay necesidad de cambiar esto
        proyectoJson: proyectoData.proyectoJson,
        fechainiciocoordinador: proyectoData.fecha_inicio_coordinador,
        idcoordinador: proyectoData.id_coordinador,
        tieneregistroaltacalidad: proyectoData.existe_registro_alta_calidad,
        resolucion_alta: proyectoData.resolucion_alta_calidad,
        resolucion_alta_ano: proyectoData.resolucion_alta_calidad_ano,
        vigencia_meses_alta:
          proyectoData.vigencia_resolucion_meses_alta_calidad,
        vigencia_ano_alta: proyectoData.vigencia_resolucion_anos_alta_calidad,
        fecha_creacion_registro_alta:
          proyectoData.fecha_creacion_resolucion_alta_calidad,
        id_documento_acto: proyectoData.id_documento_acto,
        id_documento_registor_calificado:
          proyectoData.id_documento_registor_calificado,
        id_documento_alta_calidad: proyectoData.id_documento_alta_calidad,
        id_documento_registro_coordinador:
          proyectoData.id_documento_registro_coordinador,
        proyecto_padre_id: proyectoData.proyecto_padre_id,
        iddependencia: proyectoData.iddependencia,
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
    this.proyectoCurricularService.getProyectosAcademicos().subscribe(
      (res: ProyectoAcademico[]) => {
        res.sort((a, b) => {
          const dateA = new Date(a.ProyectoAcademico.FechaModificacion);
          const dateB = new Date(b.ProyectoAcademico.FechaModificacion);
          return dateB.getTime() - dateA.getTime();
        });
        this.listaDatos = [...res];
        this.dataSource = new MatTableDataSource(res);

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, 1000);
        this.dataSource.filterPredicate = (data: any, filter: string) =>
          this.filterPredicate(data.ProyectoAcademico.Nombre, filter);
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('GLOBAL.error'),
          text: error.message || this.translate.instant('GLOBAL.error_message'),
          confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
        });
      }
    );
  }

  obteneridporid_consulta(id: number) {
    this.proyectoCurricularService.getProyectoAcademicoPorId(id).subscribe(
      (res: DetalleProyectoAcademico | null) => {
        if (res != null) {
          try {
            const proyectoConsultaData = {
              codigo: res.ProyectoAcademico.Codigo,
              codigosnies: parseInt(res.ProyectoAcademico.CodigoSnies),
              nombre: res.ProyectoAcademico.Nombre,
              facultad: res.NombreFacultad,
              nivel: res.ProyectoAcademico.NivelFormacionId.Nombre,
              metodologia: res.ProyectoAcademico.MetodologiaId.Nombre,
              abreviacion: res.ProyectoAcademico.CodigoAbreviacion,
              correo: res.ProyectoAcademico.CorreoElectronico,
              numerocreditos: res.ProyectoAcademico.NumeroCreditos,
              duracion: res.ProyectoAcademico.Duracion,
              iddependencia: res.ProyectoAcademico.DependenciaId,
              tipo_duracion: res.NombreUnidad,
              ciclos: res.CiclosLetra,
              oferta: res.OfertaLetra,
              enfasis: res.Enfasis,
              id_documento_acto:
                res.ProyectoAcademico.EnlaceActoAdministrativo[0],
              proyecto_padre_id: res.ProyectoAcademico.ProyectoPadreId,
            };
            this.openDialogConsulta(id, proyectoConsultaData);
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
      }
    );
  }

  async obteneridporid_modificar(id: number) {
    const opt1: any = {
      title: this.translate.instant('GLOBAL.atencion'),
      text: this.translate.instant('oferta.evento'),
      icon: 'warning',
      showCancelButton: true,
    };
    const coordinador = await this.consultacoordinador(id);

    console.log('coordinador', coordinador);
    this.proyectoCurricularService.getProyectoAcademicoPorId(id).subscribe(
      (res: DetalleProyectoAcademico | null) => {
        if (res == null) throw new Error('No se encontró el proyecto');
        try {
          console.log('res', res);
          const datosProyecto = {
            codigo: res.ProyectoAcademico.Codigo,
            codigosnies: parseInt(res.ProyectoAcademico.CodigoSnies),
            nombre: res.ProyectoAcademico.Nombre,
            facultad: res.NombreFacultad,
            nivel: res.ProyectoAcademico.NivelFormacionId.Nombre,
            metodologia: res.ProyectoAcademico.MetodologiaId.Nombre,
            abreviacion: res.ProyectoAcademico.CodigoAbreviacion,
            correo: res.ProyectoAcademico.CorreoElectronico,
            numerocreditos: res.ProyectoAcademico.NumeroCreditos,
            duracion: res.ProyectoAcademico.Duracion,
            tipo_duracion: res.NombreUnidad,
            ciclos: res.CiclosLetra,
            oferta: res.OfertaLetra,
            enfasis: res.Enfasis, // revisar enfasis
            idfacultad: res.ProyectoAcademico.FacultadId,
            idnivel: res.ProyectoAcademico.NivelFormacionId.Id,
            idmetodo: res.ProyectoAcademico.MetodologiaId.Id,
            idunidad: res.ProyectoAcademico.UnidadTiempoId,
            oferta_check: res.ProyectoAcademico.Oferta,
            ciclos_check: res.ProyectoAcademico.CiclosPropedeuticos,
            titulacion_snies: res.Titulaciones[0].Nombre,
            titulacion_mujer: res.Titulaciones[1].Nombre,
            titulacion_hombre: res.Titulaciones[2].Nombre,
            competencias: res.ProyectoAcademico.Competencias,
            idarea: res.ProyectoAcademico.AreaConocimientoId,
            idnucleo: res.ProyectoAcademico.NucleoBaseId,
            resolucion_acreditacion: res.Registro[0].NumeroActoAdministrativo,
            iddependencia: res.ProyectoAcademico.DependenciaId,
            resolucion_acreditacion_ano:
              res.Registro[0].AnoActoAdministrativoId,
            fecha_creacion_resolucion: new Date(
              res.Registro[0].FechaCreacionActoAdministrativo
            ),
            vigencia_resolucion_meses:
              res.Registro[0].VigenciaActoAdministrativo.substr(6, 1),
            vigencia_resolucion_anos:
              res.Registro[0].VigenciaActoAdministrativo.substr(12, 1),
            id_documento_registor_calificado: res.Registro[0].EnlaceActo,
            numero_acto: res.ProyectoAcademico.NumeroActoAdministrativo,
            ano_acto: res.ProyectoAcademico.AnoActoAdministrativo,
            existe_registro_alta_calidad: Boolean(res.TieneRegistroAltaCalidad),
            resolucion_alta_calidad: res.NumeroActoAdministrativoAltaCalidad,
            resolucion_alta_calidad_ano: res.AnoActoAdministrativoIdAltaCalidad,
            fecha_creacion_resolucion_alta_calidad: new Date(
              res.FechaCreacionActoAdministrativoAltaCalidad
            ),
            id_documento_alta_calidad: res.EnlaceActoAdministrativoAltaCalidad,
            id_documento_acto: res.ProyectoAcademico.EnlaceActoAdministrativo,
            vigencia_resolucion_meses_alta_calidad:
              Boolean(res.TieneRegistroAltaCalidad) === true
                ? res.VigenciaActoAdministrativoAltaCalidad.substr(6, 1)
                : '',
            vigencia_resolucion_anos_alta_calidad:
              Boolean(res.TieneRegistroAltaCalidad) === true
                ? res.VigenciaActoAdministrativoAltaCalidad.substr(12, 1)
                : '',
            proyectoJson: res.ProyectoAcademico,
          };

          const proyectoModificarData = { ...datosProyecto, ...coordinador };

          this.openDialogModificar(id, proyectoModificarData);
        } catch (error) {
          console.info(error);
        }
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
      }, 600);
    });
  }

  highlight(row: any): void {
    this.idproyecto = row.data.ProyectoAcademico.Id;
  }

  async consultacoordinador(id: number): Promise<any> {
    try {
      const res = await this.proyectoacademicoService
        .get(
          `proyecto_academico_rol_tercero_dependencia/?query=ProyectoAcademicoInstitucionId.Id:${id}`
        )
        .toPromise();

      if (res !== null && res.Type !== 'error') {
        const coordinador = res.find((uni: any) => uni.Activo === true);
        if (coordinador) {
          return {
            id_coordinador: coordinador.TerceroId,
            fecha_inicio_coordinador: coordinador.FechaInicio,
            id_documento_registro_coordinador:
              coordinador.ResolucionAsignacionId,
          };
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
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

  private handleResponseInhabilitar(
    res: ResponseAPI<any>,
    translationKey: any
  ) {
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
