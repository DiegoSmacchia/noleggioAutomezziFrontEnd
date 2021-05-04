import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'lista-automezzi',
  templateUrl: './list.automezzi.component.html',
  styleUrls: ['./list.automezzi.component.css']
})
export class ListAutomezziComponent implements OnInit {
  menuItems: any[];
  automezzi: any[] = [];
  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.listAutomezzi().subscribe(
      (res:any) => {
        this.automezzi = res;
        console.log(res);
      }, err => {
        console.log(err);
      }
    )
  }

  listAutomezzi() {
    return this.httpClient.get("https://localhost:44377/api/automezzi/list");
  }
}
