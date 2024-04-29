import { Injectable } from '@angular/core';
import { SgaProyectoCurricularMidService } from './sga-proyecto-curricular-mid.service';
import { Observable, catchError, map } from 'rxjs';
import { ResponseAPI } from '../models/api/response-api.models';
import {
  DetalleProyectoAcademico,
  Proyecto,
  ProyectoAcademico,
} from '../models/api/sga_proyecto_curricular_mid/proyecto_curricular.models';
import * as moment from 'moment';
import { RowProyecto } from '../models/proyecto_academico/proyecto_academico.models';

@Injectable({
  providedIn: 'root',
})
export class ProyectoCurricularService {
  constructor(
    private sgaProyectoCurricularMidService: SgaProyectoCurricularMidService
  ) {}

  getProyectosAcademicos() {
    return this.sgaProyectoCurricularMidService.get('proyecto-academico/').pipe(
      map((response: ResponseAPI<ProyectoAcademico[]>) => {
        if (!response.success) throw new Error(response.message);
        if (response.success && response.data) {
          return response.data.map((proyectoAcademico: ProyectoAcademico) => {
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
        throw new Error(
          error.message || 'Error al obtener proyectos academicos'
        );
      })
    );
  }

  getProyectoAcademicoPorId(id: number) {
    return this.sgaProyectoCurricularMidService
      .get(`proyecto-academico/${id}/`)
      .pipe(
        map((response: ResponseAPI<DetalleProyectoAcademico[]>) => {
          if (!response.success) throw new Error(response.message);
          if (response.success && response.data) {
            const proyectoAcademico: DetalleProyectoAcademico = response.data[0];
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

  cambiarHabilidadProyecto(proyecto: Proyecto): Observable<any> {
    proyecto.Activo = !proyecto.Activo;
    proyecto.Oferta = !proyecto.Oferta;
    return this.sgaProyectoCurricularMidService.put(`/proyecto-academico/${proyecto.Id}/inhabilitar`, proyecto)
  }
  
}