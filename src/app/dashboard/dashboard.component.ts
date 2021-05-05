import { Component, OnInit } from '@angular/core';
import { SharedService } from 'app/sharedService/shared.service';
import * as Chartist from 'chartist';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private sharedService:SharedService) { }

  ngOnInit() {
    this.sharedService.checkCredentials();
  }

}
