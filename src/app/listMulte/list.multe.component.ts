import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/dataService/data.service';
import { NotificationsComponent } from 'app/notifications/notifications.component';
import { SharedService } from 'app/sharedService/shared.service';
import { Multa } from 'models/Multa';
import { Prenotazione } from 'models/Prenotazione';
import { Utente } from 'models/Utente';
import Swal from 'sweetalert2'


@Component({
  selector: 'lista-multe',
  templateUrl: './list.multe.component.html',
  styleUrls: ['./list.multe.component.css', '../../assets/scss/spinner.scss', '../../assets/css/fab.css', '../../assets/css/icona.nessun.record.css']
})
export class ListMulteComponent implements OnInit {
  loading: boolean;
  multe: Multa[] = [];

  inserimento: boolean;
  multa: Multa;
  dataMulta: string;
  utente: Utente;
  prenotazioni: Prenotazione[] = [];
  filteredPrenotazioni: Prenotazione[] = [];
  constructor(private sharedService: SharedService,
    private dataService: DataService,
    private notificationsComponent: NotificationsComponent) { }

  ngOnInit() {
    this.sharedService.checkCredentials();
    this.inserimento = false;
    this.loading = true;
    this.dataService.checkLogin(sessionStorage.getItem("userId"), sessionStorage.getItem("userPsw")).subscribe(
      (res: Utente) => {
        this.utente = res;
        var idUtente = this.utente.hasPermessi ? null : this.utente.id;
        this.dataService.listPrenotazioni(idUtente).subscribe(
          (res: Prenotazione[]) => {
            this.prenotazioni = res;
            this.filteredPrenotazioni = this.prenotazioni;

            this.reloadData();

          }, err => {
            this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero delle prenotazioni!", 4);
          }
        );
        }, err => {
          this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero dei permessi!", 4);
        }
    );
  }
  reloadData() {
    this.loading = true;
    this.dataService.checkLogin(sessionStorage.getItem("userId"), sessionStorage.getItem("userPsw")).subscribe(
      (res: Utente) => {
        this.utente = this.utente;
        if (this.utente?.hasPermessi) {
          this.dataService.listMulte().subscribe(
            (res:any) => {
              this.multe = res;
              this.loading = false;
            }, err => {
              this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero delle multe!", 4);
              this.loading = false;
            }
          )
        }
        else {
          this.dataService.listMulteByIdUtente(this.utente.id).subscribe(
            (res:any) => {
              this.multe = res;
              this.loading = false;
            }, err => {
              this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero delle multe!", 4);
              this.loading = false;
            }
          )
        }
      }, err => {
        this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero delle multe!", 4);
        this.loading = false;
      }
    )
    
    
  }
  aggiungiMulta() {
    this.inserimento = true;
    this.multa = new Multa();
  }
  modificaMulta(multa: Multa) {
    this.inserimento = true;
    this.multa = new Multa();
    this.dataMulta = multa.data?.toString().substring(0, 10);
    Object.assign(this.multa, multa);
  }
  annullaInserimento() {
    this.inserimento = false;
  }
  confermaInserimento() {
    this.multa.data = new Date(this.dataMulta);
    var messaggio = this.validateMulta();
    if (messaggio) {
      Swal.fire({
        title: 'Errore, ricontrolla i campi!',
        html: messaggio,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
    else {
      this.dataService.updateMulta(this.multa).subscribe(
        res => {
          Swal.fire({
            title: 'Operazione completata!',
            text: 'Multa ' + (this.multa.id == 0 ? 'Inserita' : 'Modificata') + ' con successo!',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
          this.inserimento = false;
          this.reloadData();
          this.multa = new Multa();
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

  eliminaMulta(multa: Multa) {
    Swal.fire({
      title: 'Eliminare la multa?',
      text: "Questa operazione non può essere annullata!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Elimina',
      cancelButtonText: "No",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataService.deleteMulta(multa.id).subscribe(
          res => {
            Swal.fire({
              title: 'Eliminata!',
              html: "Multa eliminata con successo!",
              icon: 'success',
              confirmButtonText: 'Ok'
            });
            this.reloadData();
            this.loading = false;
          }, err => {
            Swal.fire({
              title: 'Errore!',
              html:  "Qualcosa è andato storto, riprova!",
              icon: 'error',
              confirmButtonText: 'Ok'
            });
            this.loading = false;
          }
        );
      }
    })
  }
  
  validateMulta(): string {
    var messaggio: string = "";
    if (!this.multa.prenotazione || this.multa.prenotazione.id <= 0)
      messaggio += "Scegliere la prenotazione collegata!<br>";
    if (!this.multa.importo || this.multa.importo <= 0)
      messaggio += "Inserire un importo maggiore di zero!<br>";
    if (!this.multa.data || this.multa.data.toString() == "Invalid Date")
      messaggio += "Inserire la data!<br>";
      
    return messaggio;
  }

  stampaData(data: any) {
    var ret: string = "";
    if (data instanceof Date)
      ret = data.toLocaleDateString();
    else {
      if (data && data.length >= 10) {
        var giorno = data.substr(8, 2);
        var mese = data.substr(5, 2);
        var anno = data.substr(0, 4);

        ret = giorno + "/" + mese + "/" + anno;
      }
    }

    return ret;
  }

  filterPrenotazioni() {
    this.multa.data = new Date(this.dataMulta);
    this.multa.data.setHours(0);
    this.filteredPrenotazioni = this.prenotazioni;

    this.filteredPrenotazioni = this.filteredPrenotazioni.filter(item => new Date(item.dataInizio).getTime() <= new Date(this.multa.data).getTime() && new Date(item.dataFine).getTime() >= new Date(this.multa.data).getTime())
  }

}
