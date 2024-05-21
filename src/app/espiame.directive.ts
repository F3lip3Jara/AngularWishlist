import { Directive, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appEspiame]',
  standalone: true
})
export class EspiameDirective implements OnInit, OnDestroy {
  static nextId = 0;
  log = (msg: string) => console.log(`Evento #${EspiameDirective.nextId++} ${msg}`);
  ngOnInit() { this.log('########******** onInit'); }
  ngOnDestroy() { this.log('########******** onDestroy'); }
}