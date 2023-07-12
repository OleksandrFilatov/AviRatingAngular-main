import { ApiService } from '../../services/api.service';
import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-customer-dashboard',
    templateUrl: './customer-dashboard.component.html',
    styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {

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
