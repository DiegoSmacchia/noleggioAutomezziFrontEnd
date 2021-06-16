import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/dataService/data.service';
import { NotificationsComponent } from 'app/notifications/notifications.component';
import { SharedService } from 'app/sharedService/shared.service';
import { Utente } from 'models/Utente';
import Swal from 'sweetalert2'


@Component({
  selector: 'utente',
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.css', '../../assets/scss/spinner.scss', '../../assets/css/fab.css', '../../assets/css/icona.nessun.record.css']
})
export class UtenteComponent implements OnInit {
  loading: boolean;
  utente: Utente;
  confermaPassword: string;
  dataNascita: string;

  constructor(private sharedService: SharedService,
    private dataService: DataService,
    private notificationsComponent: NotificationsComponent) { }

  ngOnInit() {
    this.sharedService.checkCredentials();
    this.reloadData();
  }
  reloadData() {
    this.loading = true;
    this.dataService.checkLogin(sessionStorage.getItem("userId"), sessionStorage.getItem("userPsw")).subscribe(
      (res: Utente) => {
        this.utente = res;
        this.utente.password = "";
        this.dataNascita = this.utente.dataNascita?.toString().substring(0, 10);
        this.loading = false;
      }, err => {
        this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero dell'utente!", 4);
        this.loading = false;
      }
    )
  }
  
  confermaModifica() {
    this.loading = true;
    this.utente.dataNascita = new Date(this.dataNascita);
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
      this.dataService.updateUtente(this.utente).subscribe(
        res => {
          this.loading = false;
          Swal.fire({
            title: 'Utente modificato con successo!',
            html: "i tuoi dati sono stati aggiornati",
            icon: 'success',
            confirmButtonText: 'Ok'
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
  validateUtente(): string {
    var messaggio: string = "";
    if (!this.utente.nome)
      messaggio += "Inserire il nome!<br>";
    if (!this.utente.cognome)
      messaggio += "Inserire il cognome!<br>";
    if (!this.utente.username)
      messaggio += "Inserire l\'username!<br>";   
    if (!this.utente.indirizzoEmail)
      messaggio += "Inserire l\'indirizzo Email!<br>";
    else
      if (!this.utente.indirizzoEmail.includes("@"))
        messaggio += "Inserire un indirizzo Email valido!<br>";    
    if (!this.utente.dataNascita)
      messaggio += "Inserire la data di nascita!<br>";
    if (!this.utente.password)
      messaggio += "Inserire la password!<br>";
    else {
      if (this.utente.password.length < 5)
        messaggio += "La password deve essere lunga almeno 5 caratteri!<br>";
      else
        if (this.utente.password != this.confermaPassword)
          messaggio += "Le due password non corrispondono!<br>";
    }
    return messaggio;
  }

}
