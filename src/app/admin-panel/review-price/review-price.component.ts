import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UIHelpers } from 'src/app/helpers/ui-helpers';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { DataService } from './data.service'

@Component({
    selector: 'app-review-price',
    templateUrl: './review-price.component.html',
    styleUrls: ['./review-price.component.css']
})
export class ReviewPriceComponent implements OnInit {

    dataStatus = 'fetching'
    dbResponse = []
    reviewPriceForm: FormGroup
    selectedIndex: any
    modalRef: BsModalRef
    selectedId: any
    constructor(
        private ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
    ) {
        this.reviewPriceForm = this.fb.group({
            id: new FormControl(null),
            no_of_replies: new FormControl(null, [Validators.required]),
            price: new FormControl(null, [Validators.required]),
        })

    }

    ngOnInit() {
        this.ds.getReviewPrice().subscribe((resp: any) => {
            if (resp.success === true) {
                this.dbResponse = resp.data
                this.dataStatus = 'done'
                this.ds.rsp = this.dbResponse
                console.log(this.ds.rsp);
            }
        })


    }

    get g() {
        return this.reviewPriceForm.controls
    }

    openModal(addeditModal, index) {
        if (index > -1) {
            this.selectedIndex = index
            // this.reviewPriceForm.controls.id.setValue(this.dbResponse[index].id)
            this.reviewPriceForm.patchValue(this.dbResponse[index])
        }
        this.modalRef = this.ms.show(
            addeditModal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    save(f: any) {
        if (this.reviewPriceForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')

            return false
        }
        const params = {
            id: this.reviewPriceForm.value.id,
            no_of_replies: this.reviewPriceForm.value.no_of_replies,
            price: this.reviewPriceForm.value.price,
        }

        let saveUpdate = this.ds.addReviewPrice(params)
        if (this.reviewPriceForm.value.id !== null) {
            saveUpdate = this.ds.updateReviewPrice(params)
        }
        saveUpdate.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.modalRef.hide()
                f.resetForm()


                return false
            } else {
                if (this.reviewPriceForm.value.id !== null) {
                    this.alert.success('Changes done successfully!!')
                    this.dbResponse[this.selectedIndex] = params
                } else {
                    params.id = resp.data
                    this.alert.success(' price added successfully!!')
                    this.dbResponse.push(params)
                }
            }
            this.modalRef.hide()
            f.resetForm()
        })
    }

    delete() {
        const params = {
            id: this.selectedId
        }
        this.ds.deleteReviewPrice(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()

                    return false
                } else {
                    this.dbResponse.splice(this.selectedIndex, 1)
                    this.modalRef.hide()
                    this.alert.success(' Deleted successfully!!')
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
