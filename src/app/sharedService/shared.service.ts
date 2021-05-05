import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { DataService } from "app/dataService/data.service";

@Injectable()
export class SharedService {

  constructor(private dataService: DataService, private router: Router) { }
  
  checkCredentials() {
    var authorized: boolean = false;
    if (sessionStorage.getItem("userId") && sessionStorage.getItem("userPsw")) {
      this.dataService.checkLogin(sessionStorage.getItem("userId"), sessionStorage.getItem("userPsw")).subscribe(
        res => {
          authorized = true;
        }, err => {
          sessionStorage.removeItem("userId");
          sessionStorage.removeItem("userPsw");
          this.router.navigateByUrl("login");
        }
      );
    }
    else {
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("userPsw");
      this.router.navigateByUrl("login");
    }
  }

}
