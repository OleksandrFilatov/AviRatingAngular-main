import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms'
import { BsModalService } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { AdminApiService } from 'src/app/services/admin-api.service'

@Component({
    selector: 'app-education-level',
    templateUrl: './education-level.component.html',
    styleUrls: ['./education-level.component.css']
})
export class EducationLevelComponent implements OnInit {
    dataStatus = 'fetching'
    educationLevelList = []
    educationLevelForm: FormGroup
    selectedIndex: any
    modalRef: BsModalRef
    selectedId: any

    constructor(
        private adminApi: AdminApiService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
    ) {
        this.educationLevelForm = this.fb.group({
            id: new FormControl(null),
            name_en: new FormControl(null, [Validators.required]),
            name_ch: new FormControl(null, [Validators.required]),
        })
    }

    ngOnInit() {
        this.adminApi.getEducationLevels().subscribe((resp: any) => {
            if (resp.success === true) {
                this.educationLevelList = resp.data
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.educationLevelForm.controls
    }

    openModalEducationLevel(educationLevelModal, index) {
        if (index > -1) {
            this.selectedIndex = index
            this.educationLevelForm.controls.id.setValue(this.educationLevelList[index].id)
            this.educationLevelForm.patchValue(this.educationLevelList[index])
        }
        this.modalRef = this.ms.show(
            educationLevelModal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    saveEducationLevel(data: any, f: any) {
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')

            return false
        }
        const params = {
            id: this.educationLevelForm.value.id,
            name_en: data.value.name_en,
            name_ch: data.value.name_ch,
        }

        let saveUpdate = this.adminApi.addEducationLevel(params)
        if (this.educationLevelForm.value.id !== null) {
            saveUpdate = this.adminApi.updateEducationLevel(params)
        }
        saveUpdate.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.modalRef.hide()
                f.resetForm()


                return false
            } else {
                if (this.educationLevelForm.value.id !== null) {
                    this.alert.success('Changes done successfully!!')
                    this.educationLevelList[this.selectedIndex] = params
                    this.educationLevelForm.controls.id.setValue(null)
                } else {
                    params.id = resp.data
                    this.alert.success('Subject added successfully!!')
                    this.educationLevelList.push(params)
                }
            }
            this.modalRef.hide()
            f.resetForm()
        })
    }

    deleteSubject() {
        const params = {
            id: this.selectedId
        }
        this.adminApi.deleteEducationLevel(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()

                    return false
                } else {
                    const deletingIndex = this.educationLevelList.findIndex((d: any) => {
                        return d.id === this.selectedId
                    })
                    this.educationLevelList.splice(deletingIndex, 1)
                    this.modalRef.hide()
                    this.alert.success('Subject deleted successfully!!')
                }
            })
    }

    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm' })
    }

    cancelSubjectButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }
}
