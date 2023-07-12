import { ConstantsService } from '../../services/constants.service'
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { DataService } from './data.service'
import * as moment from 'moment'



@Component({
    selector: 'app-business-claims',
    templateUrl: './business-claims-requests.component.html',
    styleUrls: ['./business-claims-requests.component.css']
})
export class BusinessClaimsRequestsComponent implements OnInit {

    dataStatus = 'fetching'
    dataList = []
    dataForm: FormGroup
    moment = moment
    selectedIndex: any
    modalRef: BsModalRef
    selectedId: any
    selectedIds = []
    constructor(
        public cs: ConstantsService,
        private adminApi: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,

    ) {
        this.dataForm = this.fb.group({
            id: new FormControl(null),
            response_note: new FormControl(null, [Validators.required]),
        })

    }
    addDltIds(id) {
        id = +id
        const index = this.selectedIds.findIndex(d => d == id)
        if (index > -1) {
            this.selectedIds.splice(index, 1)
        } else {
            this.selectedIds.push(id)
        }
    }
    ngOnInit() {
        this.adminApi.get().subscribe((resp: any) => {
            if (resp.success === true) {
                this.dataList = resp.data
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.dataForm.controls
    }
    approveConfirmation(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    rejectConfirmation(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    approveSelectedConfirmation(template: TemplateRef<any>) {
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    rejectSelectedConfirmation(template: TemplateRef<any>) {
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }


    selectAll() {
        this.selectedIds = []
        this.dataList.forEach((resp: any) => {
            if (resp.status == 'pending') {
                this.selectedIds.push(resp.id)
            }
        })
        console.log('slect all', this.selectedIds);

    }
    checkIfExist(value: any) {
        const index = this.selectedIds.findIndex(d => d == value)
        if (index > -1) {
            return true
        } else {
            return false
        }

    }
    rejectRequest(id: any, index) {
        const params = {
            ids: [this.selectedId]
        }
        let status = this.adminApi.rejectClaim(params)
        status.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.modalRef.hide()
                return false
            } else {
                this.alert.success('Request Rejected successfully!!')
                const selectedIdsArrayIndex = this.selectedIds.findIndex(d => +d == +this.selectedId)
                if (selectedIdsArrayIndex > -1) {
                    this.selectedIds.splice(selectedIdsArrayIndex, 1)
                }
                const deletingIndex = this.dataList.findIndex((d: any) => {
                    return d.id === this.selectedId
                })
                this.dataList.splice(deletingIndex, 1)
                this.modalRef.hide()
            }
        })
    }

    acceptRequest(id: any, index) {
        const params = {
            ids: [this.selectedId]
        }
        let status = this.adminApi.approveRequest(params)
        status.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.modalRef.hide()
                return false
            } else {
                this.alert.success('Request Approved successfully!!')
                const selectedIdsArrayIndex = this.selectedIds.findIndex(d => +d == +this.selectedId)
                if (selectedIdsArrayIndex > -1) {
                    this.selectedIds.splice(selectedIdsArrayIndex, 1)
                }
                const deletingIndex = this.dataList.findIndex((d: any) => {
                    return d.id === this.selectedId
                })
                this.dataList.splice(deletingIndex, 1)
                this.modalRef.hide()
            }
        })
    }
    rejectSelectedClaims() {
        const params = {
            ids: this.selectedIds
        }
        let status = this.adminApi.rejectClaim(params)
        status.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.modalRef.hide()
                return false
            } else {
                this.alert.success('Request Rejected successfully!!')
                this.selectedIds.forEach((d: number) => {
                    const index = this.dataList.findIndex(data => data.id == d)
                    if (index > -1) {
                        this.dataList.splice(index, 1)
                    }
                })
                this.modalRef.hide()
                this.selectedIds = []
            }
        })
    }

    approveSelectedClaims(id: any, index) {
        const params = {
            ids: this.selectedIds
        }
        let status = this.adminApi.approveRequest(params)
        status.subscribe((resp: any) => {
            if (resp.success === false) {
                if (resp.data) {
                    const index = this.dataList.findIndex(d => d.id == resp.data)
                    if (index > 1) {
                        this.alert.error(`${this.dataList[index].email} already exist`)
                    }
                } else {
                    this.alert.error(resp.errors.general)
                }
                this.modalRef.hide()
                return false
            } else {
                this.alert.success('Request Approved successfully!!')
                this.selectedIds.forEach((d: number) => {
                    const index = this.dataList.findIndex(data => data.id == d)
                    if (index > -1) {
                        this.dataList.splice(index, 1)
                    }
                })
                this.modalRef.hide()
                this.selectedIds = []
            }
        })
    }
    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    cancelButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }



}
