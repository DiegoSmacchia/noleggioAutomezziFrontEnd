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

  constructor(private sharedService: SharedService,
    private dataService: DataService,
    private notificationsComponent: NotificationsComponent) { }

  ngOnInit() {
    this.sharedService.checkCredentials();
    this.inserimentoAutomezzoScadenza = false;
    this.inserimentoScadenza = false;
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
        this.autoScadenza = res[1];
        this.loading = false;
      }, err => {
        this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero delle scadenze!", 4);
        this.loading = false;
      }
    )
  }
  aggiungiScadenza() {
    console.log("JJJJ")
    this.inserimentoScadenza = true;
    this.scadenza = new Scadenza();
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
  validateScadenza(): string {
    var messaggio: string = "";
    if (!this.scadenza.scadenza)
      messaggio += "Inserire La scadenza!<br>";

    return messaggio;
  }

  aggiungiAutomezzoScadenza() {
    this.inserimentoAutomezzoScadenza = true;
    this.autoScadenza = new AutomezzoScadenza();
  }
  modificaAutomezzoScadenza(scadenza: AutomezzoScadenza) {
    this.inserimentoAutomezzoScadenza = true;
    this.autoScadenza = new AutomezzoScadenza();
    Object.assign(this.autoScadenza, scadenza);
  }
  annullaInserimentoAutomezzoScadenza() {
    this.inserimentoAutomezzoScadenza = false;
  }
  confermaInserimentoAutomezzoScadenza() {
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
            text: 'Scadenza ' + (this.scadenza.id == 0 ? 'Inserita' : 'Modificata') + ' con successo!',
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


}
