import { Component, OnInit } from '@angular/core'
import { DataService } from './data.service'

@Component({
    selector: 'app-claims',
    templateUrl: './claims.component.html',
    styleUrls: ['./claims.component.css']
})
export class ClaimsComponent implements OnInit {
    dataStatus = 'fetching'
    paymentHistoryData = []

    constructor(
        public data: DataService
    ) { }

    ngOnInit() {
        this.data.getPaymentHistory().subscribe((resp: any) => {
            if (resp.success === true) {
                console.log(resp.data)
                this.paymentHistoryData = resp.data
                this.dataStatus = 'done'
            }
        })
    }

}
