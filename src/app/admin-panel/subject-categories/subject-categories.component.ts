import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms'
import { AdminApiService } from 'src/app/services/admin-api.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { BsModalService } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'app-subject-categories',
  templateUrl: './subject-categories.component.html',
  styleUrls: ['./subject-categories.component.css']
})
export class SubjectCategoriesComponent implements OnInit {
    dataStatus = 'fetching'
    subjectList = []
    subjectForm: FormGroup
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
        this.subjectForm = this.fb.group({
            id: new FormControl(null),
            name_en: new FormControl(null, [Validators.required]),
            name_ch: new FormControl(null, [Validators.required]),
        })
    }

    ngOnInit() {
        this.adminApi.getSubjectCategories().subscribe((resp: any) => {
            if (resp.success === true) {
                this.subjectList = resp.data
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.subjectForm.controls
    }

    openModalSubject(subjectModal, index) {
        if (index > -1) {
            this.selectedIndex = index
            this.subjectForm .controls.id.setValue(this.subjectList[index].id)
            this.subjectForm .patchValue(this.subjectList[index])
        }
        this.modalRef = this.ms.show(
            subjectModal,
            {
                class: 'modal-md modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    saveSubject(data: any, f: any) {
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')

            return false
        }
        const params = {
            id: this.subjectForm.value.id,
            name_en: data.value.name_en,
            name_ch: data.value.name_ch,
        }

        let saveUpdate = this.adminApi.addSubjectCategory(params)
        if (this.subjectForm.value.id !== null) {
            saveUpdate = this.adminApi.updateSubjectCategory(params)
        }
        saveUpdate.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.modalRef.hide()
                f.resetForm()


                return false
            } else {
                if (this.subjectForm.value.id !== null) {
                    this.alert.success('Changes done successfully!!')
                    this.subjectList[this.selectedIndex] = params
                    this.subjectForm.controls.id.setValue(null)
                } else {
                    params.id = resp.data
                    this.alert.success('Subject added successfully!!')
                    this.subjectList.push(params)
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
        this.adminApi.deleteSubjectCategory(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()

                    return false
                } else {
                    const deletingIndex = this.subjectList.findIndex((d: any) => {
                        return d.id === this.selectedId
                    })
                    this.subjectList.splice(deletingIndex, 1)
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
