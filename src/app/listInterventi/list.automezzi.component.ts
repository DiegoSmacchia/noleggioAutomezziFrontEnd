import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/dataService/data.service';
import { NotificationsComponent } from 'app/notifications/notifications.component';
import { SharedService } from 'app/sharedService/shared.service';
import { Automezzo } from 'models/Automezzo';
import Swal from 'sweetalert2'


@Component({
  selector: 'lista-automezzi',
  templateUrl: './list.automezzi.component.html',
  styleUrls: ['./list.automezzi.component.css', '../../assets/scss/spinner.scss', '../../assets/css/fab.css', '../../assets/css/icona.nessun.record.css']
})
export class ListAutomezziComponent implements OnInit {
  loading: boolean;
  menuItems: any[];
  automezzi: any[] = [];

  inserimento: boolean;
  automezzo: Automezzo;
  constructor(private sharedService: SharedService,
    private dataService: DataService,
    private notificationsComponent: NotificationsComponent) { }

  ngOnInit() {
    this.sharedService.checkCredentials();
    this.inserimento = false;
    this.reloadData();
  }
  reloadData() {
    this.loading = true;
    this.dataService.listAutomezzi().subscribe(
      (res:any) => {
        this.automezzi = res;
        this.loading = false;
      }, err => {
        this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero degli automezzi!", 4);
        this.loading = false;
      }
    )
  }
  aggiungiAutomezzo() {
    this.inserimento = true;
    this.automezzo = new Automezzo();
  }
  modificaAutomezzo(automezzo: Automezzo) {
    this.inserimento = true;
    this.automezzo = new Automezzo();
    Object.assign(this.automezzo, automezzo);
  }
  annullaInserimento() {
    this.inserimento = false;
  }
  confermaInserimento() {
    var updated: boolean = false;
    var messaggio = this.validateAutomezzo();
    if (messaggio) {
      Swal.fire({
        title: 'Errore, ricontrolla i campi!',
        html: messaggio,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
    else {
      this.dataService.updateAutomezzo(this.automezzo).subscribe(
        res => {
          Swal.fire({
            title: 'Operazione completata!',
            text: 'Automezzo ' + (this.automezzo.id == 0 ? 'Inserito' : 'Modificato') + ' con successo!',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
          this.inserimento = false;
          this.reloadData();
          this.automezzo = new Automezzo();
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
  validateAutomezzo(): string {
    var messaggio: string = "";
    if (!this.automezzo.targa)
      messaggio += "Inserire La targa!<br>";
    else {
      var filteredAutomezzi = this.automezzi.filter(item => item.targa.toUpperCase() == this.automezzo.targa.toUpperCase() && item.id != this.automezzo.id);
      if (filteredAutomezzi.length > 0)
        messaggio += "La targa " + this.automezzo.targa + " è già in uso!<br>";
    }
    if (!this.automezzo.marca)
      messaggio += "Inserire La marca!<br>";
    if (!this.automezzo.modello)
      messaggio += "Inserire il modello!<br>";
      
    if (!this.automezzo.kmAttuali || this.automezzo.kmAttuali < 0)
      messaggio += "Inserire il numero di km attuali (Maggiore di 0)!<br>";
    if (!this.automezzo.costo || this.automezzo.costo < 0)
      messaggio += "Inserire il costo (Maggiore di 0)!<br>";
    return messaggio;
  }


}
