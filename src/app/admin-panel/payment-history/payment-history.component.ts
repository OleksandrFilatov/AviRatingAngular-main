import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
    selector: 'app-payment-history',
    templateUrl: './payment-history.component.html',
    styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {
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
