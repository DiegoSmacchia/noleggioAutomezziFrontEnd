import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ListAutomezziComponent } from 'app/automezzi/list/list.automezzi.component';
import { LoginComponent } from 'app/login/login.component';
import { AccountComponent } from 'app/account/account.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'listaAutomezzi', component: ListAutomezziComponent },
    { path: 'login', component: LoginComponent },
    { path: 'account', component: AccountComponent },
];
