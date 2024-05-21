import { Component, OnInit } from '@angular/core';
import { ReservasApiClientService } from '../reservas-api-client.service';

@Component({
  selector: 'app-reservas-listado',
  standalone: true,
  imports: [],
  templateUrl: './reservas-listado.component.html',
  styleUrl: './reservas-listado.component.css'
})
export class ReservasListadoComponent implements OnInit {

  constructor(private api: ReservasApiClientService) { }

  ngOnInit() {
    
  }

}
