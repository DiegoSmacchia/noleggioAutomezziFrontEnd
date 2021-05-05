import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'app/dataService/data.service';
import { NotificationsComponent } from 'app/notifications/notifications.component';
import { DH_UNABLE_TO_CHECK_GENERATOR } from 'constants';
import { Utente } from 'models/Utente';
import Swal from 'sweetalert2'


declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    onlyAdmin: boolean;
}
export const ROUTES: RouteInfo[] = [
    { path: '/account', title: 'Account',  icon: 'account_circle', class: '', onlyAdmin: false },
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '', onlyAdmin: false },
    { path: '/listaAutomezzi', title: 'Lista Automezzi', icon: 'directions_car', class: '', onlyAdmin: true }
]
   

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  utente: Utente;
  constructor(private dataService: DataService, private notificationsComponent: NotificationsComponent, private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.cambiaUtente();
  }
  cambiaUtente() {
    this.dataService.checkLogin(sessionStorage.getItem("userId"), sessionStorage.getItem("userPsw")).subscribe(
      (res: Utente) => {
        this.utente = res;
      }, err => {
        this.utente = new Utente();
        this.notificationsComponent.showNotification("top", "center", "Errore durante il recupero dei permessi!", 4);
      }
    );
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  }
  canBeViewed(item: RouteInfo) {
    var canBeViewed: boolean = false;
    if (! this.utente || this.utente.id == 0 || sessionStorage.getItem("userId") != this.utente.id.toString() || sessionStorage.getItem("userPsw") != this.utente.password)
      this.cambiaUtente();
    else {
      if (item.onlyAdmin) {
        if (this.utente.hasPermessi)
          canBeViewed = true;
      }
      else
      canBeViewed = true;
    } 
    return canBeViewed;

  }
  logOut() {
    Swal.fire({
      title: 'Effettuare il logout?',
      text: "Verrai reindirizzato alla pagina di login!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Logout',
      cancelButtonText: "No",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("userPsw");
        this.router.navigateByUrl("login");
      }
    })
  }
}

