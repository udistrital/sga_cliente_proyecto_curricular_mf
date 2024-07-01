import { Injectable } from '@angular/core';
import { SgaProyectoCurricularMidService } from './sga-proyecto-curricular-mid.service';
import { catchError, map } from 'rxjs';
import {
  DetalleProyectoAcademico,
  Proyecto,
  ProyectoAcademico,
} from '../models/api/sga_proyecto_curricular_mid/proyecto_curricular.models';
import * as moment from 'moment';
import { ApiResponse } from '../models/api-response.interface';
// @ts-ignore
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ProyectoCurricularService {
  constructor(
    private sgaProyectoCurricularMidService: SgaProyectoCurricularMidService,
    private translate: TranslateService
  ) {}

  getProyectosAcademicos() {
    return this.sgaProyectoCurricularMidService.get('proyecto-academico/').pipe(
      map((response: ApiResponse<ProyectoAcademico[]>) => {
        if (!response.Success) throw new Error(response.Message);
        if (response.Success && response.Data) {
          return response.Data.map((proyectoAcademico: ProyectoAcademico) => {
            if (proyectoAcademico.FechaVenimientoAcreditacion) {
              proyectoAcademico.FechaVenimientoAcreditacion = moment(
                proyectoAcademico.FechaVenimientoAcreditacion,
                'YYYY-MM-DD'
              ).format('DD-MM-YYYY');
            }
            if (proyectoAcademico.FechaVenimientoCalidad) {
              proyectoAcademico.FechaVenimientoCalidad = moment(
                proyectoAcademico.FechaVenimientoCalidad,
                'YYYY-MM-DD'
              ).format('DD-MM-YYYY');
            }
            return {
              ...proyectoAcademico,
              codigo: proyectoAcademico.ProyectoAcademico.Codigo,
              codigoSNIES: proyectoAcademico.ProyectoAcademico.CodigoSnies,
              NivelProyecto:
                proyectoAcademico.ProyectoAcademico.NivelFormacionId.Nombre,
              proyecto: proyectoAcademico.ProyectoAcademico.Nombre,
              Id: proyectoAcademico.ProyectoAcademico.Id,
            };
          });
        }
        return [];
      }),
      catchError((error) => {
        console.error('Error en el servicio de proyectos academicos', error);
        throw new Error(
          error.message || 'Error al obtener proyectos academicos'
        );
      })
    );
  }

  getProyectoAcademicoPorId(id: number) {
    return this.sgaProyectoCurricularMidService
      .get(`proyecto-academico/${id}`)
      .pipe(
        map((response: ApiResponse<DetalleProyectoAcademico[]>) => {
          if (!response.Success) throw new Error(response.Message);
          if (response.Success && response.Data) {
            const proyectoAcademico: DetalleProyectoAcademico =
              response.Data[0];
            return proyectoAcademico;
          }
          return null;
        }),
        catchError((error) => {
          throw new Error(
            error.message || 'Error al obtener proyecto academico'
          );
        })
      );
  }

  async cambiarHabilidadProyecto(proyecto: Proyecto): Promise<any> {
    proyecto.Activo = !proyecto.Activo;
    if (!proyecto.Activo) {
      proyecto.Oferta = false;
    } else {
      const seOfrece = await Swal.fire({
        title: this.translate.instant(
          'proyecto.confirmar_activacion_oferta_titulo'
        ),
        text: this.translate.instant(
          'proyecto.confirmar_activacion_oferta_texto'
        ),
        confirmButtonText: this.translate.instant('GLOBAL.si'),
        showCancelButton: true,
        cancelButtonText: this.translate.instant('GLOBAL.no'),
        showCloseButton: true,
      });
      if (seOfrece.isConfirmed) {
        proyecto.Oferta = true;
      }
    }
    return this.sgaProyectoCurricularMidService
      .put(`/proyecto-academico/${proyecto.Id}/inhabilitar`, proyecto)
      .toPromise();
  }
}
