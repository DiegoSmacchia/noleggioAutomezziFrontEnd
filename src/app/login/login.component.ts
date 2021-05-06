import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'app/dataService/data.service';
import { NotificationsComponent } from 'app/notifications/notifications.component';
import { Utente } from 'models/Utente';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2'


@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../assets/scss/spinner.scss']
})


export class LoginComponent implements OnInit {
  username: string;
  password: string;
  utente: Utente;

  registrazione: boolean;
  nuovoUtente: Utente;
  confermaPassword: string;
  loading: boolean;
  constructor(private notificationsComponent: NotificationsComponent, private router:Router, private dataService: DataService) { }

  ngOnInit() {
    this.registrazione = false;
    this.loading = false;
  }
  setRegistrazione() {
    this.registrazione = true;
    this.nuovoUtente = new Utente();
  }
  setLogin() {
    this.registrazione = false;
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
          case 401:
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
    this.loading = true;
    var messaggio = this.validateUtente();
    if (messaggio) {
      Swal.fire({
        title: 'Errore, ricontrolla i campi!',
        html: messaggio,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      this.loading = false;
    }
    else {
      forkJoin(
        this.dataService.cercaUsername(this.nuovoUtente.username), this.dataService.cercaIndirizzoEmail(this.nuovoUtente.indirizzoEmail)).subscribe(
          (res: any[]) => {
            if (res[0] || res[1]) {
              if (res[0])
                messaggio += "il nome utente " + this.nuovoUtente.username + " è già in uso!<br>";
              if (res[1])
                  messaggio += "l\'indirizzo Email " + this.nuovoUtente.indirizzoEmail + " è già in uso!<br>";
              Swal.fire({
                title: 'Errore, ricontrolla i campi!',
                html: messaggio,
                icon: 'error',
                confirmButtonText: 'Ok'
              });
              this.loading = false;
            }
            else {
              this.dataService.updateUtente(this.nuovoUtente).subscribe(
                res => {
                  this.loading = false;
                  Swal.fire({
                    title: 'Utente creato con successo!',
                    html: "ora puoi procedere al login!",
                    icon: 'success',
                    confirmButtonText: 'Ok'
                  }).then(function () {
                    window.location.reload();
                  });
                }, err => {
                  switch (err.status) {
                    case 400:
                      messaggio = "Ricontrolla i campi inseriti!";
                      break;
                    default:
                      messaggio = "Qualcosa è andato storto, riprova!";
                      break
                }
                  Swal.fire({
                    title: 'Errore!',
                    html: messaggio,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  });
                  this.loading = false;
                }
              );
            }
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
    if (!this.nuovoUtente.indirizzoEmail)
      messaggio += "Inserire l\'indirizzo Email!<br>";
    else
      if (!this.nuovoUtente.indirizzoEmail.includes("@"))
        messaggio += "Inserire un indirizzo Email valido!<br>";    
    if (!this.nuovoUtente.dataNascita)
      messaggio += "Inserire la data di nascita!<br>";
    if (!this.nuovoUtente.password)
      messaggio += "Inserire la password!<br>";
    else {
      if (this.nuovoUtente.password.length < 5)
        messaggio += "La password deve essere lunga almeno 5 caratteri!<br>";
      else
        if (this.nuovoUtente.password != this.confermaPassword)
          messaggio += "Le due password non corrispondono!<br>";
    }
    return messaggio;
  }
}
