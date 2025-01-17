import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  mensajeError: string;

  constructor(public authService: AuthService) {
    this.mensajeError = '';
  }

  ngOnInit(){
    
  }

  login(username: string, password: string): boolean {
    this.mensajeError = '';
    if (!this.authService.login(username, password)) {
      this.mensajeError = 'Login incorrecto.';
      setTimeout(function() {
        this.mensajeError = '';
      }.bind(this), 2500);
    }
    return false;
  }

  logout(): boolean {
    this.authService.logout();
    return false;
  }

}
