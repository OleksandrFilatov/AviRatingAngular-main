import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { UIHelpers } from 'src/app/helpers/ui-helpers';
import { DataService } from './data.service';
import { ApiService } from 'src/app/services/api.service';
import { BsModalService } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment'


@Component({
    selector: 'app-edit-profile-playgroup',
    templateUrl: './edit-profile-playgroup.component.html',
    styleUrls: ['./edit-profile-playgroup.component.scss']
})
export class EditProfilePlaygroupComponent implements OnInit {
    @Input() modalRef: BsModalRef
    moment = moment
    playGroupId: any = -1
    selectedPlayGroupData: any
    userList: any[]
    profileFG: FormGroup
    regionsList: any = []
    districtsList: any = []
    educationLevelList: any = []
    FormStatus = 'fetching'
    dataStatus = 'fetching'

    thumbnail = '/assets/images/user-placeholder.png'
    imageChangedEvent: any = ''
    croppedImage: any = ''
    cropperModalRef: BsModalRef

    constructor(
        private fb: FormBuilder,
        public ui: UIHelpers,
        private dataService: DataService,
        public api: ApiService,
        private modalService: BsModalService,
        private alert: IAlertService,
        private route: ActivatedRoute,
        public router: Router,

    ) {
        this.route.queryParams.subscribe(params => {
            if (params.id) {
                this.playGroupId = params.id
            }
        })
        // get userData call
    }

    getDistricts(regionId: number) {
        this.districtsList = []
        const regionIndex = this.regionsList.findIndex(d => d.id == regionId)
        if (regionIndex > -1) {
            this.districtsList = this.regionsList[regionIndex].district
        }

    }

    get g() {
        return this.profileFG.controls
    }

    ngOnInit() {
    }

    makeForm() {
        const user = this.selectedPlayGroupData
        if (this.playGroupId > -1) {
            this.profileFG = this.fb.group({
                id: new FormControl(user.id, [Validators.required]),
                first_name: new FormControl(user.first_name, [Validators.required, Validators.maxLength(50)]),
                user_name: new FormControl(user.user_name, [Validators.required]),
                email: new FormControl(user.user_name, [Validators.required]),
                contact_1: new FormControl(user.playgroup.contact_1, [Validators.required, Validators.maxLength(15)]),
                contact_2: new FormControl(user.playgroup.contact_2, [Validators.maxLength(15)]),
                level_id: new FormControl(user.playgroup.level_id, [Validators.maxLength(15)]),
                district_id: new FormControl(user.playgroup.district_id, [Validators.required, Validators.maxLength(15)]),
                region_id: new FormControl(user.playgroup.region_id, [Validators.required, Validators.maxLength(15)]),
                description: new FormControl(user.playgroup.description, [Validators.maxLength(500)]),
                address_1: new FormControl(user.playgroup.address_1, [Validators.maxLength(500)]),
                address_2: new FormControl(user.playgroup.address_2, [Validators.maxLength(500)]),
                address_3: new FormControl(user.playgroup.address_3, [Validators.maxLength(500)]),
                established: new FormControl(user.playgroup.established, [Validators.required, Validators.max(moment().year())]),
                fee: new FormControl(user.fee, [Validators.required]),

            })
            this.thumbnail = this.api.userImageUrl(this.selectedPlayGroupData.id)
        } else {
            this.profileFG = this.fb.group({
                first_name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
                user_name: new FormControl(null, [Validators.required]),
                email: new FormControl(null, [Validators.required]),
                contact_1: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
                contact_2: new FormControl(null, [Validators.maxLength(15)]),
                level_id: new FormControl(null, [Validators.maxLength(15)]),
                district_id: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
                region_id: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
                description: new FormControl(null, [Validators.maxLength(500)]),
                address_1: new FormControl(null, [Validators.maxLength(500)]),
                address_2: new FormControl(null, [Validators.maxLength(500)]),
                address_3: new FormControl(null, [Validators.maxLength(500)]),
                established: new FormControl(null, [Validators.required, Validators.max(moment().year())]),
                fee: new FormControl(null, [Validators.required]),
            })
        }


        this.FormStatus = 'done'
    }

