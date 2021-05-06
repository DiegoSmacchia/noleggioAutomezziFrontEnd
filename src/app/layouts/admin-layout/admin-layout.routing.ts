import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { LoginComponent } from 'app/login/login.component';
import { AccountComponent } from 'app/account/account.component';
import { ListAutomezziComponent } from 'app/listAutomezzi/list.automezzi.component';
import { ListPrenotazioniComponent } from 'app/listPrenotazioni/list.prenotazioni.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'listaAutomezzi', component: ListAutomezziComponent },
    { path: 'listaPrenotazioni', component: ListPrenotazioniComponent },
    { path: 'login', component: LoginComponent },
    { path: 'account', component: AccountComponent },
];
