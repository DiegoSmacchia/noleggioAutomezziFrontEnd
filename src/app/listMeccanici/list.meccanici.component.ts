import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/dataService/data.service';
import { NotificationsComponent } from 'app/notifications/notifications.component';
import { SharedService } from 'app/sharedService/shared.service';
import { Meccanico } from 'models/Meccanico';
import Swal from 'sweetalert2'


@Component({
  selector: 'lista-meccanici',
  templateUrl: './list.meccanici.component.html',
  styleUrls: ['./list.meccanici.component.css', '../../assets/scss/spinner.scss', '../../assets/css/fab.css', '../../assets/css/icona.nessun.record.css']
})
export class ListMeccaniciComponent implements OnInit {
  loading: boolean;
  menuItems: Meccanico[];
  meccanici: Meccanico[] = [];

  inserimento: boolean;
  meccanico: Meccanico;
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
    this.dataService.listMeccanici().subscribe(
      (res:Meccanico[]) => {
        this.meccanici = res;
        this.loading = false;
      }, err => {
        this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero dei meccanici!", 4);
        this.loading = false;
      }
    )
  }
  aggiungiMeccanico() {
    this.inserimento = true;
    this.meccanico = new Meccanico();
  }
  modificaMeccanico(meccanico: Meccanico) {
    this.inserimento = true;
    this.meccanico = new Meccanico();
    Object.assign(this.meccanico, meccanico);
  }
  annullaInserimento() {
    this.inserimento = false;
  }
  confermaInserimento() {
    var messaggio = this.validateMeccanico();
    if (messaggio) {
      Swal.fire({
        title: 'Errore, ricontrolla i campi!',
        html: messaggio,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
    else {
      this.dataService.updateMeccanico(this.meccanico).subscribe(
        res => {
          Swal.fire({
            title: 'Operazione completata!',
            text: 'Meccanico ' + (this.meccanico.id == 0 ? 'Inserito' : 'Modificato') + ' con successo!',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
          this.inserimento = false;
          this.reloadData();
          this.meccanico = new Meccanico();
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
  eliminaMeccanico(meccanico: Meccanico) {
    Swal.fire({
      title: 'Eliminare il meccanico?',
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
        this.dataService.deleteMeccanico(meccanico.id).subscribe(
          res => {
            Swal.fire({
              title: 'Eliminato!',
              html: "Meccanico eliminato con successo!",
              icon: 'success',
              confirmButtonText: 'Ok'
            });
            this.reloadData();
            this.loading = false;
          }, err => {
            var messaggio: string;
            switch (err.status) {
              case 409:
                messaggio = "Il meccanico è collegato almeno ad un intervento!";
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
  validateMeccanico(): string {
    var messaggio: string = "";
    if (!this.meccanico.ragioneSociale)
      messaggio += "Inserire La Ragione Sociale!<br>";
    
    if (!this.meccanico.telefono)
      messaggio += "Inserire il numero di telefono!<br>";
    if (!this.meccanico.indirizzo)
      messaggio += "Inserire l'indirizzo!<br>";

    return messaggio;
  }

}
