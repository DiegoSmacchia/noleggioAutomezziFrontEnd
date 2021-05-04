import { Component} from '@angular/core';
import { SharedService } from './sharedService/sharedService';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private sharedService: SharedService){}

}
