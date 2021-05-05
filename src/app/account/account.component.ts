import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/dataService/data.service';
import { SharedService } from 'app/sharedService/shared.service';


@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  menuItems: any[];
  automezzi: any[] = [];
  constructor(private sharedService: SharedService,
    private dataService: DataService) { }

  ngOnInit() {
    this.sharedService.checkCredentials();
  }


}
