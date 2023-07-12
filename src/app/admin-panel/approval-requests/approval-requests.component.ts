import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { Component, OnInit, TemplateRef } from '@angular/core'
import { DataService } from './data.service'
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-approval-requests',
    templateUrl: './approval-requests.component.html',
    styleUrls: ['./approval-requests.component.scss']
})
export class ApprovalRequestsComponent implements OnInit {
    approvalStatus: any = {
        status: ''
    }
    requestList: any = []
    dataStatus = 'onway'
    selectedId: any
    selectedIndex: any
    modalRef: BsModalRef
    constructor(
        public ds: DataService,
        public alert: IAlertService,
        private ms: BsModalService,
    ) {
        this.getList()
     }

    ngOnInit() {
    }

    getList() {
        this.dataStatus = 'fetching'
        this.ds.getList(this.approvalStatus).subscribe((resp: any) => {
            if (resp.success == false) {
                this.alert.error(resp.error.general)

                return false
            } else {
                this.requestList = resp.data
                this.alert.success('List generated Successfully!')
                this.dataStatus = 'done'
            }
        })
    }

    approveRequestConfirmation(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    rejectRequestConfirmation(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    acceptRequest() {
        const param = {
            id: this.selectedId
        }
        this.ds.acceptRequest(param).subscribe((resp: any) => {
            if (resp.success == false) {
                this.alert.error(resp.error.general)

                return false
            } else {
                this.alert.success('Request Accepted successfully')
                this.requestList.splice(this.selectedIndex, 1)
            }
            this.modalRef.hide()
        })
    }

    rejectRequest() {
        const param = {
            id: this.selectedId
        }
        this.ds.rejectRequest(param).subscribe((resp: any) => {
            if (resp.success == false) {
                this.alert.error(resp.error.general)

                return false
            } else {
                this.alert.success('Request Rejected successfully')
                this.requestList[this.selectedIndex].admin_approved = 'rejected'
            }
            this.modalRef.hide()
        })
    }
}
