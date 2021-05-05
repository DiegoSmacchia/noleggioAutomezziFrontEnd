import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataService } from 'app/dataService/data.service';
import { NotificationsComponent } from 'app/notifications/notifications.component';
import { Utente } from 'models/Utente';
import { ignoreElements } from 'rxjs-compat/operator/ignoreElements';
import Swal from 'sweetalert2'


@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  username: string;
  password: string;
  utente: Utente;

  registrazione: boolean;
  nuovoUtente: Utente;
  confermaPassword: string;
  usernames: string[] = [];
  constructor(private httpClient: HttpClient, private notificationsComponent: NotificationsComponent, private router:Router, private dataService: DataService) { }

  ngOnInit() {
    this.registrazione = false;
  }
  setRegistrazione() {
    this.registrazione = true;
    this.nuovoUtente = new Utente();
    this.dataService.listUsernames().subscribe(
      (res: string[]) => {
        this.usernames = res;
      }
    )
  }

  tryLogin() {

    this.dataService.tryLogin(this.username, this.password).subscribe(
      (res: Utente) => {
        this.utente = res;
        sessionStorage.setItem("userId", this.utente.id.toString());
        sessionStorage.setItem("userPsw", this.utente.password);
        this.router.navigateByUrl("dashboard");
      }, err => {
        var messaggio: string = "";
        switch (err.status) {
          case 403:
            messaggio = "Username o password Sbagliati!";
            break;
          default:
            messaggio = "Errore durante il login";
            break
        }
        this.notificationsComponent.showNotification("top", "center", messaggio, 4);
      }
    );
  }
  insertUtente() {
    var messaggio = this.validateUtente();
    if (messaggio) {
      Swal.fire({
        title: 'Errore, ricontrolla i campi!',
        html: messaggio,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
    else {
      this.dataService.insertUtente(this.nuovoUtente).subscribe(
        res => {
          Swal.fire({
            title: 'Utente creato con successo!',
            html: "ora puoi procedere al login!",
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then(function(){
            window.location.reload();
          });
        }, err => {
          Swal.fire({
            title: 'Errore!',
            html: "Qualcosa è andato storto, riprova!",
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      );
    }
    
   
  }
  validateUtente(): string{
    var messaggio: string = "";
    if (!this.nuovoUtente.nome)
      messaggio += "Inserire il nome!<br>";
    if (!this.nuovoUtente.cognome)
      messaggio += "Inserire il cognome!<br>";
    if (!this.nuovoUtente.username)
      messaggio += "Inserire l\'username!<br>";
    if (!this.nuovoUtente.dataNascita)
      messaggio += "Inserire la data di nascita!<br>";
    if (!this.nuovoUtente.password)
      messaggio += "Inserire la password!<br>";
    else
      if (this.nuovoUtente.password != this.confermaPassword)
        messaggio += "Le due password non corrispondono!<br>";
    return messaggio;
  }
}
