import { Prenotazione } from "./Prenotazione";

export class Multa{
  public id: number;
  public prenotazione: Prenotazione;
  public importo: number;
  public data: Date;
  
  constructor() {
    this.id = 0;
  }
}