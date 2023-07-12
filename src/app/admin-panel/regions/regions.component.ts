import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { DataService } from './data.service'

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.css']
})
export class RegionsComponent implements OnInit {
    dataStatus = 'fetching'
    regionsList = []
    regionForm: FormGroup
    selectedIndex: any
    modalRef: BsModalRef
    selectedId: any

    constructor(
        private adminApi: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
    ) {
        this.regionForm = this.fb.group({
            id: new FormControl(null),
            name_en: new FormControl(null, [Validators.required]),
            name_ch: new FormControl(null, [Validators.required]),
        })
    }

    ngOnInit() {
        this.adminApi.getRegions().subscribe((resp: any) => {
            if (resp.success === true) {
                this.regionsList = resp.data
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.regionForm.controls
    }

    openModalRegion(regionModal, index) {
        if (index > -1) {
            this.selectedIndex = index
            this.regionForm .controls.id.setValue(this.regionsList[index].id)
            this.regionForm .patchValue(this.regionsList[index])
        }
        this.modalRef = this.ms.show(
            regionModal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    saveRegion(data: any, f: any) {
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')

            return false
        }
        const params = {
            id: this.regionForm.value.id,
            name_en: data.value.name_en,
            name_ch: data.value.name_ch,
        }

        let saveUpdate = this.adminApi.addRegion(params)
        if (this.regionForm.value.id !== null) {
            saveUpdate = this.adminApi.updateRegion(params)
        }
        saveUpdate.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.modalRef.hide()
                f.resetForm()


                return false
            } else {
                if (this.regionForm.value.id !== null) {
                    this.alert.success('Changes done successfully!!')
                    this.regionsList[this.selectedIndex] = params
                    this.regionForm.controls.id.setValue(null)
                } else {
                    params.id = resp.data
                    this.alert.success('Region added successfully!!')
                    this.regionsList.push(params)
                }
            }
            this.modalRef.hide()
            f.resetForm()
        })
    }

    deleteRegion() {
        const params = {
            id: this.selectedId
        }
        this.adminApi.deleteRegion(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()

                    return false
                } else {
                    const deletingIndex = this.regionsList.findIndex((d: any) => {
                        return d.id === this.selectedId
                    })
                    this.regionsList.splice(deletingIndex, 1)
                    this.modalRef.hide()
                    this.alert.success('Region deleted successfully!!')
                }
            })
    }

    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm' })
    }

    cancelRegionButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }

}
