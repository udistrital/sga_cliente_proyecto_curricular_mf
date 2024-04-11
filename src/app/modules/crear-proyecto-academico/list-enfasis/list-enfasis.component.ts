import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ListEnfasisService } from 'src/app/services/list_enfasis.service';
import { ProyectoAcademicoService } from 'src/app/services/proyecto_academico.service';
// @ts-ignore
import Swal from 'sweetalert2/dist/sweetalert2';

@Component({
  selector: 'app-list-enfasis',
  templateUrl: './list-enfasis.component.html',
  styleUrls: ['./list-enfasis.component.scss']
})
export class ListEnfasisComponent implements OnInit {

  uid!: number;
  cambiotab: boolean = false;
  settings: any;

  displayedColumns = ['acciones', 'nombre', 'descripcion', 'codigo_abreviacion', 'activo', 'numero_orden'];

  dataSource!: MatTableDataSource<any>;

  constructor(private translate: TranslateService, private proyectoAcademicoService: ProyectoAcademicoService,
    private dialogRef: MatDialogRef<ListEnfasisComponent>,
    private listEnfasisService: ListEnfasisService,
    private snackBar: MatSnackBar) {
    this.loadData();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
  }

  @Input() asDialog!: boolean;
  dismissDialog() {
    this.dialogRef.close();
  }


  useLanguage(language: string) {
    this.translate.use(language);
  }

  loadData(): void {
    this.proyectoAcademicoService.get('enfasis/?limit=0')
      .subscribe((res: any) => {
        if (res.Type !== 'error') {
          const data = <Array<any>>res;
          if (this.asDialog) {
            // service
            this.listEnfasisService.sendListEnfasis(res);
          }
          this.dataSource = new MatTableDataSource(data);
        } else {
          this.snackBar.open(this.translate.instant('GLOBAL.error'), '', {duration: 3000,panelClass: ['error-snackbar']});
        }
      }, () => {
        this.snackBar.open(this.translate.instant('GLOBAL.error'), '', {duration: 3000,panelClass: ['error-snackbar']});
      });
  }

  ngOnInit() {
  }

  onEdit(event: any): void {
    this.uid = event.Id;
    this.activetab();
  }

  onCreate(): void {
    this.uid = 0;
    this.activetab();
  }

  onDelete(event: any): void {
    const opt: any = {
      title: this.translate.instant('GLOBAL.eliminar'),
      text: this.translate.instant('enfasis.seguro_continuar_eliminar_enfasis'),
      icon: 'warning',
      
      showCancelButton: true,
    };
    Swal.fire(opt)
      .then((willDelete: any) => {

        if (willDelete.value) {
          this.proyectoAcademicoService.delete('enfasis/', event)
            .subscribe((res: any) => {
              if (res.Type !== 'error') {
                this.loadData();
                this.snackBar.open(this.translate.instant('enfasis.enfasis_eliminado'), '', {duration: 3000,panelClass: ['info-snackbar']});
              } else {
                this.snackBar.open(this.translate.instant('enfasis.enfasis_no_eliminado'), '', {duration: 3000,panelClass: ['error-snackbar']});
              }
            }, () => {
              this.snackBar.open(this.translate.instant('enfasis.enfasis_no_eliminado'), '', {duration: 3000,panelClass: ['error-snackbar']});
            });
        }
      });
  }

  activetab(): void {
    this.cambiotab = !this.cambiotab;
  }

  selectTab(event: any): void {
    if (event.tabTitle === this.translate.instant('GLOBAL.lista')) {
      this.cambiotab = false;
    } else {
      this.cambiotab = true;
    }
  }

  onChange(event: any) {
    if (event) {
      this.loadData();
      this.cambiotab = !this.cambiotab;
    }
  }


  itemselec(event: any): void {
  }
}
