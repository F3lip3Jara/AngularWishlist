/* import {v4 as uuid} from 'uuid'; */
import { v4 as uuid } from 'uuid';


export class DestinoViaje {
    private selected: boolean;
    public servicios: string[];
    /* id: any; */
    public id = uuid();
    
    
    
    constructor(public nombre: string, public imagenUrl: string, public votes: number = 0) {
      this.servicios = ['pileta', 'desayuno'];

      this.selected = false;
     }
    isSelected(): boolean {
      return this.selected;
    }
    setSelected(s: boolean) {
        this.selected = s;
    }
    voteUp() {
      this.votes++;
    }
    voteDown() {
      this.votes--;
    }
}
