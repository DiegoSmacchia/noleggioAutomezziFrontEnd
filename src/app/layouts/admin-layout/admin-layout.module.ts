import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { LoginComponent } from 'app/login/login.component';
import { SharedService } from 'app/sharedService/shared.service';
import { ListAutomezziComponent } from 'app/listAutomezzi/list.automezzi.component';
import { ListPrenotazioniComponent } from 'app/listPrenotazioni/list.prenotazioni.component';
import { ListMeccaniciComponent } from 'app/listMeccanici/list.meccanici.component';
import { ListScadenzeComponent } from 'app/listScadenze/list.scadenze.component';
import { ListInterventiComponent } from 'app/listInterventi/list.interventi.component';
import { ListGuastiComponent } from 'app/listGuasti/list.guasti.component';
import { ListMulteComponent } from 'app/listMulte/list.multe.component';
import { UtenteComponent } from 'app/utente/utente.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  declarations: [
    DashboardComponent,

    ListAutomezziComponent,
    LoginComponent,
    UtenteComponent,
    ListPrenotazioniComponent,
    ListMeccaniciComponent,
    ListScadenzeComponent,
    ListInterventiComponent,
    ListMulteComponent,
    ListGuastiComponent
  ],
  providers: []
})

export class AdminLayoutModule {}
