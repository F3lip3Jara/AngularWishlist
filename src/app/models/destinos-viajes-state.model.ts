import { Action } from "@ngrx/store";
import { DestinoViaje } from "./destino-viaje.model";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
/* import { Effect, Actions, ofType } from "@ngrx/effects"; */
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { HttpClientModule } from "@angular/common/http";

export interface DestinosViajesState {
    items: DestinoViaje[];
    loanding: boolean;
    favorito: DestinoViaje;
}

export function initializeDestinosViajesState() {
    return {
        items: [],
        loading: false,
        favorito: null
    };
}

export enum DestinosViajesActionTypes {
    NUEVO_DESTINO = '[Destinos Viajes] Nuevo',
    ELEGIDO_FAVORITO = '[Destinos Viajes] Favorito',
    VOTE_UP = '[Destinos Viajes] Vote Up',
    VOTE_DOWN = '[Destinos Viajes] Vote Down',
    INIT_MY_DATA = '[Destinos Viajes] Init My Data'
}

export class NuevoDestinoAction implements Action {
    type = DestinosViajesActionTypes.NUEVO_DESTINO;
    constructor(public destino: DestinoViaje) {}
}

export class ElegidoFavoritoAction implements Action {
    type = DestinosViajesActionTypes.ELEGIDO_FAVORITO;
    constructor(public destino: DestinoViaje) {}
}

export class VoteUpAction implements Action {
    type = DestinosViajesActionTypes.VOTE_UP;
    constructor(public destino: DestinoViaje) {}
}

export class VoteDownAction implements Action {
    type = DestinosViajesActionTypes.VOTE_DOWN;
    constructor(public destino: DestinoViaje) {}
}

export class InitMyDataAction implements Action {
    type = DestinosViajesActionTypes.INIT_MY_DATA;
    constructor(public destinos: string[]) {}
}

export type DestinosViajesActions = NuevoDestinoAction | ElegidoFavoritoAction 
    | VoteUpAction | VoteDownAction | InitMyDataAction;

export function reducerDestinosViajes(
    state: DestinosViajesState,
    action: DestinosViajesActions 
): DestinosViajesState {
    switch (action.type) {
        case DestinosViajesActionTypes.INIT_MY_DATA: {
            const destinos: string[] = (action as InitMyDataAction).destinos;
            return {
                ...state,
                items: destinos.map((d) => new DestinoViaje(d, ''))
            };
        }
        case DestinosViajesActionTypes.NUEVO_DESTINO: {
            return {
                ...state,
                items: [...state.items, (action as NuevoDestinoAction).destino ]
            };
        }
        case DestinosViajesActionTypes.ELEGIDO_FAVORITO: {
            state.items.forEach(x => x.setSelected(false));
            const fav: DestinoViaje = (action as ElegidoFavoritoAction).destino;
            fav.setSelected(true);
            return {
                ...state,
                favorito: fav
            };
        }
        case DestinosViajesActionTypes.VOTE_UP: {
            const d: DestinoViaje = (action as VoteUpAction).destino;
            d.voteUp();
            return { ...state };
        }
        case DestinosViajesActionTypes.VOTE_DOWN: {
            const d: DestinoViaje = (action as VoteDownAction).destino;
            d.voteDown();
            return { ...state };
        }
    }
    return state;
}

/* @Injectable()
export class DestinosViajesEffects {
   @Effect()
    nuevoAgregado$: Observable<Action> = this.actions$.pipe(
        ofType(DestinosViajesActionTypes.NUEVO_DESTINO),
        map((action: NuevoDestinoAction) => new ElegidoFavoritoAction(action.destino))
    );

    constructor(private actions$: Actions) {}
} */

@Injectable()
export class DestinosViajesEffects {
   nuevoAgregado$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(DestinosViajesActionTypes.NUEVO_DESTINO),
        map((action: NuevoDestinoAction) => new ElegidoFavoritoAction(action.destino))
    ));

    constructor(private actions$: Actions) {}
}