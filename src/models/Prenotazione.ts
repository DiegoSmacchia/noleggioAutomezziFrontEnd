export class Prenotazione {
  id: number;
  idUtente: number;
  idAutomezzo: number;
  dataInizio: Date;
  dataFine: Date;
  stato: number;
  constructor() {
    this.id = 0;
    this.stato = 0;
  }
}