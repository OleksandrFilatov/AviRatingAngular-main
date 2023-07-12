import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms'
import { BsModalService } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal'

import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { AdminApiService } from 'src/app/services/admin-api.service'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
    selector: 'app-subjects',
    templateUrl: './subjects.component.html',
    styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {
    dataStatus = 'fetching'
    subjectList = []
    thumbnail: any = '/assets/img/user.jpg'
    subjectForm: FormGroup
    selectedIndex: any
    modalRef: BsModalRef
    selectedId: any
    subjectCategoriesList: any = []
    imageChangedEvent: any = ''
    croppedImage: any = ''
    cropperModalRef: BsModalRef

    constructor(
        private adminApi: AdminApiService,
        public api: ApiService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
    ) {
        this.subjectForm = this.fb.group({
            id: new FormControl(null),
            name_en: new FormControl(null, [Validators.required]),
            name_ch: new FormControl(null, [Validators.required]),
            subject_category_id: new FormControl(null, [Validators.required]),
            description_en: new FormControl(null, []),
            description_ch: new FormControl(null, []),
        })
    }

    ngOnInit() {
        this.adminApi.getSubjects().subscribe((resp: any) => {
            if (resp.success === true) {
                this.subjectList = resp.data
                this.dataStatus = 'done'
            }
        })
        this.adminApi.getSubjectCategories().subscribe((resp: any) => {
            if (resp.success === true) {
                this.subjectCategoriesList = resp.data
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
            this.subjectForm.controls.id.setValue(this.subjectList[index].id)
            this.subjectForm.patchValue(this.subjectList[index])
        }
        this.modalRef = this.ms.show(
            subjectModal,
            {
                class: 'modal-lg modal-dialog-centered admin-panel',
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
            description_en: data.value.description_en,
            description_ch: data.value.description_ch,
            subject_category_id: data.value.subject_category_id
        }

        fetch(this.thumbnail)
            .then(res => res.blob())
            .then(blob => {
                const imageFile = new Blob([blob])
                const formData = this.api.jsonToFormData(params)
                formData.append('subject_image', imageFile)


                let saveUpdate = this.adminApi.addSubject(formData)
                if (this.subjectForm.value.id !== null) {
                    saveUpdate = this.adminApi.updateSubject(formData)
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
                            const subjectCatIndex = this.subjectCategoriesList.findIndex(d => d.id === +data.value.subject_category_id)
                            const mergeParams = {
                                id: this.subjectForm.value.id,
                                name_en: data.value.name_en,
                                name_ch: data.value.name_ch,
                                description_en: data.value.description_en,
                                description_ch: data.value.description_ch,
                                subject_category: this.subjectCategoriesList[subjectCatIndex],
                                subject_category_id: this.subjectCategoriesList[subjectCatIndex].id
                            }
                            this.subjectList[this.selectedIndex] = mergeParams
                            this.subjectForm.controls.id.setValue(null)
                        } else {
                            this.alert.success('Subject added successfully!!')
                            const subjectCatIndex = this.subjectCategoriesList.findIndex(d => d.id === +data.value.subject_category_id)
                            const mergeParams = {
                                id: resp.data,
                                name_en: data.value.name_en,
                                name_ch: data.value.name_ch,
                                description_en: data.value.description_en,
                                description_ch: data.value.description_ch,
                                subject_category: this.subjectCategoriesList[subjectCatIndex],
                                subject_category_id: this.subjectCategoriesList[subjectCatIndex].id
                            }
                            this.subjectList.push(mergeParams)
                        }
                    }
                    this.modalRef.hide()
                    f.resetForm()
                })
            })
    }

    deleteSubject() {
        const params = {
            id: this.selectedId
        }
        this.adminApi.deleteSubject(params)
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
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    cancelSubjectButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }

    browseThumbnail(event: any) {
        event.preventDefault()
        const element = document.getElementById('thumbnail-image')
        element.click()
    }

    onThumbnailChange(event: any) {
        const file = event.target.files[0]
        const allowedExtensions = ['png', 'jpg', 'jpeg', 'svg']
        const extension = file.name.split('.').pop().toLowerCase()
        const fileSize = file.size / 1024 / 1024
        if (fileSize > 3) {
            this.alert.error('Invalid file size. File size must not exceeds 3MB')
        } else if (allowedExtensions.indexOf(extension) < 0) {
            this.alert.error('Invalid file type. Only png, jpg or jpeg are allowed')
        } else {
            const reader = new FileReader()
            this.imageChangedEvent = event
            reader.readAsDataURL(file)
            reader.onloadend = (e: any) => {
                this.thumbnail = reader.result
            }
        }
    }

}
