import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { SharedService } from 'app/sharedService/shared.service';
import { Utente } from 'models/Utente';
import { brotliCompressSync } from 'zlib';



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
  listUsernames() {
    return this.httpClient.get("https://localhost:44377/api/utenti/ListUsernames");
  }
  insertUtente(utente: Utente) {
    let body = new FormData();
    body.append('nome' , utente.nome);
    body.append('username' , utente.username);
    body.append('password', utente.password);
    body.append('cognome', utente.cognome);
    body.append('dataNascita', utente.dataNascita.toString());
    return this.httpClient.post("https://localhost:44377/api/utenti/InsertUtente", body);
  }

  listAutomezzi() {
    return this.httpClient.get("https://localhost:44377/api/automezzi/list");
  }
}