    save(data: any): boolean {
        console.log(data.value)
        if (data.status === 'INVALID' && this.playGroupId > -1) {
            this.alert.error('Please fill-in valid data in all fields & try again.')

            return false
        }


        const requiredPromises: Array<any> = []

        const formData = this.api.jsonToFormData(data.value)
        const thumbnailPromise = fetch(this.thumbnail)
            .then(res => res.blob())
            .then(blob => {
                const imageFile = new Blob([blob]) // for microsoft edge support
                formData.append('profile_image', imageFile)
            })
        requiredPromises.push(thumbnailPromise)

        Promise.all(requiredPromises)
            .then(_ => this.sendCall(formData))
    }

    sendCall(formData: FormData): void {
        let saveMethod = this.dataService.createProfile(formData)
        if (this.playGroupId > -1) {
            saveMethod = this.dataService.updateProfile(formData)
        }
        saveMethod.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)

                return false
            } else {
                if (this.playGroupId > -1) {
                    this.alert.success('Profile updated successfully')
                } else {
                    this.alert.success('Profile created successfully')
                }
                this.router.navigate(['/admin/users'])

            }
        })
    }

    browseThumbnail(event: any) {
        event.preventDefault()
        const element = document.getElementById('thumbnail-image')
        element.click()
    }

    onThumbnailChange(event: any, template: TemplateRef<any>) {
        const file = event.target.files[0]
        const allowedExtensions = ['png', 'jpg', 'jpeg']
        const extension = file.name.split('.').pop().toLowerCase()
        const fileSize = file.size / 1024 / 1024
        if (fileSize > 3) {
            this.alert.error('Invalid file size. File size must not exceeds 3MB')
        } else if (allowedExtensions.indexOf(extension) < 0) {
            this.alert.error('Invalid file type. Only png, jpg or jpeg are allowed')
        } else {
            this.imageChangedEvent = event
            this.cropperModalRef = this.modalService.show(
                template,
                Object.assign({}, { class: 'modal-md modal-dialog-centered modal-dialog-scrollable admin-panel' })
            )
        }
    }

    doneCroppingThumbnail() {
        this.thumbnail = this.croppedImage
        document.getElementById('banner-img').setAttribute('src', this.thumbnail)
        this.cropperModalRef.hide()
    }

    // company thumbnail
    browseCompanyThumbnail(event: any) {
        event.preventDefault()
        const element = document.getElementById('company-thumbnail-image')
        element.click()
    }

    // onCompanyThumbnailChange(event: any, template: TemplateRef<any>) {
    //     const file = event.target.files[0]
    //     const allowedExtensions = ['png', 'jpg', 'jpeg']
    //     const extension = file.name.split('.').pop().toLowerCase()
    //     const fileSize = file.size / 1024 / 1024
    //     if (fileSize > 3) {
    //         this.alert.error('Invalid file size. File size must not exceeds 3MB')
    //     } else if (allowedExtensions.indexOf(extension) < 0) {
    //         this.alert.error('Invalid file type. Only png, jpg or jpeg are allowed')
    //     } else {
    //         this.companyImageChangedEvent = event
    //         this.companyCropperModalRef = this.modalService.show(
    //             template,
    //             Object.assign({}, { class: 'modal-md modal-dialog-centered modal-dialog-scrollable' })
    //         )
    //     }
    // }

    // doneCroppingCompanyThumbnail() {
    //     this.companyThumbnail = this.croppedCompanyImage
    //     document.getElementById('company-img').setAttribute('src', this.companyThumbnail)
    //     this.companyCropperModalRef.hide()
    // }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64
    }

    // companyImageCropped(event: ImageCroppedEvent) {
    //     this.croppedCompanyImage = event.base64
    // }

    imageLoaded() {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }
}
