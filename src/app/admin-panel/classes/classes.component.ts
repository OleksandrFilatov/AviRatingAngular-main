import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms'
import { BsModalService } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'

import { DataService } from './data.service'

@Component({
    selector: 'app-classes',
    templateUrl: './classes.component.html',
    styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {
    dataStatus = 'fetching'
    classesList = []
    thumbnail = '/assets/img/user.jpg'
    classForm: FormGroup
    selectedIndex: any
    modalRef: BsModalRef
    selectedId: any

    constructor(
        private ds: DataService,
        public api: ApiService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
    ) {
        this.classForm = this.fb.group({
            id: new FormControl(null),
            name_en: new FormControl(null, [Validators.required]),
            name_ch: new FormControl(null, [Validators.required]),
        })
    }

    ngOnInit() {
        this.ds.getClasses().subscribe((resp: any) => {
            if (resp.success === true) {
                this.classesList = resp.data
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.classForm.controls
    }

    openModalClasses(classesModal, index) {
        if (index > -1) {
            this.selectedIndex = index
            this.classForm.controls.id.setValue(this.classesList[index].id)
            this.classForm.patchValue(this.classesList[index])
        }
        this.modalRef = this.ms.show(
            classesModal,
            {
                class: 'modal-lg modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    saveClass(data: any, f: any) {
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')

            return false
        }
        const params = {
            id: this.classForm.value.id,
            name_en: data.value.name_en,
            name_ch: data.value.name_ch,
        }
        let saveUpdate = this.ds.addClass(params)
        if (this.classForm.value.id !== null) {
            saveUpdate = this.ds.updateClass(params)
        }
        saveUpdate.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.modalRef.hide()
                f.resetForm()

                return false
            } else {
                if (this.classForm.value.id !== null) {
                    this.alert.success('Changes done successfully!!')
                    const mergeParams = {
                        id: this.classForm.value.id,
                        name_en: data.value.name_en,
                        name_ch: data.value.name_ch,
                    }
                    this.classesList[this.selectedIndex] = mergeParams
                    this.classForm.controls.id.setValue(null)
                } else {
                    this.alert.success('Class added successfully!!')
                    const mergeParams = {
                        id: resp.data,
                        name_en: data.value.name_en,
                        name_ch: data.value.name_ch,
                    }
                    this.classesList.push(mergeParams)
                }
            }
            this.modalRef.hide()
            f.resetForm()
        })
}

deleteClass() {
    const params = {
        id: this.selectedId
    }
    this.ds.deleteClass(params)
        .subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                this.modalRef.hide()

                return false
            } else {
                const deletingIndex = this.classesList.findIndex((d: any) => {
                    return d.id === this.selectedId
                })
                this.classesList.splice(deletingIndex, 1)
                this.modalRef.hide()
                this.alert.success('Class deleted successfully!!')
            }
        })
}

confirmingModal(template: TemplateRef < any >, id: any, i: any) {
    this.selectedId = id
    this.selectedIndex = i
    this.modalRef = this.ms.show(template, { class: 'modal-sm' })
}

cancelClassButton(f: any) {
    f.resetForm()
    this.modalRef.hide()
}

}
