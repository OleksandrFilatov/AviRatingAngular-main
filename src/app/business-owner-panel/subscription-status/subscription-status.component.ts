import { Subscription } from 'rxjs';
import { Component, OnInit} from '@angular/core';
import {  ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service'

@Component({
    selector: 'app-subscription-status',
    templateUrl: './subscription-status.component.html',
    styleUrls: ['./subscription-status.component.css']
})
export class subscriptionStatusComponent implements OnInit {
    
    status = ''
    subscriptionName = ''
    subscription:any
    constructor(

        private route: ActivatedRoute,
        public apiService: ApiService,
    ) {
        this.status = this.route.snapshot.paramMap.get('status')
        this.subscriptionName = this.route.snapshot.paramMap.get('name')
        if(this.status === "success" && this.subscriptionName != null){
            this.apiService.userMembership.next(this.subscriptionName)
            
            //let currentUserDataStr = localStorage.getItem("user"); 
           
            //let currentUserData = JSON.parse(currentUserDataStr);
           
            //currentUserData.business.subscription.membership.title = this.subscriptionName
            
            //let newUserDataStr = JSON.stringify(currentUserData)
            //localStorage.setItem("user", newUserDataStr);
            
            //localStorage.setItem('user.business.subscription.membership.title',this.subscriptionName)
        }
    }

    ngOnInit() {
    }
    
}
