import { Component, OnInit } from '@angular/core';
import { DestinoViaje } from './../../models/destino-viaje.model';
import { ActivatedRoute } from '@angular/router';
import { DestinosApiClient } from './../../models/destinos-api-client.model';
import { version } from 'uuid';

@Component({
  selector: 'app-destino-detalle',
  standalone: true,
  imports: [],
  templateUrl: './destino-detalle.component.html',
  styleUrl: './destino-detalle.component.css',
  providers: [ DestinosApiClient ]
})
export class DestinoDetalleComponent implements OnInit {
  destino!: DestinoViaje;
  style = {
    sources: {
      world: {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'
      }
    },
    version: 8,
    layers: [{
      'id': 'countries',
      'type': 'fill',
      'source': 'world',
      'layout': {},
      'paint': {
        'fill-color': '#6F788A'
      }
    }]
  };

  constructor(private route: ActivatedRoute, private destinosApiClient: DestinosApiClient) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.destino = this.destinosApiClient.getById(id);
    
  }

}
