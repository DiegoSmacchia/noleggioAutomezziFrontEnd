import { Automezzo } from "./Automezzo";
import { Utente } from "./Utente";

export class Guasto {
  public id: number;
  public automezzo: Automezzo;
  public utente: Utente;
  public descrizione: string;
  public data: Date;

  constructor() {
    this.id = 0;
    this.automezzo = new Automezzo();
    this.utente = new Utente();
  }
}