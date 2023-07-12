import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { DataService } from './data.service'
import { ApiService } from 'src/app/services/api.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { ConstantsService } from 'src/app/services/constants.service'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { BsModalService } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal'


@Component({
    selector: 'app-subscriptions',
    templateUrl: './subscriptions.component.html',
    styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
    //subscriptionList = ConstantsService.SUBSCRIPTION_PLANS
    dataStatus = 'inprogress'
    subscriptionList: any = []
    currentSubscription = ''
    subscriptionStatus = 'inactive'
    modalRef: BsModalRef
    userSubscription
    constructor(
        public ds: DataService,
        public api: ApiService,
        public ui: UIHelpers,
        public cs: ConstantsService,
        private alert: IAlertService,
        private ms: BsModalService
    ) {
        this.api.getUserMembership().subscribe(resp => {
            if(resp.data != null){
                this.currentSubscription = resp.data.membership.title + ' Membership'
                if(resp.data.membership.id != 1){
                    this.subscriptionStatus = 'active'
                }    
            }    
            if(resp.data == null){
                this.currentSubscription = 'Free MemberShip' 
            }
            
            
        })

        this.ds.subscriptions().subscribe((resp: any) => {
            this.subscriptionList = resp.data
            this.dataStatus = 'done'
        })

        if(this.api.userSubscriptionName !== ""){
            this.currentSubscription = this.api.userSubscriptionName
        }

        
    }

    ngOnInit() {

        
        // if (this.api.user.business.subscription == null || this.api.user.business.subscription == '') {
        //     this.currentSubscription = 'Free MemberShip'
        // } else if (this.api.user.business.subscription.status == 'active') {
        //     this.subscriptionStatus = 'active'
        //     this.currentSubscription = this.api.user.business.subscription.membership.title + ' MemberShip'
        // }
     }
     confirmingModal(template: TemplateRef<any>) {
        
        this.modalRef = this.ms.show(template, { class: 'modal-sm website' })
    }
   
    setSubscription(subId,index) {
        const params = {
            membership_id: subId
        }

        if(subId == 1 ){
            this.ds.freeSubscription(params).subscribe((resp:any)=>{
                if(resp.success == true){
                    this.alert.success('Free subscription successfully')
                    this.subscriptionList.splice(index,1)
                }else{
                    this.alert.error(resp.errors.general)
                }
            })
        }else{
        this.ds.setSubscriptions(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)

                    return false
                } else {
                    if (resp.data.prev_subscription == null) {
                        window.location = resp.data.redirect_url
                    } else {
                        if(confirm("Are you sure to upgarde subscription?")) {
                            window.location = resp.data.redirect_url
                        }
                    }

                    //  window.location = resp.data
                }
            })
        }    
    }

    unSubscribe() {
        
        const params = {
            
        }
        this.ds.unSubscribe(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()
                    return false
                } else {
                    this.modalRef.hide()
                    this.api.user.business.subscription = null
                    localStorage.setItem('user', JSON.stringify(this.api.user))
                    window.location.reload();
                }
            })
    }
}
