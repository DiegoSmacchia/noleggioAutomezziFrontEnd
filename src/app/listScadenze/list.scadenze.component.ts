import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/dataService/data.service';
import { NotificationsComponent } from 'app/notifications/notifications.component';
import { SharedService } from 'app/sharedService/shared.service';
import { Automezzo } from 'models/Automezzo';
import { AutomezzoScadenza } from 'models/AutomezzoScadenza';
import { Scadenza } from 'models/Scadenza';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2'


@Component({
  selector: 'lista-scadenze',
  templateUrl: './list.scadenze.component.html',
  styleUrls: ['./list.scadenze.component.css', '../../assets/scss/spinner.scss', '../../assets/css/fab.css', '../../assets/css/icona.nessun.record.css']
})
export class ListScadenzeComponent implements OnInit {
  loading: boolean;
  menuItems: any[];
  autoScadenze: AutomezzoScadenza[] = [];
  scadenze: Scadenza[] = [];
  automezzi: Automezzo[];

  inserimentoAutomezzoScadenza: boolean;
  inserimentoScadenza: boolean;
  autoScadenza: AutomezzoScadenza;
  scadenza: Scadenza;

  tempDataInizio: string;
  tempDataFine: string;
  tempDataPagamento: string;

  constructor(private sharedService: SharedService,
    private dataService: DataService,
    private notificationsComponent: NotificationsComponent) { }

  ngOnInit() {
    this.sharedService.checkCredentials();
    this.inserimentoAutomezzoScadenza = false;
    this.inserimentoScadenza = false;
    this.scadenza = new Scadenza();
    this.autoScadenza = new AutomezzoScadenza();
    this.dataService.listAutomezzi().subscribe(
      (res: Automezzo[]) => {
        this.automezzi = res;
      }, err => {
        this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero degli automezzi!", 4);
      }
    );
    this.reloadData();
  }
  reloadData() {
    this.loading = true;
    forkJoin(
    this.dataService.listScadenze(), this.dataService.listAutomezziScadenze(0)).subscribe(
      (res:any[]) => {
        this.scadenze = res[0];
        this.autoScadenze = res[1];
        console.log(this.autoScadenze);
        this.loading = false;
      }, err => {
        this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero delle scadenze!", 4);
        this.loading = false;
      }
    )
  }
  aggiungiScadenza() {
    this.scadenza = new Scadenza();
    this.inserimentoScadenza = true;
  }
  modificaScadenza(scadenza: Scadenza) {
    this.inserimentoScadenza = true;
    this.scadenza = new Scadenza();
    Object.assign(this.scadenza, scadenza);
  }
  annullaInserimentoScadenza() {
    this.inserimentoScadenza = false;
  }
  confermaInserimentoScadenza() {
    var messaggio = this.validateScadenza();
    if (messaggio) {
      Swal.fire({
        title: 'Errore, ricontrolla i campi!',
        html: messaggio,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
    else {
      this.dataService.updateScadenza(this.scadenza).subscribe(
        res => {
          Swal.fire({
            title: 'Operazione completata!',
            text: 'Scadenza ' + (this.scadenza.id == 0 ? 'Inserita' : 'Modificata') + ' con successo!',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
          this.inserimentoScadenza = false;
          this.reloadData();
          this.scadenza = new Scadenza();
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
  deleteScadenza(scadenza: Scadenza) {
    Swal.fire({
      title: 'Eliminare la scadenza?',
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
        this.dataService.deleteScadenza(scadenza.id).subscribe(
          res => {
            Swal.fire({
              title: 'Eliminata!',
              html: "Scadenza eliminata con successo!",
              icon: 'success',
              confirmButtonText: 'Ok'
            });
            this.reloadData();
            this.loading = false;
          }, err => {
            var messaggio: string;
            switch (err.status) {
              case 409:
                messaggio = "La scadenza è utilizzata da alcuni automezzi!";
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
    })
  }

  validateScadenza(): string {
    var messaggio: string = "";
    if (!this.scadenza.scadenza)
      messaggio += "Inserire La scadenza!<br>";

    return messaggio;
  }

  aggiungiAutomezzoScadenza() {
    this.autoScadenza = new AutomezzoScadenza();
    this.inserimentoAutomezzoScadenza = true;
  }
  modificaAutomezzoScadenza(scadenza: AutomezzoScadenza) {
    this.tempDataInizio = scadenza.dataInizio.toString().substr(0, 10);
    this.tempDataFine = scadenza.dataFine?.toString().substr(0, 10);
    this.tempDataPagamento = scadenza.dataPagamento?.toString().substr(0, 10);
    
    this.inserimentoAutomezzoScadenza = true;
    this.autoScadenza = new AutomezzoScadenza();
    Object.assign(this.autoScadenza, scadenza);
  }
  annullaInserimentoAutomezzoScadenza() {
    this.inserimentoAutomezzoScadenza = false;
  }
  confermaInserimentoAutomezzoScadenza() {
    this.autoScadenza.dataInizio = new Date(this.tempDataInizio);
    this.autoScadenza.dataFine = new Date(this.tempDataFine);
    this.autoScadenza.dataPagamento = new Date(this.tempDataPagamento);

    var messaggio = this.validateAutomezzoScadenza();
    if (messaggio) {
      Swal.fire({
        title: 'Errore, ricontrolla i campi!',
        html: messaggio,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
    else {
      this.dataService.updateAutomezzoScadenza(this.autoScadenza).subscribe(
        res => {
          Swal.fire({
            title: 'Operazione completata!',
            text: 'Scadenza ' + (this.autoScadenza.id == 0 ? 'Inserita' : 'Modificata') + ' con successo!',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
          this.inserimentoAutomezzoScadenza = false;
          this.reloadData();
          this.autoScadenza = new AutomezzoScadenza();
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
  deleteAutomezzoScadenza(scadenza: AutomezzoScadenza) {
    Swal.fire({
      title: 'Eliminare la scadenza?',
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
        this.dataService.deleteAutomezzoScadenza(scadenza.id).subscribe(
          res => {
            Swal.fire({
              title: 'Eliminata!',
              html: "Scadenza eliminata con successo!",
              icon: 'success',
              confirmButtonText: 'Ok'
            });
            this.reloadData();
            this.loading = false;
          }, err => {   
            Swal.fire({
              title: 'Errore!',
              html: "Qualcosa è andato storto, riprova!",
              icon: 'error',
              confirmButtonText: 'Ok'
            });
            this.loading = false;
          }
        );
      }
    })
  }

  validateAutomezzoScadenza(): string {
    var messaggio: string = "";
    if (!this.autoScadenza.scadenza)
      messaggio += "Inserire La scadenza!<br>";
    if (!this.autoScadenza.automezzo)
      messaggio += "Inserire l'automezzo!<br>";
    if (!this.autoScadenza.dataInizio)
      messaggio += "Inserire La Data di inizio!<br>";
    if (!this.autoScadenza.dataFine && !this.autoScadenza.kmIniziali)
      messaggio += "Inserire la data di fine o i km iniziali!<br>";

    return messaggio;
  }

  stampaData(data: any) {
    var ret:string = "";
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
