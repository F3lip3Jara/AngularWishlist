import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DestinoViajeComponent } from '../destino-viaje/destino-viaje.component';
import { DestinoViaje } from './../../models/destino-viaje.model';
import { DestinosApiClient } from './../../models/destinos-api-client.model';
import { Store } from '@ngrx/store';
import { AppState } from './../../app.routes';
import { state } from '@angular/animations';
import { ElegidoFavoritoAction, NuevoDestinoAction } from './../../models/destinos-viajes-state.model';

@Component({
  selector: 'app-lista-destinos',
  standalone: true,
  imports: [CommonModule,DestinoViajeComponent],
  templateUrl: './lista-destinos.component.html',
  styleUrl: './lista-destinos.component.css',
  providers: [DestinosApiClient]
})
export class ListaDestinosComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  updates: string[];
  /* all; */

  constructor(private destinosApiClient: DestinosApiClient, private store: Store<AppState>) {
    this.onItemAdded = new EventEmitter();
    this.updates = [];
    this.store.select(state => state.destinos.favorito)
      .subscribe(d => {
        if (d != null) {
          this.updates.push('Se ha elegido a ' + d.nombre);
        }
      });
      store.select(state => state.destinos.items).subscribe(items => this.all = items);
   }

  ngOnInit() {
  }

  agregado(d:DestinoViaje) {
    this.destinosApiClient.add(d);
    this.onItemAdded.emit(d);
  }

  elegido(e: DestinoViaje){
    this.destinosApiClient.elegir(e);
  }

  getAll() {
    
  }

}
