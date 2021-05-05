export class Utente{
  id: number;
  nome: string;
  cognome: string;
  username: string;
  password: string;
  dataNascita: Date;
  hasPermessi: boolean;
  indirizzoEmail: string;
  constructor() {
    this.id = 0;
  }
}