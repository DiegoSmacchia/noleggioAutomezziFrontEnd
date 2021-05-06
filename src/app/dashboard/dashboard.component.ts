import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/dataService/data.service';
import { NotificationsComponent } from 'app/notifications/notifications.component';
import { SharedService } from 'app/sharedService/shared.service';
import { Utente } from 'models/Utente';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', '../../assets/scss/spinner.scss',]
})
export class DashboardComponent implements OnInit {
  loading: boolean;
  utente: Utente;

  prenotazioniInRichiesta: number;
  notifiche: string[] = [];

  constructor(private sharedService:SharedService, private dataService:DataService, private notificationsComponent: NotificationsComponent) { }

  ngOnInit() {
    this.loading = true;
    this.prenotazioniInRichiesta = 5;
    this.utente = new Utente();
    this.sharedService.checkCredentials();
    if (sessionStorage.getItem("userId") != null && sessionStorage.getItem("userPsw") != null) {
      this.dataService.checkLogin(sessionStorage.getItem("userId"), sessionStorage.getItem("userPsw")).subscribe(
        (res: Utente) => {
          this.utente = res;
          this.dataService.listNotifiche(this.utente.id).subscribe(
            (res: string[]) => {
              console.log("NOTIFICHEEEEE");
              console.table(res);
              this.notifiche = res;
            }, err => {
              this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero delle notifiche!", 4);
          this.loading = false;
            }
          )
          this.loading = false;
        }, err => {
          this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero delle informazioni!", 4);
          this.loading = false;
        }
      );
    }
    
  }

}
