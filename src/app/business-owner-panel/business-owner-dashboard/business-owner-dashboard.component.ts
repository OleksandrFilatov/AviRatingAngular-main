import { ApiService } from '../../services/api.service';
import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-business-owner-dashboard',
    templateUrl: './business-owner-dashboard.component.html',
    styleUrls: ['./business-owner-dashboard.component.css']
})
export class BusinessOwnerDashboardComponent implements OnInit {

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
