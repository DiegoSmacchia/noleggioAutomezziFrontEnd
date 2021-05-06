import { Automezzo } from "models/Automezzo";
import { Utente } from "models/Utente";

export class PrenotazioneFull {
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