import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { BodyOutputType, Toast, ToasterConfig, ToasterService } from 'angular2-toaster';
import { ListEnfasisService } from 'src/app/services/list_enfasis.service';
import { ProyectoAcademicoService } from 'src/app/services/proyecto_academico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-enfasis',
  templateUrl: './list-enfasis.component.html',
  styleUrls: ['./list-enfasis.component.scss']
})
export class ListEnfasisComponent implements OnInit {

  uid!: number;
  cambiotab: boolean = false;
  config!: ToasterConfig;
  settings: any;

  //source: LocalDataSource = new LocalDataSource();
  displayedColumns = ['acciones', 'nombre', 'descripcion', 'codigo_abreviacion', 'activo', 'numero_orden'];

  dataSource!: MatTableDataSource<any>;

  constructor(private translate: TranslateService, private proyectoAcademicoService: ProyectoAcademicoService,
    private dialogRef: MatDialogRef<ListEnfasisComponent>,
    private listEnfasisService: ListEnfasisService,
    private toasterService: ToasterService) {
    this.loadData();
    this.cargarCampos();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.cargarCampos();
    });
  }

  @Input() asDialog!: boolean;
  dismissDialog() {
    this.dialogRef.close();
  }

  cargarCampos() {
    this.settings = {
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
        createButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true,
      },
      mode: 'external',
      columns: {
        // Id: {
        //   title: this.translate.instant('GLOBAL.id'),
        //   // type: 'number;',
        //   valuePrepareFunction: (value) => {
        //     return value;
        //   },
        // },
        Nombre: {
          title: this.translate.instant('GLOBAL.nombre'),
          // type: 'string;',
          valuePrepareFunction: (value: any) => {
            return value;
          },
        },
        Descripcion: {
          title: this.translate.instant('GLOBAL.descripcion'),
          // type: 'string;',
          valuePrepareFunction: (value: any) => {
            return value;
          },
        },
        CodigoAbreviacion: {
          title: this.translate.instant('GLOBAL.codigo_abreviacion'),
          // type: 'string;',
          valuePrepareFunction: (value: any) => {
            return value;
          },
        },
        Activo: {
          title: this.translate.instant('GLOBAL.activo'),
          // type: 'string;',
          valuePrepareFunction: (value: any) => {
            return value;
          },
        },
        NumeroOrden: {
          title: this.translate.instant('GLOBAL.numero_orden'),
          // type: 'string;',
          valuePrepareFunction: (value: any) => {
            return value;
          },
        },
      },
    };
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  loadData(): void {
    this.proyectoAcademicoService.get('enfasis/?limit=0')
      .subscribe((res: any) => {
        if (res.Type !== 'error') {
          const data = <Array<any>>res;
          console.log(data)
          if (this.asDialog) {
            // service
            this.listEnfasisService.sendListEnfasis(res);
          }
          //this.source.load(data);
          this.dataSource = new MatTableDataSource(data);
        } else {
          this.showToast('error', this.translate.instant('GLOBAL.error'), this.translate.instant('ERROR.general'));
        }
      }, () => {
        this.showToast('error', this.translate.instant('GLOBAL.error'), this.translate.instant('ERROR.general'));
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
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    };
    Swal.fire(opt)
      .then((willDelete) => {

        if (willDelete.value) {
          this.proyectoAcademicoService.delete('enfasis/', event)
            .subscribe((res: any) => {
              if (res.Type !== 'error') {
                this.loadData();
                this.showToast('info', this.translate.instant('GLOBAL.eliminar'), this.translate.instant('enfasis.enfasis_eliminado'));
              } else {
                this.showToast('error', this.translate.instant('GLOBAL.error'), this.translate.instant('enfasis.enfasis_no_eliminado'));
              }
            }, () => {
              this.showToast('error', this.translate.instant('GLOBAL.error'), this.translate.instant('enfasis.enfasis_no_eliminado'));
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
    // console.log("afssaf");
  }

  private showToast(type: string, title: string, body: string) {
    this.config = new ToasterConfig({
      // 'toast-top-full-width', 'toast-bottom-full-width', 'toast-top-left', 'toast-top-center'
      positionClass: 'toast-top-center',
      timeout: 5000,  // ms
      newestOnTop: true,
      tapToDismiss: false, // hide on click
      preventDuplicates: true,
      animation: 'slideDown', // 'fade', 'flyLeft', 'flyRight', 'slideDown', 'slideUp'
      limit: 5,
    });
    const toast: Toast = {
      type: 'info', // 'default', 'info', 'success', 'warning', 'error'
      title: title,
      body: body,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.toasterService.popAsync(toast);
  }

}
