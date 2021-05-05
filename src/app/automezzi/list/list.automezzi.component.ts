import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/dataService/data.service';
import { SharedService } from 'app/sharedService/shared.service';


@Component({
  selector: 'lista-automezzi',
  templateUrl: './list.automezzi.component.html',
  styleUrls: ['./list.automezzi.component.css']
})
export class ListAutomezziComponent implements OnInit {
  menuItems: any[];
  automezzi: any[] = [];
  constructor(private sharedService: SharedService,
    private dataService: DataService) { }

  ngOnInit() {
    this.sharedService.checkCredentials();
    this.dataService.listAutomezzi().subscribe(
      (res:any) => {
        this.automezzi = res;
        console.log(res);
      }, err => {
        console.log(err);
      }
    )
  }


}
