export interface RowProyecto {
    Activo?:                   boolean;
    AnoActoAdministrativo?:    string;
    AreaConocimientoId?:       number;
    CiclosPropedeuticos?:      boolean;
    Codigo?:                   string;
    CodigoAbreviacion?:        string;
    CodigoSnies?:              string;
    Competencias?:             string;
    CorreoElectronico?:        string;
    DependenciaId?:            number;
    Duracion?:                 number;
    EnlaceActoAdministrativo?: string;
    FacultadId?:               number;
    FechaCreacion?:            string;
    FechaModificacion?:        string;
    Id?:                       number;
    MetodologiaId?:            ID;
    ModalidadId?:              string;
    NivelFormacionId?:         ID;
    Nombre?:                   string;
    NucleoBaseId?:             number;
    NumeroActoAdministrativo?: number;
    NumeroCreditos?:           number;
    Oferta?:                   boolean;
    ProyectoPadreId?:          string;
    UnidadTiempoId?:           number;
}

export interface ID {
    Activo?:                boolean;
    CodigoAbreviacion?:     string;
    Descripcion?:           string;
    FechaCreacion?:         string;
    FechaModificacion?:     string;
    Id?:                    number;
    Nombre?:                string;
    NumeroOrden?:           number;
    NivelFormacionPadreId?: string;
}
