import { Component, EventEmitter, Inject, OnInit, Output, forwardRef } from '@angular/core';
import { DestinoViaje } from '../models/destino-viaje.model';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AjaxResponse, ajax } from 'rxjs/ajax';
import { CommonModule } from '@angular/common';
import { APP_CONFIG, AppConfig } from '../../app.routes';
import { noMonitor } from '@ngrx/store-devtools/src/config';

@Component({
  selector: 'app-form-destino-viaje',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-destino-viaje.component.html',
  styleUrl: './form-destino-viaje.component.css'
})
export class FormDestinoViajeComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  fg: FormGroup;
  minLongitud = 4;
  searchResults: string[];

  constructor(fb: FormBuilder, @Inject(forwardRef(() => APP_CONFIG)) private config: AppConfig) {
  
    this.onItemAdded = new EventEmitter();
    this.fg = fb.group({
      nombre: ['', Validators.compose([
        Validators.required,
        this.nombreValidator,
        this.nombreValidatorParametrizable(this.minLongitud)
      ])],
      url: ['']
    });

    this.fg.valueChanges.subscribe((form: any) => {
      console.log('cambio el formulario: ', form);
    });
  }

  ngOnInit() {
    let elemNombre = <HTMLInputElement>document.getElementById('nombre');
    fromEvent(elemNombre, 'input')
      .pipe(
          map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
          filter(text => text.length > 2),
          debounceTime(120),
          distinctUntilChanged(),
          switchMap((text: String) => ajax(this.config.apiEndpoint + '/ciudades=?' + text))
        ).subscribe(AjaxResponse => this.searchResults = AjaxResponse.response);    
  }

  guardar(nombre: string, url: string): boolean {
    const d = new DestinoViaje(nombre, url);
    this.onItemAdded.emit(d);
    return false;
  }

  nombreValidator(control: FormControl): { [s: string]: boolean } {
    const l = control.value.toString().trim().lenght;
    if (l > 0 && l < 5) {
      return { invalidNombre: true };
    }
    return {};
  }

  nombreValidatorParametrizable(minLong: number): ValidatorFn {
    return (control: FormControl): { [s: string]: boolean } | null => {
      const l = control.value.toString().trim().lenght;
      if (l > 0 && l < minLong) {
        return { minLongNombre: true };
      }
      return null;
    }
  } 


}
