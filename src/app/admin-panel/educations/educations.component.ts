import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms'
import { BsModalService } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { DataService } from './data.service'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'

@Component({
  selector: 'app-educations',
  templateUrl: './educations.component.html',
  styleUrls: ['./educations.component.scss']
})
export class EducationsComponent implements OnInit {
    dataStatus = 'fetching'
    educationsList = []
    educationForm: FormGroup
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
        this.educationForm = this.fb.group({
            id: new FormControl(null),
            name_en: new FormControl(null, [Validators.required]),
            name_ch: new FormControl(null, [Validators.required]),
            description: new FormControl(null),
        })
    }

    ngOnInit() {
        this.ds.getEducations().subscribe((resp: any) => {
            if (resp.success === true) {
                this.educationsList = resp.data
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.educationForm.controls
    }

    openModalEducation(regionModal, index) {
        if (index > -1) {
            this.selectedIndex = index
            this.educationForm .controls.id.setValue(this.educationsList[index].id)
            this.educationForm .patchValue(this.educationsList[index])
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

    saveEducation(data: any, f: any) {
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')

            return false
        }
        const params = {
            id: this.educationForm.value.id,
            name_en: data.value.name_en,
            name_ch: data.value.name_ch,
            description: data.value.description,
        }

        let saveUpdate = this.ds.addEducation(params)
        if (this.educationForm.value.id !== null) {
            saveUpdate = this.ds.updateEducation(params)
        }
        saveUpdate.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.modalRef.hide()
                f.resetForm()


                return false
            } else {
                if (this.educationForm.value.id !== null) {
                    this.alert.success('Changes done successfully!!')
                    this.educationsList[this.selectedIndex] = params
                    this.educationForm.controls.id.setValue(null)
                } else {
                    params.id = resp.data
                    this.alert.success('Education added successfully!!')
                    this.educationsList.push(params)
                }
            }
            this.modalRef.hide()
            f.resetForm()
        })
    }

    deleteEducation() {
        const params = {
            id: this.selectedId
        }
        this.ds.deleteEducation(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()

                    return false
                } else {
                    const deletingIndex = this.educationsList.findIndex((d: any) => {
                        return d.id === this.selectedId
                    })
                    this.educationsList.splice(deletingIndex, 1)
                    this.modalRef.hide()
                    this.alert.success('Education deleted successfully!!')
                }
            })
    }

    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    cancelEducationButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }
}
