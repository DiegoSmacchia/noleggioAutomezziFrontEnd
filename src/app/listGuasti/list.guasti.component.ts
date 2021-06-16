import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/dataService/data.service';
import { NotificationsComponent } from 'app/notifications/notifications.component';
import { SharedService } from 'app/sharedService/shared.service';
import { Automezzo } from 'models/Automezzo';
import { Guasto } from 'models/Guasto';
import { Meccanico } from 'models/Meccanico';
import { Utente } from 'models/Utente';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2'


@Component({
  selector: 'lista-guasti',
  templateUrl: './list.guasti.component.html',
  styleUrls: ['./list.guasti.component.css', '../../assets/scss/spinner.scss', '../../assets/css/fab.css', '../../assets/css/icona.nessun.record.css']
})
export class ListGuastiComponent implements OnInit {
  loading: boolean;
  guasti: Guasto[] = [];

  inserimento: boolean;
  guasto: Guasto;

  automezzi: Automezzo[] = [];
  meccanici: Meccanico[] = [];
  utente: Utente;
  dataGuasto: string;
  oggi: string;
  constructor(private sharedService: SharedService,
    private dataService: DataService,
    private notificationsComponent: NotificationsComponent) { }

  ngOnInit() {
    this.sharedService.checkCredentials();
    this.guasto = new Guasto();
    this.oggi = new Date().toISOString().slice(0, 10);
    this.inserimento = false;
    this.loading = true;
    forkJoin(
      this.dataService.checkLogin(sessionStorage.getItem("userId"), sessionStorage.getItem("userPsw")), this.dataService.listAutomezzi()).subscribe(
        (res: any[]) => {
          this.utente = res[0];
          this.automezzi = res[1];

          if (this.utente.hasPermessi) {
            this.dataService.listGuasti().subscribe(
              (res: Guasto[]) => {
                this.guasti = res;
                this.loading = false;
              }, err => {
                this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero dei guasti!", 4);
                this.loading = false;
              }
            );
          }
          else {
            this.dataService.listGuastiByIdUtente(this.utente.id).subscribe(
              (res: Guasto[]) => {
                this.guasti = res;
                this.loading = false;
              }, err => {
                this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero dei guasti!", 4);
                this.loading = false;
              }
            );
          }
          }, err => {
            this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero dei permessi!", 4);
          }
      );
      this.inserimento = false;
  }
  reloadData() {
    this.loading = true;
    if (this.utente.hasPermessi) {
      this.dataService.listGuasti().subscribe(
        (res: Guasto[]) => {
          this.guasti = res;
          this.loading = false;
        }, err => {
          this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero dei guasti!", 4);
          this.loading = false;
        }
      );
    }
    else {
      this.dataService.listGuastiByIdUtente(this.utente.id).subscribe(
        (res: Guasto[]) => {
          this.guasti = res;
          this.loading = false;
        }, err => {
          this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero dei guasti!", 4);
          this.loading = false;
        }
      );
    }
  }
  aggiungiGuasto() {
    this.inserimento = true;
    this.guasto = new Guasto();
    this.guasto.utente = this.utente;
  }
  modificaGuasto(guasto: Guasto) {
    this.inserimento = true;
    this.guasto = new Guasto();
    this.dataGuasto = guasto.data?.toString().substring(0, 10);

    Object.assign(this.guasto, guasto);
  }
  annullaInserimento() {
    this.inserimento = false;
  }
  confermaInserimento() {
    this.guasto.data = new Date(this.dataGuasto);

    var messaggio = this.validateGuasto();
    if (messaggio) {
      Swal.fire({
        title: 'Errore, ricontrolla i campi!',
        html: messaggio,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
    else {
      this.dataService.updateGuasto(this.guasto).subscribe(
        res => {
          Swal.fire({
            title: 'Operazione completata!',
            text: 'Guasto ' + (this.guasto.id == 0 ? 'Segnalato' : 'Modificato') + ' con successo!',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
          this.inserimento = false;
          this.reloadData();
          this.guasto = new Guasto();
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
  eliminaGuasto(guasto: Guasto) {
    Swal.fire({
      title: 'Eliminare il guasto?',
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
        this.dataService.deleteGuasto(guasto.id).subscribe(
          res => {
            Swal.fire({
              title: 'Eliminato!',
              html: "Guasto eliminato con successo!",
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
  validateGuasto(): string {
    var messaggio: string = "";
    if (!this.guasto.automezzo || this.guasto.automezzo.id <= 0)
      messaggio += "Scegliere un automezzo!<br>";
    if (!this.guasto.descrizione || this.guasto.descrizione == "")
      messaggio += "Inserire una descrizione!<br>";
    if (!this.guasto.data || this.guasto.data.toString() == "Invalid Date")
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

}
