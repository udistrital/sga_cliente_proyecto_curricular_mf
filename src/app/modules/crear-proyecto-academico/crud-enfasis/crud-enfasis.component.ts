import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Enfasis } from 'src/app/models/enfasis';
import { ProyectoAcademicoService } from 'src/app/services/proyecto_academico.service';
import { FORM_ENFASIS } from './form-enfasis';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-crud-enfasis',
  templateUrl: './crud-enfasis.component.html',
  styleUrls: ['./crud-enfasis.component.scss']
})
export class CrudEnfasisComponent implements OnInit {

  enfasis_id!: number;

  @Input('enfasis_id')
  set name(enfasis_id: number) {
    this.enfasis_id = enfasis_id;
    this.loadEnfasis();
  }

  @Output() eventChange = new EventEmitter();

  info_enfasis!: Enfasis;
  formEnfasis: any;
  regEnfasis: any;
  clean!: boolean;

  constructor(
    private translate: TranslateService,
    private proyectoAcademicoService: ProyectoAcademicoService,
    private snackBar: MatSnackBar,
    ) {
    this.formEnfasis = FORM_ENFASIS;
    this.construirForm();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.construirForm();
    });
   }

  construirForm() {
    this.formEnfasis.titulo = this.translate.instant('enfasis.enfasis');
    this.formEnfasis.btn = this.translate.instant('GLOBAL.guardar');
    for (let i = 0; i < this.formEnfasis.campos.length; i++) {
      this.formEnfasis.campos[i].label = this.translate.instant('GLOBAL.' + this.formEnfasis.campos[i].label_i18n);
      this.formEnfasis.campos[i].placeholder = this.translate.instant('GLOBAL.placeholder_' + this.formEnfasis.campos[i].label_i18n);
    }
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  getIndexForm(nombre: String): number {
    for (let index = 0; index < this.formEnfasis.campos.length; index++) {
      const element = this.formEnfasis.campos[index];
      if (element.nombre === nombre) {
        return index
      }
    }
    return 0;
  }


  public loadEnfasis(): void {
    if (this.enfasis_id !== undefined && this.enfasis_id !== 0) {
      this.proyectoAcademicoService.get('enfasis/?query=id:' + this.enfasis_id)
        .subscribe((res: any) => {
          if (res.Type !== 'error') {
            this.info_enfasis = <Enfasis>res[0];
          } else {
            this.snackBar.open(this.translate.instant('GLOBAL.error'), '', {duration: 3000,panelClass: ['error-snackbar']});
          }
        }, () => {
          this.snackBar.open(this.translate.instant('GLOBAL.error'), '', {duration: 3000,panelClass: ['error-snackbar']});
        });
    } else  {
      this.clean = !this.clean;
    }
  }

  updateEnfasis(enfasis: any): void {

    const opt: any = {
      title: this.translate.instant('GLOBAL.actualizar'),
      text: this.translate.instant('enfasis.seguro_continuar_actualizar_enfasis'),
      icon: 'warning',
      
      showCancelButton: true,
    };
    Swal.fire(opt)
    .then((willDelete) => {
      if (willDelete.value) {
        this.info_enfasis = <Enfasis>enfasis;
        this.proyectoAcademicoService.put('enfasis', this.info_enfasis)
          .subscribe((res: any) => {
            if (res.Type !== 'error') {
              this.loadEnfasis();
              this.eventChange.emit(true);
              this.snackBar.open(this.translate.instant('enfasis.enfasis_actualizado'), '', {duration: 3000,panelClass: ['info-snackbar']});
            } else {
              this.snackBar.open(this.translate.instant('enfasis.enfasis_no_actualizado'), '', {duration: 3000,panelClass: ['error-snackbar']});
            }
          }, () => {
            this.snackBar.open(this.translate.instant('enfasis.enfasis_no_actualizado'), '', {duration: 3000,panelClass: ['error-snackbar']});
          });
      }
    });
  }

  createEnfasis(enfasis: any): void {
    const opt: any = {
      title: this.translate.instant('GLOBAL.registrar'),
      text: this.translate.instant('enfasis.seguro_continuar_registrar_enfasis'),
      icon: 'warning',
      
      showCancelButton: true,
    };
  
    Swal.fire(opt)
      .then((willDelete) => {
        if (willDelete.value) {
          this.info_enfasis = <Enfasis>enfasis;
          this.proyectoAcademicoService.post('enfasis', this.info_enfasis)
            .subscribe((res: any) => {
              if (res.Type !== 'error') {
                this.info_enfasis = <Enfasis><unknown>res;
                this.eventChange.emit(true);
                this.snackBar.open(this.translate.instant('enfasis.enfasis_creado'), '', {duration: 3000, panelClass: ['info-snackbar']});
              } else {
                this.snackBar.open(this.translate.instant('enfasis.enfasis_no_creado'), '', {duration: 3000, panelClass: ['error-snackbar']});
              }
            }, () => {
              this.snackBar.open(this.translate.instant('enfasis.enfasis_no_creado'), '', {duration: 3000, panelClass: ['error-snackbar']});
            });
        }
      });
  }
  

  ngOnInit() {
    this.loadEnfasis();
  }

  validarForm(event:any) {
    if (event.valid) {
      if (this.info_enfasis === undefined) {
        this.createEnfasis(event.data.Enfasis);
      } else {
        this.updateEnfasis(event.data.Enfasis);
      }
    }
  }
}
