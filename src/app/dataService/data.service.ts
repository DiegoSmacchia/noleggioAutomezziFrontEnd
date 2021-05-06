import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { SharedService } from 'app/sharedService/shared.service';
import { Utente } from 'models/Utente';
import { Automezzo } from 'models/Automezzo';
import { PrenotazioneFull } from 'models/full/PrenotazioneFull';
import { Prenotazione } from 'models/Prenotazione';



@Injectable()
export class DataService {
  private baseUrl:string;
  postUrl:string;
  provaurl:string;
  tmp : number;
  private _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  
  constructor(private httpClient : HttpClient) {
    this.baseUrl= "https://44377/API/" ;
  }

  /************************************UTENTI************************************/
  tryLogin(username:string, password:string) {
    let body = new FormData();    
    body.append('username' , username);
    body.append('password' , password);
    return this.httpClient.post("https://localhost:44377/api/utenti/login", body);
  }
  checkLogin(userId:string, encryptedPassword: string) { 
    let body = new FormData();    
    body.append('userId' , userId);
    body.append('password' , encryptedPassword);
   
    return this.httpClient.post("https://localhost:44377/api/utenti/checkLogin", body);
  }
  updateUtente(utente: Utente) {
    let body = new FormData();
    body.append('id', utente.id.toString());
    body.append('nome' , utente.nome);
    body.append('username' , utente.username);
    body.append('password', utente.password);
    body.append('cognome', utente.cognome);
    body.append('dataNascita', utente.dataNascita.toString());
    body.append('indirizzoEmail', utente.indirizzoEmail);
    return this.httpClient.post("https://localhost:44377/api/utenti/Update", body);
  }
  cercaUsername(username:string) {
    return this.httpClient.get("https://localhost:44377/api/utenti/CercaUsername/" + username);
  }
  cercaIndirizzoEmail(indirizzoEmail:string) {
    return this.httpClient.get("https://localhost:44377/api/utenti/CercaIndirizzoEmail/" + indirizzoEmail);
  }

  /************************************AUTOMEZZI************************************/
  listAutomezzi() {
    return this.httpClient.get("https://localhost:44377/api/automezzi/list");
  }
  listAutomezziDisponibili() {
    return this.httpClient.get("https://localhost:44377/api/automezzi/listDisponibili");
  }
  getAutomezzoById(id: number) {
    return this.httpClient.get("https://localhost:44377/api/automezzi/getById/" + id);
  }
  getAutomezzoByTarga(targa: string) {
    return this.httpClient.get("https://localhost:44377/api/automezzi/getByTarga/" + targa);
  }
  updateAutomezzo(automezzo: Automezzo) {
    let body = new FormData();
    body.append('id', automezzo.id.toString());
    body.append('targa' , automezzo.targa);
    body.append('marca' , automezzo.marca);
    body.append('modello', automezzo.modello);
    body.append('kmAttuali', automezzo.kmAttuali.toString());
    body.append('costo', automezzo.costo.toString());
    return this.httpClient.post("https://localhost:44377/api/automezzi/Update", body);
  }

  /************************************PRENOTAZIONI************************************/
  listPrenotazioni(id: number) {
    return this.httpClient.get("https://localhost:44377/api/Prenotazioni/List/" + (id && id > 0 ? id : ''));
  }
  updatePrenotazione(prenotazione: PrenotazioneFull) {
    let body = new FormData();
    body.append('id', prenotazione.id.toString());
    body.append('idUtente' , prenotazione.utente.id.toString());
    body.append('idAutomezzo' , prenotazione.automezzo.id.toString());
    body.append('dataInizio', prenotazione.dataInizio.toLocaleDateString());
    body.append('dataFine', prenotazione.dataFine.toLocaleDateString());
    body.append('stato', prenotazione.stato.toString());
    return this.httpClient.post("https://localhost:44377/api/Prenotazioni/Update", body);
  }
  accettaPrenotazione(id: number) {
    let body = new FormData();
    body.append('id', id.toString());
    return this.httpClient.post("https://localhost:44377/api/Prenotazioni/AccettaPrenotazione", body)
  }
  rifiutaPrenotazione(id: number) {
    let body = new FormData();
    body.append('id', id.toString());
    return this.httpClient.post("https://localhost:44377/api/Prenotazioni/RifiutaPrenotazione", body)
  }
  /************************************NOTIFICHE************************************/
  listNotifiche(idUtente: number) {
    return this.httpClient.get("https://localhost:44377/api/Notifiche/List/" + idUtente);
  }
}
