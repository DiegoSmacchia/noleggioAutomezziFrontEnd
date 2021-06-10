import { Automezzo } from "./Automezzo";
import { Utente } from "./Utente";

export class Prenotazione {
  id: number;
  utente: Utente;
  automezzo: Automezzo;
  dataInizio: Date;
  dataFine: Date;
  stato: number;
  
  constructor() {
    this.id = 0;
    this.stato = 0;
    this.automezzo = new Automezzo();
    this.utente = new Utente();
  }
}