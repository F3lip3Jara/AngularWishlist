import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { ListaDestinosComponent } from './lista-destinos/lista-destinos.component';
import { DestinoDetalleComponent } from './destino-detalle/destino-detalle.component';
import { APP_INITIALIZER, Injectable, InjectionToken, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DestinoViajeComponent } from './destino-viaje/destino-viaje.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormDestinoViajeComponent } from './form-destino-viaje/form-destino-viaje.component';
import { DestinosViajesEffects, DestinosViajesState, InitMyDataAction, initializeDestinosViajesState, reducerDestinosViajes } from './models/destinos-viajes-state.model';
import { ActionReducerMap, Store } from '@ngrx/store';
import { StoreModule as NgRxStoreModule, ActionReducerMap } from '@ngrx/store';
import { HttpClient, HttpClientModule, HttpHeaders, HttpRequest } from '@angular/common/http';
import Dexie from 'dexie';
import { TranslateLoader, TranslateModule, TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EffectsModule } from '@ngrx/effects';
import { StoreDevtools, StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LoginComponent } from './components/login/login/login.component';
import { ProtectedComponent } from './components/protected/protected/protected.component';
import { UsuarioLogueadoGuard } from './guards/usuario-logueado/usuario-logueado.guard';
/* import { DestinosApiClient } from './models/destinos-api-client.model'; */
import { AuthService } from './services/auth.service';
import { VuelosMainComponentComponent } from './components/vuelos/vuelos-main-component/vuelos-main-component.component';
import { VuelosMasInfoComponentComponent } from './components/vuelos/vuelos-mas-info-component/vuelos-mas-info-component.component';
import { VuelosDetalleComponent } from './components/vuelos/vuelos-detalle-component/vuelos-detalle-component.component';
import { ReservasModule } from './reservas/reservas.module';
import { VuelosComponentComponent } from './components/vuelos/vuelos-component/vuelos-component.component';
import { DestinoViaje } from './models/destino-viaje.model';
import { Observable, flatMap, from } from 'rxjs';
import { EspiameDirective } from './espiame.directive';
import { TrackearClickDirective } from './trackear-click.directive';

export interface AppConfig {
    apiEndpoint: String;
}
const APP_CONFIG_VALUE: AppConfig = {
    apiEndpoint: 'http://localhost:3000'
};

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

// init routing
export const childrenRoutesVuelos: Routes = [
    { path: '', redirectTo: 'main', pathMatch: 'full'},
    { path: 'main', component: VuelosMainComponentComponent},
    { path: 'mas-info', component: VuelosMasInfoComponentComponent},
    { path: ':id', component: VuelosDetalleComponent},
];

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', component: ListaDestinosComponent},
    { path: 'destino/:id', component: DestinoDetalleComponent},
    { path: 'login', component: LoginComponent },
    {
        path: 'protected',
        component: ProtectedComponent,
        canActivate: [ UsuarioLogueadoGuard ]
    },
    {
        path: 'vuelos',
        component: VuelosComponentComponent,
        canActivate: [ UsuarioLogueadoGuard ],
        children: childrenRoutesVuelos
    }
];
// fin routing



// redux init
export interface AppState {
    destinos: DestinosViajesState;
}

const reducers: ActionReducerMap<AppState> = {
    destinos: reducerDestinosViajes
};

const reducersInitialState = {
    destinos: initializeDestinosViajesState()
};

// app init
export function init_app(appLoadService: AppLoadService): () => Promise<any> {
    return () => appLoadService.initializeDestinosViajesState()
};

@Injectable()
class AppLoadService {
    constructor(private store: Store<AppState>, private http: HttpClient) { }
    async initializeDestinosViajesState(): Promise<any> {
        const headers: HttpHeaders = new HttpHeaders({'X-API-TOKEN': 'token-seguridad'});
        const req = new HttpRequest('GET', APP_CONFIG_VALUE.apiEndpoint + '/my', { headers: headers });
        const response: any = await this.http.request(req).toPromise();
        this.store.dispatch(new InitMyDataAction(response.body));
    }
}

// redux fin init

// dexie db
export class translation {
    constructor(public id: number, public lang: string, public key: string, public value: string) {}
}

@Injectable({
    providedIn: 'root'
})
export class MyDatabase extends Dexie {
    destinos!: Dexie.Table<DestinoViaje, number>;
    translations!: Dexie.Table<Translation, number>;
    constructor () {
        super('MyDatabase');
        this.version(1).stores({
            destinos: '++id, nombre, imagenUrl'
        });
        this.version(2).stores({
            destinos: '++id, nombre, imagenUrl',
            translation: '++id, lang, key, value'
        });
    }
}

export const db = new MyDatabase();
// fin dexie db

// i18n ini
class TranslationLoader implements TranslationLoader {
    constructor(private http: HttpClient) { }

    getTrasnlation(lang: string): Observable<any> {
        const promise = db.translations
                          .where('lang')
                          .equals(lang)
                          .toArray()
                          .then(results => {
                            if (results.length === 0) {
                                return this.http
                                .get<Translation[]>(APP_CONFIG_VALUE.apiEndpoint + '/api/translation?lang=' + lang)
                                .toPromise()
                                .then(apiResults => {
                                    db.translations.bulkAdd(apiResults);
                                    return apiResults;
                                });
                            }
                            return results;
                          }).then((traducciones) => {
                            console.log('traducciones cargadas:');
                            console.log(traducciones);
                            return traducciones;
                          }).then((traducciones) => {
                            return traducciones?.map((t) => ({ [t.key]: t.value}));
                          });
                          return from(promise).pipe(flatMap((elems) => from(elems)));
    }
}

function HttpLoaderFactory(http: HttpClient) {
    return new TranslateLoader(http);
}


 @NgModule({
    declarations: [
        AppComponent,
        DestinoViajeComponent,
        ListaDestinosComponent,
        DestinoDetalleComponent,
        FormDestinoViajeComponent,
        LoginComponent,
        ProtectedComponent,
        VuelosComponentComponent,
        VuelosMainComponentComponent,
        VuelosMasInfoComponentComponent,
        VuelosDetalleComponent,
        EspiameDirective,
        TrackearClickDirective
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forRoot(routes),
        NgRxStoreModule.forRoot(reducers, { initialState: reducersInitialState }),
        EffectsModule.forRoot([DestinosViajesEffects]),
        StoreDevtoolsModule.instrument(),
        ReservasModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        }),
        NgxMapboxGLModule,
        BrowserAnimationsModule
    ],
    providers: [
        AuthService, UsuarioLogueadoGuard,
        { provide: APP_CONFIG, useValue: APP_CONFIG_VALUE },
        AppLoadService, 
        { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true },
        MyDatabase
    ],
    bootstrap: [AppComponent]
})

export class AppModule {}
