import { ApiService } from './../../services/api.service'
import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    constructor(private api: ApiService) { }

    ngOnInit() {
    }

    logOut(): void {
        const check = this.api.logOut()
        if (check) {
            location.reload()
        }
    }
}
