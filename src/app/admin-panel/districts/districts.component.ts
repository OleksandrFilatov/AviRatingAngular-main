import { Component, OnInit, TemplateRef } from '@angular/core'
import { DataService } from './data.service'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'

@Component({
    selector: 'app-districts',
    templateUrl: './districts.component.html',
    styleUrls: ['./districts.component.css']
})
export class DistrictsComponent implements OnInit {
    dataStatus = 'fetching'
    districtsList = []
    districtForm: FormGroup
    selectedIndex: any
    modalRef: BsModalRef
    selectedId: any
    regionsList: any = []

    constructor(
        private adminApi: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
    ) {
        this.districtForm = this.fb.group({
            id: new FormControl(null),
            name_en: new FormControl(null, [Validators.required]),
            name_ch: new FormControl(null, [Validators.required]),
            region_id: new FormControl(null, [Validators.required]),
        })
    }

    ngOnInit() {
        this.adminApi.getDistricts().subscribe((resp: any) => {
            if (resp.success === true) {
                this.districtsList = resp.data
                this.dataStatus = 'done'
            }
        })
        this.adminApi.getRegions().subscribe((resp: any) => {
            if (resp.success === true) {
                this.regionsList = resp.data
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.districtForm.controls
    }

    openModalDistrict(districtModal, index) {
        if (index > -1) {
            this.selectedIndex = index
            // this.districtForm.controls.id.setValue(this.districtsList[index].id)
            this.districtForm.patchValue(this.districtsList[index])
        }
        this.modalRef = this.ms.show(
            districtModal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    saveDistrict(data: any, f: any) {
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')

            return false
        }
        const params = {
            id: this.districtForm.value.id,
            name_en: data.value.name_en,
            name_ch: data.value.name_ch,
            region_id: data.value.region_id
        }
        let saveUpdate = this.adminApi.addDistrict(params)
        if (this.districtForm.value.id !== null) {
            saveUpdate = this.adminApi.updateDistrict(params)
        }
        saveUpdate.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.modalRef.hide()
                f.resetForm()

                return false
            } else {
                if (this.districtForm.value.id !== null) {
                    this.alert.success('Changes done successfully!!')
                    const regionsIndex = this.regionsList.findIndex(d => d.id === +data.value.region_id)
                    const mergeParams = {
                        id: this.districtForm.value.id,
                        name_en: data.value.name_en,
                        name_ch: data.value.name_ch,
                        region: this.regionsList[regionsIndex],
                        region_id: this.regionsList[regionsIndex].id
                    }
                    this.districtsList[this.selectedIndex] = mergeParams
                    this.districtForm.controls.id.setValue(null)
                } else {
                    this.alert.success('District added successfully!!')
                    const regionsIndex = this.regionsList.findIndex(d => d.id === +data.value.region_id)
                    const mergeParams = {
                        id: resp.data,
                        name_en: data.value.name_en,
                        name_ch: data.value.name_ch,
                        region: this.regionsList[regionsIndex],
                        region_id: this.regionsList[regionsIndex].id
                    }
                    this.districtsList.push(mergeParams)
                }
            }
            this.modalRef.hide()
            f.resetForm()
        })
    }

    deleteDistrict() {
        const params = {
            id: this.selectedId
        }
        this.adminApi.deleteDistrict(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()

                    return false
                } else {
                    const deletingIndex = this.districtsList.findIndex((d: any) => {
                        return d.id === this.selectedId
                    })
                    this.districtsList.splice(deletingIndex, 1)
                    this.modalRef.hide()
                    this.alert.success('District deleted successfully!!')
                }
            })
    }

    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm' })
    }

    cancelDistrictButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }

}
