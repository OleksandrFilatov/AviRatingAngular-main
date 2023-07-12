import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public api: ApiService) { }

  ngOnInit() {
  }
  logOut(): void {
    const check = this.api.logOut()
    if (check) {
        location.reload()
    }
}
}
