import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { LoginComponent } from 'app/login/login.component';
import { ListAutomezziComponent } from 'app/listAutomezzi/list.automezzi.component';
import { ListPrenotazioniComponent } from 'app/listPrenotazioni/list.prenotazioni.component';
import { ListMeccaniciComponent } from 'app/listMeccanici/list.meccanici.component';
import { ListScadenzeComponent } from 'app/listScadenze/list.scadenze.component';
import { ListInterventiComponent } from 'app/listInterventi/list.interventi.component';
import { ListGuastiComponent } from 'app/listGuasti/list.guasti.component';
import { ListMulteComponent } from 'app/listMulte/list.multe.component';
import { UtenteComponent } from 'app/utente/utente.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'listaAutomezzi', component: ListAutomezziComponent },
    { path: 'listaPrenotazioni', component: ListPrenotazioniComponent },
    { path: 'listaMeccanici', component: ListMeccaniciComponent },
    { path: 'listaScadenze', component: ListScadenzeComponent },
    { path: 'listaInterventi', component: ListInterventiComponent },
    { path: 'listaGuasti', component: ListGuastiComponent },
    { path: 'listaMulte', component: ListMulteComponent },
    { path: 'login', component: LoginComponent },
    { path: 'account', component: UtenteComponent },
];
