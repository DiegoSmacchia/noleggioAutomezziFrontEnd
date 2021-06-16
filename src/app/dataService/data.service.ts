import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Utente } from 'models/Utente';
import { Automezzo } from 'models/Automezzo';
import { Prenotazione } from 'models/Prenotazione';
import { Meccanico } from 'models/Meccanico';
import { Intervento } from 'models/Intervento';
import { Guasto } from 'models/Guasto';
import { Multa } from 'models/Multa';
import { Scadenza } from 'models/Scadenza';
import { AutomezzoScadenza } from 'models/AutomezzoScadenza';



@Injectable()
export class DataService {
  private baseUrl:string;
  postUrl:string;
  provaurl:string;
  tmp : number;
  private _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  
  constructor(private httpClient : HttpClient) {
    this.baseUrl = "https://localhost:44377/API/";
  }

  /************************************UTENTI************************************/
  tryLogin(username:string, password:string) {
    let body = new FormData();    
    body.append('username' , username);
    body.append('password' , password);
    return this.httpClient.post(this.baseUrl + "utenti/login", body);
  }
  checkLogin(userId:string, encryptedPassword: string) { 
    let body = new FormData();    
    body.append('userId' , userId);
    body.append('password' , encryptedPassword);
   
    return this.httpClient.post(this.baseUrl + "utenti/checkLogin", body);
  }
  updateUtente(utente: Utente) {
    let body = new FormData();
    body.append('id', utente.id.toString());
    body.append('nome' , utente.nome);
    body.append('username' , utente.username);
    body.append('password', utente.password);
    body.append('cognome', utente.cognome);
    body.append('dataNascita', utente.dataNascita.toLocaleDateString());
    body.append('indirizzoEmail', utente.indirizzoEmail);
    return this.httpClient.post(this.baseUrl + "utenti/Update", body);
  }
  cercaUsername(username:string) {
    return this.httpClient.get(this.baseUrl + "utenti/CercaUsername/" + username);
  }
  cercaIndirizzoEmail(indirizzoEmail:string) {
    return this.httpClient.get(this.baseUrl + "utenti/CercaIndirizzoEmail/" + indirizzoEmail);
  }

