import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/dataService/data.service';
import { NotificationsComponent } from 'app/notifications/notifications.component';
import { SharedService } from 'app/sharedService/shared.service';
import { Automezzo } from 'models/Automezzo';
import { Prenotazione } from 'models/Prenotazione';
import { Utente } from 'models/Utente';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2'


@Component({
  selector: 'lista-prenotazioni',
  templateUrl: './list.prenotazioni.component.html',
  styleUrls: ['./list.prenotazioni.component.css', '../../assets/scss/spinner.scss', '../../assets/css/fab.css', '../../assets/css/icona.nessun.record.css']
})
export class ListPrenotazioniComponent implements OnInit {
  loading: boolean;
  prenotazioni: Prenotazione[] = [];
  utente: Utente;
  automezzi: Automezzo[] = [];
  inserimento: boolean;
  prenotazione: Prenotazione;
  oggi: string;
  dataInizioPrenotazione: string;
  dataFinePrenotazione: string;
  constructor(private sharedService: SharedService,
    private dataService: DataService,
    private notificationsComponent: NotificationsComponent) { }

  ngOnInit() {
    this.sharedService.checkCredentials();
    this.utente = new Utente();
    this.loading = true;
    forkJoin(
    this.dataService.checkLogin(sessionStorage.getItem("userId"), sessionStorage.getItem("userPsw")), this.dataService.listAutomezziDisponibili()).subscribe(
      (res: any[]) => {
        this.utente = res[0];
        this.automezzi = res[1];
        var idUtente = this.utente.hasPermessi ? null : this.utente.id;
        this.dataService.listPrenotazioni(idUtente).subscribe(
          (res: Prenotazione[]) => {
            this.prenotazioni = res;
            this.loading = false;
          }, err => {
            this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero delle prenotazioni!", 4);
            this.loading = false;
          }
        );
      }, err => {
        this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero dei permessi!", 4);
      }
    );
    this.inserimento = false;
  }

  reloadData() {
    this.loading = true;
    var idUtente = this.utente.hasPermessi ? null : this.utente.id;
    this.dataService.listPrenotazioni(idUtente).subscribe(
      (res:Prenotazione[]) => {
        this.prenotazioni = res;
        this.loading = false;
      }, err => {
        this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero delle prenotazioni!", 4);
        this.loading = false;
      }
    )
  }
  aggiungiPrenotazione() {
    this.inserimento = true;
    this.oggi = new Date().toISOString().slice(0, 10);
    this.prenotazione = new Prenotazione();
    this.prenotazione.utente = this.utente;
  }
  modificaPrenotazione(prenotazione: Prenotazione) {
    this.inserimento = true;
    this.prenotazione = new Prenotazione();
    this.dataInizioPrenotazione = prenotazione.dataInizio.toString().substring(0, 10);
    this.dataFinePrenotazione = prenotazione.dataFine.toString().substring(0, 10);
    Object.assign(this.prenotazione, prenotazione);
  }
  annullaInserimento() {
    this.inserimento = false;
  }
  confermaInserimento() {
    this.prenotazione.dataInizio = new Date(this.dataInizioPrenotazione);
    this.prenotazione.dataFine = new Date(this.dataFinePrenotazione);
    console.log(this.prenotazione);
    var messaggio = this.validatePrenotazione();
    if (messaggio) {
      Swal.fire({
        title: 'Errore, ricontrolla i campi!',
        html: messaggio,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
    else {
      this.dataService.updatePrenotazione(this.prenotazione).subscribe(
        res => {
          Swal.fire({
            title: 'Operazione completata!',
            text: 'Prenotazione ' + (this.prenotazione.id == 0 ? 'Inserita' : 'Modificata') + ' con successo!',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
          this.inserimento = false;
          this.reloadData();
          this.prenotazione = new Prenotazione();
        }, err => {
          var messaggio: string = "";
          switch (err.status) {
            case 400:
              messaggio = "Ricontrolla i campi inseriti!";
              break;
            case 406:
              messaggio = "L'automezzo scelto non è disponibile in quelle date!";
              break;
            default:
              messaggio = "Errore durante il login";
              break
        }
          Swal.fire({
            title: 'Errore!',
            html: messaggio,
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      );
    }
  }
  stampaStato(stato: number):string {
    let stringStato: string = "";
    switch (stato) {
      case 0:
        stringStato = "Richiesta";
        break;
      case 1:
        stringStato = "Accettata";
        break;
      case 2:
        stringStato = "Rifiutata";
        break;
    }
    return stringStato;
  }
  stampaData(data: any) {
    var stringData: string = "";
    if (data instanceof Date)
      stringData = data.toLocaleDateString();
    else {
      var tempGiorno = data.substring(8, 10);
      var tempMese = data.substring(5, 7);
      var tempAnno = data.substring(0, 4);
      stringData = tempGiorno + '/' + tempMese + '/' + tempAnno;
    }
    return stringData;
  }
  validatePrenotazione(): string {
    var messaggio: string = "";
    if (!this.prenotazione.automezzo || this.prenotazione.automezzo.id <= 0)
      messaggio += "Scegliere un automezzo!<br>";
    if (!this.prenotazione.dataInizio || this.prenotazione.dataInizio.getDate() < new Date().getDate())
      messaggio += "Scegliere una data di inizio a partire da domani!<br>";
    if (!this.prenotazione.dataFine || this.prenotazione.dataFine.getDate() < this.prenotazione.dataInizio.getDate())
      messaggio += "Scegliere una data di fine a partire dal " + this.prenotazione.dataInizio.toLocaleDateString() + "!<br>";
    return messaggio;
  }
  accettaPrenotazione(prenotazione: Prenotazione) {
    Swal.fire({
      title: 'Accetta Prenotazione',
      html: "Vuoi <strong>accettare</strong> questa prenotazione?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sì',
      cancelButtonText: "No",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataService.accettaPrenotazione(prenotazione.id).subscribe(
          res => {
            Swal.fire({
              title: 'Operazione completata!',
              text: 'La prenotazione è stata accettata!',
              icon: 'success',
              confirmButtonText: 'Ok'
            });
            this.reloadData();
          }, err => {
            Swal.fire({
              title: 'Errore!',
              text: 'La prenotazione non è stata accettata a causa di un errore!',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
        )
        
      }
    });
  }
  rifiutaPrenotazione(prenotazione: Prenotazione) {
    Swal.fire({
      title: 'Rifiuta Prenotazione',
      html: "Vuoi <strong>rifiutare</strong> questa prenotazione?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sì',
      cancelButtonText: "No",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataService.rifiutaPrenotazione(prenotazione.id).subscribe(
          res => {
            Swal.fire({
              title: 'Operazione completata!',
              text: 'La prenotazione è stata rifiutata!',
              icon: 'success',
              confirmButtonText: 'Ok'
            });
            this.reloadData();
          }, err => {
            Swal.fire({
              title: 'Errore!',
              text: 'La prenotazione non è stata rifiutata a causa di un errore!',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
        )
        
      }
    })
  }

}
