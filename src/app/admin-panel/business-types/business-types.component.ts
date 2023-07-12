import { TemplateRef } from '@angular/core'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { DataService } from './data.service'

@Component({
    selector: 'app-business-types',
    templateUrl: './business-types.component.html',
    styleUrls: ['./business-types.component.css']
})
export class BusinessTypesComponent implements OnInit {
    dataStatus = 'fetching'
    businessTypeData = []
    businessTypeForm: FormGroup
    // faqCategoriesData = []
    // faqCatList = []
    // faqCatForm: FormGroup
    modalRef: BsModalRef
    selectedIndex: any
    selectedId: any

    constructor(
        public data: DataService,
        private fb: FormBuilder,
        private ms: BsModalService,
        public ui: UIHelpers,
        public alert: IAlertService,
    ) {
        this.businessTypeForm = this.fb.group({
            id: new FormControl(null),
            full_name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            short_name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            price: new FormControl(null, [Validators.required, Validators.min(0)]),
        })
    }

    ngOnInit() {
        this.data.getBusinessTypes().subscribe((resp: any) => {
            if (resp.success === true) {
                this.businessTypeData = resp.data
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.businessTypeForm.controls
    }

    openModal(busiTypeModal, index) {
        this.selectedIndex = index
        if (index > -1) {
            this.businessTypeForm.patchValue(this.businessTypeData[index])
        }
        this.modalRef = this.ms.show(
            busiTypeModal,
            {
                class: 'modal-lg modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    saveBusinessType(data: any, f: any) {
        if (data.status === 'INVALID') {
            this.alert.error('Please Fill valid data in all fields and try again.')

            return false
        }

        let saveMethod = this.data.addBusinessType(data.value)

        if (this.businessTypeForm.value.id !== null) {
            saveMethod = this.data.updateBusinessType(data.value)
        }

        saveMethod.subscribe((resp: any) => {
            if (resp.success === true) {
                if (this.businessTypeForm.value.id !== null) {
                    this.alert.success('Your Business type Updated successfully')
                    this.businessTypeData[this.selectedIndex] = data.value
                } else {
                    data.value.id = resp.data.id
                    this.alert.success('Your Business type saved successfully')
                    this.businessTypeData.push(data.value)
                }
            } else {
                this.alert.error(resp.errors.general)
            }

            this.modalRef.hide()
            f.resetForm()
        })
    }

    deleteBusiType() {
        const params = {
            id: this.selectedId
        }
        this.data.deleteBusinessType(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)

                    return false
                } else {
                    const deletingIndex = this.businessTypeData.findIndex((d: any) => {
                        return d.id === this.selectedId
                    })
                    this.businessTypeData.splice(deletingIndex, 1)
                    this.alert.success('Business type deleted successfully!!')
                }
                this.modalRef.hide()
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
