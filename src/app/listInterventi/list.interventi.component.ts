import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/dataService/data.service';
import { NotificationsComponent } from 'app/notifications/notifications.component';
import { SharedService } from 'app/sharedService/shared.service';
import { Automezzo } from 'models/Automezzo';
import { Guasto } from 'models/Guasto';
import { Intervento } from 'models/Intervento';
import { Meccanico } from 'models/Meccanico';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2'


@Component({
  selector: 'lista-interventi',
  templateUrl: './list.interventi.component.html',
  styleUrls: ['./list.interventi.component.css', '../../assets/scss/spinner.scss', '../../assets/css/fab.css', '../../assets/css/icona.nessun.record.css']
})
export class ListInterventiComponent implements OnInit {
  loading: boolean;
  interventi: Intervento[] = [];

  inserimento: boolean;
  intervento: Intervento;

  automezzi: Automezzo[] = [];
  meccanici: Meccanico[] = [];
  guasti: Guasto[] = [];
  filteredGuasti: Guasto[] = [];
  dataInizioIntervento: string;
  dataFineIntervento: string;
  constructor(private sharedService: SharedService,
    private dataService: DataService,
    private notificationsComponent: NotificationsComponent) { }

  ngOnInit() {
    this.sharedService.checkCredentials();
    this.intervento = new Intervento();
    this.inserimento = false;
    this.loading = true;
    forkJoin(
      this.dataService.listAutomezzi(), this.dataService.listMeccanici(), this.dataService.listGuasti()).subscribe(
        (res: any[]) => {
          this.automezzi = res[0];
          this.meccanici = res[1];
          this.guasti = res[2];
          this.filteredGuasti = res[2];
        }, err => {
          this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero di automezzi, meccanici e guasti!", 4);
        }
      )
    this.reloadData();
  }
  reloadData() {
    this.loading = true;
    this.dataService.listInterventi().subscribe(
      (res: Intervento[]) => {
        this.interventi = res;
        this.loading = false;
      }, err => {
        this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero degli interventi!", 4);
        this.loading = false;
      }
    );
  }
  aggiungiIntervento() {
    this.inserimento = true;
    this.intervento = new Intervento();
  }
  modificaIntervento(intervento: Intervento) {
    this.inserimento = true;
    this.intervento = new Intervento();
    this.dataInizioIntervento = intervento.dataInizio?.toString().substring(0, 10);
    this.dataFineIntervento = intervento.dataFine?.toString().substring(0, 10);
    if (!intervento.guasto)
      intervento.guasto = new Guasto();
    Object.assign(this.intervento, intervento);
  }
  annullaInserimento() {
    this.inserimento = false;
  }
  confermaInserimento() {
    this.intervento.dataInizio = new Date(this.dataInizioIntervento);
    this.intervento.dataFine = new Date(this.dataFineIntervento);
    var updated: boolean = false;
    var messaggio = this.validateIntervento();
    if (messaggio) {
      Swal.fire({
        title: 'Errore, ricontrolla i campi!',
        html: messaggio,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
    else {
      this.dataService.updateIntervento(this.intervento).subscribe(
        res => {
          Swal.fire({
            title: 'Operazione completata!',
            text: 'Automezzo ' + (this.intervento.id == 0 ? 'Inserito' : 'Modificato') + ' con successo!',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
          this.inserimento = false;
          this.reloadData();
          this.intervento = new Intervento();
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
  eliminaIntervento(intervento: Intervento) {
    Swal.fire({
      title: 'Eliminare lìintervento?',
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
        this.dataService.deleteIntervento(intervento.id).subscribe(
          res => {
            Swal.fire({
              title: 'Eliminato!',
              html: "Intervento eliminato con successo!",
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
  validateIntervento(): string {
    var messaggio: string = "";
    console.log(this.intervento.dataInizio);
    if (!this.intervento.automezzo || this.intervento.automezzo.id <= 0)
      messaggio += "Scegliere un automezzo!<br>";
    if (!this.intervento.meccanico || this.intervento.meccanico.id <= 0)
      messaggio += "Scegliere un meccanico!<br>";
    if (!this.intervento.dataInizio || this.intervento.dataInizio.toString() == "Invalid Date")
      messaggio += "Inserire la data di inizio!<br>";
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
  filtraGuasti() {
    this.filteredGuasti = this.guasti;
    this.filteredGuasti = this.filteredGuasti.filter(item => item.automezzo.id == this.intervento.automezzo.id);
  }

}
