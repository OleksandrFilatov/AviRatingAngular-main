import { Component, OnInit,OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy{
    claimBusiness: any = ''
    currentSubscription = ''
    dataStatus = 'fetching'
    subscriptionName:string
    subscription:any
    constructor(public api: ApiService) {
        
        this.api.getUserMembership().subscribe(resp => {
            if(resp.data != null){
                this.currentSubscription = resp.data.membership.title + ' Membership'
                this.api.userSubscriptionName = resp.data.membership.title
            }    
            if(resp.data == null){
                this.currentSubscription = 'Free MemberShip' 
            }
            
            
        })


        this.subscription = this.api.userMembership.subscribe((resp:any)=>{
            this.currentSubscription = resp + ' MemberShip'
            console.log(resp);
            
        })
    }

    ngOnInit() {
        // this.claimBusiness = this.api.user.claim_business
        // if(this.currentSubscription == null){
        //     if (this.api.user.business.subscription == null || this.api.user.business.subscription == '') {
        //         this.currentSubscription = 'Free MemberShip'
        //     } else 
        //     if (this.api.user.business.subscription.status == 'active') {
        //         this.currentSubscription = this.api.user.business.subscription.membership.title + ' MemberShip'
        //     } else {
        //         this.currentSubscription = 'Free MemberShip'
        //     }

        // }


        this.api.getSettings().subscribe((resp: any) => {
            this.api.homeBannerPrice = resp.data[0].home_banner_price
        })
    }

    logOut(): void {
        const check = this.api.logOut()
        if (check) {
            location.reload()
        }
    }

    claimBusniess() {
        const params = { claim_description: 'n/a' }
        this.api.claimBusiness(params).subscribe((resp: any) => {
            if (resp.success === false) {
                return false
            } else {
                const oldUser = this.api.user
                this.api.user.claim_business = 2
                this.api.user.api_token = oldUser.api_token
                localStorage.setItem('apiToken', oldUser.api_token)
                localStorage.setItem('user', JSON.stringify(this.api.user))
                this.claimBusiness = 2
            }
        })
    }
    ngOnDestroy(){
        this.subscription.unsubscribe()
    }
    
}
