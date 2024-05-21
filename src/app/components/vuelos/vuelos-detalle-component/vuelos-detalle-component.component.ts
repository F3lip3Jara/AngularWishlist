import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vuelos-detalle-component',
  standalone: true,
  imports: [],
  templateUrl: './vuelos-detalle-component.component.html',
  styleUrl: './vuelos-detalle-component.component.css'
})
export class VuelosDetalleComponentComponent implements OnInit {
  id: any;

  constructor(private route: ActivatedRoute) {
    route.params.subscribe(params => { this.id = params['id']; });
  }

  ngOnInit() {
    
  }

}
