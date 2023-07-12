import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from './data.service';

@Component({
    selector: 'app-available-replies',
    templateUrl: './available-replies.component.html',
    styleUrls: ['./available-replies.component.css']
})
export class AvailableRepliesComponent implements OnInit {
    respData: any
    dataStatus = false
    modalRef: BsModalRef
    reviewPriceList: any;
    constructor(
        private ds: DataService,
        private api: ApiService,
        private ms: BsModalService,
        private alert: IAlertService,
    ) {

    }


    ngOnInit() {
        this.ds.replies().subscribe((resp: any) => {
            this.respData = resp.data
            this.dataStatus = true
            console.log(this.respData);

            if (this.respData.business_owner_reply == null) {
                this.ds.reviewPriceList().subscribe((resp: any) => {
                    if (resp.success == true) {
                        this.reviewPriceList = resp.data
                        console.log('review price list=', this.reviewPriceList)

                    }
                })
            }
        })


    }
    purchaseModal(Template: TemplateRef<any>) {
        this.modalRef = this.ms.show(
            Template,
            {
                class: 'modal-lg modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    purchase(data: any) {
        // purchase replies call
        this.ds.buyReplies({ id: data}).subscribe((resp: any) => {
            if (resp.success == true) {
                console.log('data', resp.data)
                window.location = resp.data
            } else {
                this.alert.error(resp.errors.general)
            }
        })
        // purchase replies call end
    }

    cancelButton() {
        this.modalRef.hide()
    }
}