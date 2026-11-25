import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
} from 'rxjs';
import { AnyService } from 'src/app/services/any.service';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'ngx-dinamicform',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  standalone: false,
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input('normalform') normalform: any;
  @Input('modeloData') modeloData: any;
  @Input('clean') clean!: boolean;
  @Output() result: EventEmitter<any> = new EventEmitter();
  @Output() resultAux: EventEmitter<any> = new EventEmitter();
  @Output() resultSmart: EventEmitter<any> = new EventEmitter();
  @Output() interlaced: EventEmitter<any> = new EventEmitter();
  @Output() percentage: EventEmitter<any> = new EventEmitter();
  data: any;
  searchTerm$ = new Subject<any>();
  @ViewChild(MatDatepicker, { static: true }) datepicker!: MatDatepicker<Date>;
  @ViewChildren('documento') fileInputs!: QueryList<ElementRef>;

  DocumentoInputVariable!: ElementRef;
  init!: boolean;

  constructor(
    private readonly sanitization: DomSanitizer,
    private readonly anyService: AnyService,
    private readonly matDialog: MatDialog,
  ) {
    this.data = {
      valid: true,
      confirm: true,
      data: {},
      percentage: 0,
      files: [],
    };

    this.searchTerm$
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        filter((data) => data.text.length > 3),
        switchMap(({ text, path, query, keyToFilter, field }) =>
          this.searchEntries(text, path, query, keyToFilter, field),
        ),
      )
      .subscribe((response: any) => {
        let opciones = [];
        if (response.queryOptions.hasOwnProperty('Data')) {
          opciones = response.queryOptions.Data;
        } else {
          opciones = response.queryOptions;
        }
        const fieldAutocomplete = this.normalform.campos.filter(
          (field: any) => field.nombre === response.options.field.nombre,
        );
        fieldAutocomplete[0].opciones = opciones;
        if (opciones.length == 1 && Object.keys(opciones[0]).length == 0) {
          let canEmit = fieldAutocomplete[0].entrelazado
            ? fieldAutocomplete[0].entrelazado
            : false;
          if (canEmit) {
            this.interlaced.emit({
              ...fieldAutocomplete[0],
              noOpciones: true,
              valorBuscado: response.keyToFilter,
            });
          }
        }
      });
  }

  displayWithFn(field: any) {
    return field ? field.Nombre : '';
  }

  setNewValue({ element, field }: any) {
    field.valor = element.option.value;
    this.validCampo(field);
  }

  searchEntries(
    text: any,
    path: any,
    query: any,
    keyToFilter: any,
    field: any,
  ) {
    const channelOptions = new BehaviorSubject<any>({ field: field });
    const options$ = channelOptions.asObservable();
    const queryOptions$ = this.anyService.get(
      path,
      query.replace(keyToFilter, text),
    );
    return combineLatest([options$, queryOptions$]).pipe(
      map(([options$, queryOptions$]) => ({
        options: options$,
        queryOptions: queryOptions$,
        keyToFilter: text,
      })),
    );
  }

  ngOnChanges(changes: any) {
    if (changes.normalform?.currentValue !== undefined) {
      this.normalform = changes.normalform.currentValue;
    }
    if (changes.modeloData?.currentValue !== undefined) {
      this.updateModeloData(changes.modeloData.currentValue);
    }
    if (changes.clean !== undefined && this.init) {
      this.clearForm();
      this.clean = false;
    }
  }

  private updateModeloData(modeloData: any): void {
    this.modeloData = modeloData;
    if (!this.normalform.campos) {
      return;
    }

    this.normalform.campos.forEach((element: any) => {
      if (
        !Object.prototype.hasOwnProperty.call(this.modeloData, element.nombre)
      ) {
        return;
      }

      const value = this.modeloData[element.nombre];
      if (value === null) {
        return;
      }

      this.updateFieldValue(element, value);
      this.validCampo(element);
    });
    this.setPercentage();
  }

  private updateFieldValue(element: any, value: any): void {
    switch (element.etiqueta) {
      case 'selectmultiple':
        element.valor = value.flatMap((selected: any) =>
          element.opciones.filter((option: any) => selected.Id === option.Id),
        );
        break;
      case 'select':
        if (
          Object.prototype.hasOwnProperty.call(element, 'opciones') &&
          element.opciones != undefined
        ) {
          element.opciones.forEach((option: any) => {
            if (option.Id === value.Id) {
              element.valor = option;
            }
          });
        }
        break;
      case 'mat-date':
        element.valor = new Date(value);
        break;
      case 'file':
        element.url = this.cleanURL(value);
        element.urlTemp = value;
        break;
      default:
        element.valor = value;
    }
  }

  ngAfterViewInit() {
    this.fileInputs.changes.subscribe((x) => {
      if (x.length) {
        this.DocumentoInputVariable = x.first;
      }
    });
  }

  // download(url:any, title:any, w:any, h:any, previewForm?:any, message?:any) {
  //   if (previewForm !== undefined) {
  //     switch (previewForm) {
  //       case "preview":
  //         this.preview(url, title, message);
  //         break;
  //       case "nopreview":
  //         this.nopreview(url, title);
  //         break;
  //       case "both":
  //         const spliturl = url.split('|');
  //         this.preview(spliturl[0], title, message);
  //         this.nopreview(spliturl[1], title);
  //         break;
  //       default:
  //         this.preview(url, title, message);
  //         break;
  //     }
  //   } else {
  //     this.preview(url, title, message);
  //   }
  // }

  // preview(url:any, title:any, message:any) {
  //   /* const left = (screen.width / 2) - (w / 2);
  //   const top = (screen.height / 2) - (h / 2);
  //   let prev = window.open(url, title, 'toolbar=no,' +
  //     'location=no, directories=no, status=no, menubar=no,' +
  //     'scrollbars=no, resizable=no, copyhistory=no, ' +
  //     'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
  //   prev.document.title = title; */
  //   const dialogDoc = new MatDialogConfig();
  //   dialogDoc.width = '80vw';
  //   dialogDoc.height = '90vh';
  //   dialogDoc.data = {url, title, message};
  //   this.matDialog.open(DialogPreviewFileComponent, dialogDoc);
  // }

  nopreview(url: any, title: any) {
    const download = document.createElement('a');
    download.href = url;
    download.download = title;
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
  }

  onChange(event: any, c: any) {
    if (c.valor !== undefined) {
      c.urlTemp = URL.createObjectURL(event.srcElement.files[0]);
      c.url = this.cleanURL(c.urlTemp);
      c.valor = event.srcElement.files[0];
      this.validCampo(c);
      c.File = event.srcElement.files[0];
    }
    // Tipo file
    if (c.valor === undefined && c.etiqueta === 'file') {
      c.urlTemp = URL.createObjectURL(event.srcElement.files[0]);
      c.url = this.cleanURL(c.urlTemp);
      c.valor = event.srcElement.files[0];
      this.validCampo(c);
      c.File = event.srcElement.files[0];
    }
  }

  onChange2(event: any, c: any) {
    if (event.srcElement.files.length > 0) {
      c.File = event.srcElement.files[0];
      c.urlTemp = URL.createObjectURL(event.srcElement.files[0]);
      c.url = this.cleanURL(c.urlTemp);
    } else {
      ((c.File = undefined), (c.urlTemp = undefined), (c.url = undefined));
    }
    this.validCampo(c);
  }

  cleanURL(oldURL: string): SafeResourceUrl {
    return this.sanitization.bypassSecurityTrustUrl(oldURL);
  }

  validlog1(event: any) {
    const camposLog1 = this.normalform.campos.filter(
      (campo: any) => campo.etiqueta === 'inputConfirmacion',
    );
    // if (camposLog1[0].valor> )
  }

  confirmacion(event: any) {
    this.checkConfirmacion();
    if (event.entrelazado) {
      this.interlaced.emit(event);
    }
  }

  checkConfirmacion() {
    let valido = true;

    const camposAValidar = this.normalform.campos.filter(
      (campo: any) => campo.etiqueta === 'inputConfirmacion',
    );
    let l = camposAValidar.length;

    if (l % 2 == 0) {
      for (let i = 0; i < l; i += 2) {
        if (!(camposAValidar[i].valor === camposAValidar[i + 1].valor)) {
          camposAValidar[i].clase = 'form-control form-control-danger';
          camposAValidar[i + 1].clase = 'form-control form-control-danger';
          camposAValidar[i].alerta = camposAValidar[i].mensajeIguales;
          camposAValidar[i + 1].alerta = camposAValidar[i + 1].mensajeIguales;
          valido = false;
        } else {
          camposAValidar[i].clase = 'form-control form-control-success';
          camposAValidar[i + 1].clase = 'form-control form-control-success';
          camposAValidar[i].alerta = '';
          camposAValidar[i + 1].alerta = '';
        }
      }
    } else {
      console.warn('Error, algún campo de confirmacion no tiene pareja');
    }

    return valido;
  }

  ngOnInit() {
    this.init = true;
    if (!this.normalform.tipo_formulario) {
      this.normalform.tipo_formulario = 'grid';
    }

    this.normalform.campos = this.normalform.campos.map((d: any) => {
      d.clase = 'form-control';
      if (d.relacion === undefined) {
        d.relacion = true;
      }
      if (d.valor === undefined || d.valor === null) {
        d.valor = '';
      }
      if (!d.deshabilitar) {
        d.deshabilitar = false;
      }
      if (d.etiqueta === 'fileRev') {
        d.File = undefined;
        d.urlTemp = undefined;
      }
      return d;
    });
  }

  onChangeDate(event: any, c: any) {
    c.valor = event.value;
  }

  validCampo(c: any, emit = true): boolean {
    if (c.etiqueta === 'fileRev' && !c.ocultar) {
      return this.validateRevisionFile(c);
    }
    if (c.etiqueta === 'file' && !!c.ocultar) {
      return true;
    }
    if (!this.validateRequiredValue(c, emit)) {
      return false;
    }
    if (!this.validateInputField(c)) {
      return false;
    }
    if (!this.validateChoice(c)) {
      return false;
    }
    if (!this.validateOptionalFile(c)) {
      return false;
    }
    this.emitInterlaced(c, emit);
    if (c.etiqueta === 'textarea') {
      return this.validateTextarea(c);
    }
    // if (!this.normalform.btn) {
    //   if (this.validForm().valid) {
    //     this.resultSmart.emit(this.validForm());
    //   }
    // }
    return this.setCampoSuccess(c);
  }

  private validateRevisionFile(c: any): boolean {
    const missingFile =
      c.File === undefined ||
      c.File === null ||
      c.File === '' ||
      c.urlTemp === undefined ||
      c.urlTemp === null ||
      c.urlTemp === '';
    if (c.requerido && !c.valor && missingFile) {
      return this.setCampoError(c, '** Debe llenar este campo');
    }

    if (c.File && c.tamanoMaximo && c.File.size > c.tamanoMaximo * 1024000) {
      return this.setCampoError(
        c,
        'El tamaño del archivo es superior a : ' + c.tamanoMaximo + 'MB. ',
      );
    }

    if (c.File && c.tipo && c.tipo.indexOf(c.File.type.split('/')[1]) === -1) {
      return this.setCampoError(
        c,
        'Solo se admiten los siguientes formatos: ' + c.formatos,
      );
    }

    return this.setCampoSuccess(c);
  }

  private isMissingCampoValue(c: any): boolean {
    const value = c.valor;
    const missingRequiredValue =
      c.requerido &&
      ((value === '' && c.etiqueta !== 'file') ||
        value === null ||
        value === undefined ||
        (JSON.stringify(value) === '{}' && c.etiqueta !== 'file') ||
        JSON.stringify(value) === '[]');
    const missingFileName =
      c.etiqueta === 'file' &&
      ((value?.name === undefined &&
        (c.urlTemp === undefined || c.urlTemp === '')) ||
        (value?.name === null && (c.urlTemp === null || c.urlTemp === '')));

    return missingRequiredValue || missingFileName;
  }

  private validateRequiredValue(c: any, emit: boolean): boolean {
    if (!this.isMissingCampoValue(c)) {
      return true;
    }
    if (c.entrelazado && emit) {
      this.interlaced.emit(c);
      return true;
    }
    return this.setCampoError(c, '** Debe llenar este campo');
  }

  private validateInputField(c: any): boolean {
    if (c.etiqueta !== 'input' && c.etiqueta !== 'inputConfirmacion') {
      return true;
    }
    if (c.tipo === 'number') {
      return this.validateNumber(c);
    }
    if (c.tipo === 'email') {
      return this.validateEmail(c);
    }
    return true;
  }

  private validateChoice(c: any): boolean {
    const invalidRadio = c.etiqueta === 'radio' && c.valor.Id === undefined;
    const invalidSelect = c.etiqueta === 'select' && c.valor == null;
    if (invalidRadio || invalidSelect) {
      return this.setCampoError(c, 'Seleccione el campo');
    }
    return true;
  }

  private validateNumber(c: any): boolean {
    c.valor = parseInt(c.valor, 10);
    if (c.valor < c.minimo) {
      return this.setCampoError(
        c,
        'El valor no puede ser menor que ' + c.minimo,
      );
    }
    if (c.valor > c.maximolog) {
      return this.setCampoError(
        c,
        'El valor no puede ser mayor que ' + c.maximolog,
      );
    }
    return true;
  }

  private validateEmail(c: any): boolean {
    const pattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!pattern.test(c.valor)) {
      return this.setCampoError(c, 'No es un correo válido');
    }
    return true;
  }

  private isVisibleFile(c: any): boolean {
    return (
      c.etiqueta === 'file' &&
      c.valor !== null &&
      c.valor !== undefined &&
      c.valor !== '' &&
      !c.ocultar
    );
  }

  private validateFile(c: any): boolean {
    if (c.valor.size > c.tamanoMaximo * 1024000) {
      return this.setCampoError(
        c,
        'El tamaño del archivo es superior a : ' + c.tamanoMaximo + 'MB. ',
      );
    }
    if (c.valor.type && c.formatos.indexOf(c.valor.type.split('/')[1]) === -1) {
      return this.setCampoError(
        c,
        'Solo se admiten los siguientes formatos: ' + c.formatos,
      );
    }
    return true;
  }

  private validateOptionalFile(c: any): boolean {
    return !this.isVisibleFile(c) || this.validateFile(c);
  }

  private emitInterlaced(c: any, emit: boolean): void {
    if (c.entrelazado && emit && c.valor) {
      this.interlaced.emit(c);
    }
  }

  private validateTextarea(c: any): boolean {
    const caracteresEspeciales1: RegExp = /[\"\\\/\b\f]/g;
    const caracteresEspeciales2: RegExp = /[\t\n\r]/g;
    const multiespacio: RegExp = /\s\s+/g;
    c.valor = c.valor.replace(caracteresEspeciales1, '');
    c.valor = c.valor.replace(caracteresEspeciales2, ' ');
    c.valor = c.valor.replace(multiespacio, ' ');
    if (c.cantidadCaracteres && c.valor.length > c.cantidadCaracteres) {
      return this.setCampoError(
        c,
        'El texto supera el máximo de caracteres permitido (máximo: ' +
          c.cantidadCaracteres +
          ', actualmente: ' +
          c.valor.length +
          ')',
      );
    }
    return this.setCampoSuccess(c);
  }

  private setCampoError(c: any, alerta: string): false {
    c.clase = 'form-control form-control-danger';
    c.alerta = alerta;
    return false;
  }

  private setCampoSuccess(c: any): true {
    c.clase = 'form-control form-control-success';
    c.alerta = '';
    return true;
  }

  clearForm() {
    this.normalform.campos.forEach((d: any) => {
      d.valor = null;
      if (d.etiqueta === 'file') {
        const nativeElement = this.DocumentoInputVariable
          ? this.DocumentoInputVariable.nativeElement
            ? this.DocumentoInputVariable.nativeElement
            : null
          : null;
        nativeElement ? (nativeElement.value = '') : '';
        d.File = undefined;
        d.url = '';
        d.urlTemp = '';
        d.valor = '';
      }
      if (d.etiqueta === 'fileRev') {
        ((d.File = undefined),
          (d.urlTemp = undefined),
          (d.url = undefined),
          (d.valor = undefined));
      }
      if (d.etiqueta === 'autocomplete') {
        const e = document.querySelectorAll('.inputAuto');
        // e.forEach((e: HTMLInputElement) => { e.value = ''; });
        e.forEach((e: any) => {
          e.value = '';
        });
        d.opciones = [];
      }
      d.alerta = '';
      d.clase = 'form-control form-control-success';
    });
    this.percentage.emit(0);
  }

  validForm() {
    const result: any = {};
    let requeridos = 0;
    let resueltos = 0;
    this.data.data = {};
    this.data.percentage = 0;
    this.data.files = [];
    this.data.valid = true;

    this.normalform.campos.forEach((d: any) => {
      requeridos = d.requerido && !d.ocultar ? requeridos + 1 : requeridos;
      if (this.validCampo(d, false)) {
        if ((d.etiqueta === 'file' || d.etiqueta === 'fileRev') && !d.ocultar) {
          result[d.nombre] = {
            nombre: d.nombre,
            file: d.File,
            url: d.url,
            IdDocumento: d.tipoDocumento,
          };
          // result[d.nombre].push({ nombre: d.name, file: d.valor });
        } else if (d.etiqueta === 'select') {
          result[d.nombre] = d.relacion ? d.valor : d.valor.Id;
        } else {
          result[d.nombre] = d.valor;
        }
        resueltos = d.requerido ? resueltos + 1 : resueltos;
      } else {
        this.data.valid = false;
      }
    });

    this.data.valid = this.data.valid && this.checkConfirmacion();

    if (this.data.valid && resueltos / requeridos >= 1) {
      if (this.normalform.modelo) {
        this.data.data[this.normalform.modelo] = result;
      } else {
        this.data.data = result;
      }
    }

    this.data.percentage = resueltos / requeridos;
    for (const key in this.modeloData) {
      // Agrega parametros faltantes del modelo
      if (
        this.data.data[this.normalform.modelo] !== undefined &&
        !this.data.data[this.normalform.modelo].hasOwnProperty(key)
      ) {
        this.data.data[this.normalform.modelo][key] = this.modeloData[key];
      }
    }

    if (this.normalform) {
      if (this.normalform.nombre) {
        this.data.nombre = this.normalform.nombre;
      }
    }

    this.result.emit(this.data);
    if (this.data.valid) this.percentage.emit(this.data.percentage);
    return this.data;
  }

  auxButton(c: any) {
    const result: any = {};
    this.normalform.campos.forEach((d: any) => {
      if (d.etiqueta === 'file') {
        result[d.nombre] = { nombre: d.nombre, file: d.File };
      } else if (d.etiqueta === 'select') {
        result[d.nombre] = d.relacion ? d.valor : d.valor.Id;
      } else {
        result[d.nombre] = d.valor;
      }
    });
    const dataTemp = {
      data: result,
      button: c.nombre,
    };
    if (c.resultado) {
      this.result.emit(dataTemp);
    } else {
      this.resultAux.emit(dataTemp);
    }
  }

  setPercentage(): void {
    let requeridos = 0;
    let resueltos = 0;
    this.normalform.campos.forEach((form_element: any) => {
      if (form_element.requerido && !form_element.ocultar) {
        requeridos = requeridos + 1;
        resueltos = form_element.valor ? resueltos + 1 : resueltos;
      }
    });
    this.percentage.emit(resueltos / requeridos);
  }

  isEqual(obj1: any, obj2: any) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  onCheckboxChange(c: any) {
    c.valor = !c.valor;
    c.alerta = '';
  }

  ngOnDestroy() {
    this.clearForm();
  }
}
