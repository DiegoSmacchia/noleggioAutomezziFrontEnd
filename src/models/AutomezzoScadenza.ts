import { Automezzo } from "./Automezzo";
import { Scadenza } from "./Scadenza";

export class AutomezzoScadenza{
  public id: number;
  public automezzo: Automezzo;
  public scadenza: Scadenza;
  public dataInizio: Date;
  public dataFine: Date;
  public kmIniziali: number;
  public dataPagamento: Date;

  constructor() {
    this.id = 0;
  }
}