  /************************************AUTOMEZZI************************************/
  listAutomezzi() {
    return this.httpClient.get(this.baseUrl + "automezzi/list");
  }
  listAutomezziDisponibili() {
    return this.httpClient.get(this.baseUrl + "automezzi/listDisponibili");
  }
  getAutomezzoById(id: number) {
    return this.httpClient.get(this.baseUrl + "automezzi/getById/" + id);
  }
  getAutomezzoByTarga(targa: string) {
    return this.httpClient.get(this.baseUrl + "automezzi/getByTarga/" + targa);
  }
  updateAutomezzo(automezzo: Automezzo) {
    let body = new FormData();
    body.append('id', automezzo.id.toString());
    body.append('targa' , automezzo.targa);
    body.append('marca' , automezzo.marca);
    body.append('modello', automezzo.modello);
    body.append('kmAttuali', automezzo.kmAttuali.toString());
    body.append('costo', automezzo.costo.toString());
    return this.httpClient.post(this.baseUrl + "automezzi/Update", body);
  }
  deleteAutomezzo(idAutomezzo: number) {
    let body = new FormData();
    body.append('id', idAutomezzo.toString());
    
    return this.httpClient.post(this.baseUrl + "Automezzi/DeleteAutomezzo", body);
  }
  /************************************INTERVENTI************************************/
  listInterventi() {
    return this.httpClient.get(this.baseUrl + "Interventi/ListInterventi");
  }
  listInterventiByIdAutomezzo(idAutomezzo: number) {
    return this.httpClient.get(this.baseUrl + "Interventi/ListInterventiByIdAutomezzo/" + idAutomezzo);
  }
  updateIntervento(intervento: Intervento) {
    let body = new FormData();
    body.append('id', intervento.id.toString());
    body.append('idMeccanico' , intervento.meccanico.id.toString());
    body.append('idAutomezzo' , intervento.automezzo.id.toString());
    body.append('idGuasto', intervento.guasto.id.toString());
    body.append('dataInizio', intervento.dataInizio.toLocaleDateString());
    body.append('dataFine', intervento.dataFine.toLocaleDateString());
    return this.httpClient.post(this.baseUrl + "Interventi/UpdateIntervento", body);
  }
  deleteIntervento(idIntervento: number) {
    let body = new FormData();
    body.append('id', idIntervento.toString());
    
    return this.httpClient.post(this.baseUrl + "Interventi/DeleteIntervento", body);
  }
  /************************************GUASTI************************************/
  listGuasti() {
    return this.httpClient.get(this.baseUrl + "Interventi/ListGuasti");
  }
  listGuastiByIdUtente(idUtente: number) {
    return this.httpClient.get(this.baseUrl + "Interventi/ListGuastiByIdUtente/" + idUtente);
  }
  listGuastiByIdAutomezzo(idAutomezzo: number) {
    return this.httpClient.get(this.baseUrl + "Interventi/ListGuastiByIdAutomezzo/" + idAutomezzo);
  }
  updateGuasto(guasto: Guasto) {
    let body = new FormData();
    body.append('id', guasto.id.toString());
    body.append('idUtente' , guasto.utente.id.toString());
    body.append('idAutomezzo' , guasto.automezzo.id.toString());
    body.append('descrizione', guasto.descrizione);
    body.append('data', guasto.data.toLocaleDateString());
    return this.httpClient.post(this.baseUrl + "Interventi/UpdateGuasto", body);
  }
  deleteGuasto(idGuasto: number) {
    let body = new FormData();
    body.append('id', idGuasto.toString());
    
    return this.httpClient.post(this.baseUrl + "Interventi/DeleteGuasto", body);
  }
  /************************************PRENOTAZIONI************************************/
  listPrenotazioni(id: number) {
    return this.httpClient.get(this.baseUrl + "Prenotazioni/List/" + (id && id > 0 ? id : ''));
  }
  updatePrenotazione(prenotazione: Prenotazione) {
    let body = new FormData();
    body.append('id', prenotazione.id.toString());
    body.append('idUtente' , prenotazione.utente.id.toString());
    body.append('idAutomezzo' , prenotazione.automezzo.id.toString());
    body.append('dataInizio', prenotazione.dataInizio.toLocaleDateString());
    body.append('dataFine', prenotazione.dataFine.toLocaleDateString());
    body.append('stato', prenotazione.stato.toString());
    return this.httpClient.post(this.baseUrl + "Prenotazioni/Update", body);
  }
  accettaPrenotazione(id: number) {
    let body = new FormData();
    body.append('id', id.toString());
    return this.httpClient.post(this.baseUrl + "Prenotazioni/AccettaPrenotazione", body)
  }
  rifiutaPrenotazione(id: number) {
    let body = new FormData();
    body.append('id', id.toString());
    return this.httpClient.post(this.baseUrl + "Prenotazioni/RifiutaPrenotazione", body)
  }
  /************************************MECCANICI************************************/
  listMeccanici() {
    return this.httpClient.get(this.baseUrl + "Meccanici/ListMeccanici");
  }
  updateMeccanico(meccanico: Meccanico) {
    let body = new FormData();
    body.append('id', meccanico.id.toString());
    body.append('ragioneSociale' , meccanico.ragioneSociale);
    body.append('indirizzo' , meccanico.indirizzo);
    body.append('telefono', meccanico.telefono);
    return this.httpClient.post(this.baseUrl + "Meccanici/UpdateMeccanico", body);
  }
  deleteMeccanico(idMeccanico: number) {
    let body = new FormData();
    body.append('id', idMeccanico.toString());
    
    return this.httpClient.post(this.baseUrl + "Meccanici/DeleteMeccanico", body);
  }
  /************************************MULTE************************************/
  listMulte() {
    return this.httpClient.get(this.baseUrl + "Multe/ListMulte");
  }
  listMulteByIdUtente(idUtente: number) {
    return this.httpClient.get(this.baseUrl + "Multe/ListMulteByIdUtente/" + idUtente);
  }
  updateMulta(multa: Multa) {
    let body = new FormData();
    body.append('id', multa.id.toString());
    body.append('idPrenotazione' , multa.prenotazione.id.toString());
    body.append('importo' , multa.importo.toString());
    body.append('data', multa.data.toLocaleDateString());

    return this.httpClient.post(this.baseUrl + "Multe/UpdateMulta", body);
  }
  deleteMulta(idMulta: number) {
    let body = new FormData();
    body.append('id', idMulta.toString());
    
    return this.httpClient.post(this.baseUrl + "Multe/DeleteMulta", body);
  }
  /************************************SCADENZE************************************/
  listScadenze() {
    return this.httpClient.get(this.baseUrl + "Scadenze/ListScadenze");
  }
  updateScadenza(scadenza: Scadenza) {
    let body = new FormData();
    body.append('id', scadenza.id.toString());
    body.append('scadenza' , scadenza.scadenza);
    return this.httpClient.post(this.baseUrl + "Scadenze/UpdateScadenza", body);
  }
  deleteScadenza(idScadenza: number) {
    let body = new FormData();
    body.append('id', idScadenza.toString());
    
    return this.httpClient.post(this.baseUrl + "Scadenze/DeleteScadenza", body);
  }
  /************************************AUTOMEZZISCADENZE************************************/
  listAutomezziScadenze(idAutomezzo: number) {
    return this.httpClient.get(this.baseUrl + "Scadenze/ListAutomezziScadenze/" + idAutomezzo);
  }
  updateAutomezzoScadenza(scadenza: AutomezzoScadenza) {
    let body = new FormData();
    body.append('id', scadenza.id.toString());
    body.append('idScadenza', scadenza.scadenza.id.toString());
    body.append('idAutomezzo' , scadenza.automezzo.id.toString());
    body.append('dataInizio', scadenza.dataInizio.toISOString());
    body.append('dataFine', scadenza.dataFine?.toString());
    body.append('kmIniziali', scadenza.kmIniziali?.toString());
    body.append('dataPagamento', scadenza.dataPagamento?.toString());

    return this.httpClient.post(this.baseUrl + "Scadenze/UpdateAutomezzoScadenza", body);
  }
  deleteAutomezzoScadenza(idScadenza: number) {
    let body = new FormData();
    body.append('id', idScadenza.toString());
    
    return this.httpClient.post(this.baseUrl + "Scadenze/DeleteAutomezzoScadenza", body);
  }
  /************************************NOTIFICHE************************************/
  listNotifiche(idUtente: number) {
    return this.httpClient.get(this.baseUrl + "Notifiche/List/" + idUtente);
  }
  listValoriAdmin() {
    return this.httpClient.get(this.baseUrl + "Notifiche/ListValoriAdmin");
  }
  listValoriUtente(idUtente: number) {
    return this.httpClient.get(this.baseUrl + "Notifiche/ListValoriUtente/" + idUtente);
  }
}
