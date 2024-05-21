import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DestinoViajeComponent } from './destino-viaje/destino-viaje.component';
import { ListaDestinosComponent } from './lista-destinos/lista-destinos.component';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,DestinoViajeComponent,ListaDestinosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-wishlist';
  time = new Observable(observer => {
    setInterval(() => observer.next(new Date().toString()), 1000);
    return null;
  });

  constructor(private translate: TranslateService) {
    console.log('***************** get translation');
    translate.getTranslation('en').subscribe(x => console.log('x: ' + JSON.stringify(x)));
    translate.setDefaultLang('es');
  }

  destinoAgregado(d) {

  }

}


