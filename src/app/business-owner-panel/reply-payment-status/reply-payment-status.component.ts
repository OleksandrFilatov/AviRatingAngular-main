import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-reply-payment-status',
    templateUrl: './reply-payment-status.component.html',
    styleUrls: ['./reply-payment-status.component.css']
})
export class ReplyPaymentStatusComponent implements OnInit {
    status = ''
    constructor(private route: ActivatedRoute) {

        this.status = this.route.snapshot.paramMap.get('status')
    }
    ngOnInit() {
    }

}
