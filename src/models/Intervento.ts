import { Automezzo } from "./Automezzo";
import { Guasto } from "./Guasto";
import { Meccanico } from "./Meccanico";

export class Intervento{
  public id: number;
  public automezzo: Automezzo;
  public meccanico: Meccanico;
  public guasto: Guasto;
  public dataInizio: Date;
  public dataFine: Date;

  constructor() {
    this.id = 0;
    this.automezzo = new Automezzo();
    this.meccanico = new Meccanico();
    this.guasto = new Guasto();
  }
}