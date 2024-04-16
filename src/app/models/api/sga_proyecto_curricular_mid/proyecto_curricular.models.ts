import { ProyectoAcademicoInstitucion } from "../../proyecto_academico_institucion";

export interface ProyectoAcademico {
    FechaVenimientoAcreditacion: null | string;
    FechaVenimientoCalidad:      null | string;
    NombreFacultad:              string | null;
    OfertaLetra:                 OfertaLetra;
    ProyectoAcademico:           Proyecto;
    Registro:                    Registro[];
}

export interface DetalleProyectoAcademico {
    AnoActoAdministrativoIdAltaCalidad:         string;
    CiclosLetra:                                string;
    Enfasis:                                    Enfasi[];
    EnlaceActoAdministrativoAltaCalidad:        string;
    FechaCreacionActoAdministrativoAltaCalidad: string;
    FechaVenimientoAcreditacion:                string;
    FechaVenimientoCalidad:                     string;
    IdDependenciaFacultad:                      string;
    NombreFacultad:                             string;
    NombreUnidad:                               string;
    NumeroActoAdministrativoAltaCalidad:        string;
    OfertaLetra:                                string;
    ProyectoAcademico:                          Proyecto;
    Registro:                                   Registro[];
    TelefonoDependencia:                        string;
    TieneRegistroAltaCalidad:                   boolean;
    Titulaciones:                               MetodologiaID[];
    VigenciaActoAdministrativoAltaCalidad:      string;
}

export interface MetodologiaID {
    Activo:                          boolean;
    CodigoAbreviacion:               string;
    Descripcion:                     string;
    FechaCreacion:                   string;
    FechaModificacion:               string;
    Id:                              number;
    Nombre:                          string;
    NumeroOrden:                     number;
    NivelFormacionPadreId?:          string;
    ProyectoAcademicoInstitucionId?: ProyectoAcademico;
    TipoTitulacionId?:               MetodologiaID;
}

export interface Enfasi {
    Activo:                         boolean;
    EnfasisId:                      MetodologiaID;
    FechaCreacion:                  string;
    FechaModificacion:              string;
    Id:                             number;
    ProyectoAcademicoInstitucionId: ProyectoAcademico;
}

export enum OfertaLetra {
    No = "No",
    Si = "Si",
}

export interface Proyecto {
    Activo:                   boolean;
    AnoActoAdministrativo:    string;
    AreaConocimientoId:       number;
    CiclosPropedeuticos:      boolean;
    Codigo:                   string;
    CodigoAbreviacion:        string;
    CodigoSnies:              string;
    Competencias:             string;
    CorreoElectronico:        string;
    DependenciaId:            number;
    Duracion:                 number;
    EnlaceActoAdministrativo: string;
    FacultadId:               number;
    FechaCreacion:            string;
    FechaModificacion:        string;
    Id:                       number;
    MetodologiaId:            ID;
    ModalidadId:              null;
    NivelFormacionId:         ID;
    Nombre:                   string;
    NucleoBaseId:             number;
    NumeroActoAdministrativo: string;
    NumeroCreditos:           number;
    Oferta:                   boolean;
    ProyectoPadreId:          ProyectoAcademicoInstitucion | null;
    UnidadTiempoId:           number;
}

export interface ID {
    Activo:                 boolean;
    CodigoAbreviacion:      string;
    Descripcion:            string;
    FechaCreacion:          string;
    FechaModificacion:      string;
    Id:                     number;
    Nombre:                 string;
    NumeroOrden:            number;
    NivelFormacionPadreId?: ID | null;
}


export interface Registro {
    Activo:                          boolean;
    AnoActoAdministrativoId:         string;
    EnlaceActo:                      string;
    FechaCreacion:                   string;
    FechaCreacionActoAdministrativo: string;
    FechaModificacion:               string;
    Id:                              number;
    NumeroActoAdministrativo:        string;
    ProyectoAcademicoInstitucionId:  Proyecto;
    TipoRegistroId:                  ID;
    VencimientoActoAdministrativo:   string;
    VigenciaActoAdministrativo:      string;
}