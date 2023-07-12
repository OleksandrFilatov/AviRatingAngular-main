import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { BsModalService } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { ApiService } from 'src/app/services/api.service';
import { DataService } from './data.service';
import { UIHelpers } from 'src/app/helpers/ui-helpers';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-edit-profile-tutor',
    templateUrl: './edit-profile-tutor.component.html',
    styleUrls: ['./edit-profile-tutor.component.scss']
})
export class EditProfileTutorComponent implements OnInit {
    @Input() modalRef: BsModalRef
    tutorId: any = -1
    selectedTutorData: any
    userList: any = []
    profileFG: FormGroup
    educationLevelList: any = []
    formStatus = 'fetching'
    thumbnail = '/assets/images/user-placeholder.png'
    imageChangedEvent: any = ''
    croppedImage: any = ''
    cropperModalRef: BsModalRef
    months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]
    tutorExperince = {
        '0': 'Less than 1 Year',
        '3': '1 - 3 Years',
        '6': '4 - 6 Years',
        '10': '7 - 10 Years',
        '11': '10+ Years',
    }
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
                this.tutorId = params.id
            }
        })
        if (this.tutorId > -1) {
            this.dataService.getUserDetail(this.tutorId).subscribe((res: any) => {
                if (res.success === true) {
                    this.selectedTutorData = res.data
                    // identify selected user
                    console.log('student data', this.selectedTutorData)
                    this.makeForm()
                }
            })
        } else {
            this.makeForm()
        }

    }

    get g() {
        return this.profileFG.controls
    }

    ngOnInit() {
    }

    makeForm() {
        const webUrlPatteren = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
        const user = this.selectedTutorData
        if (this.tutorId > -1) {
            this.profileFG = this.fb.group({
                id: new FormControl(user.id, [Validators.required]),
                title: new FormControl(user.tutor.title, [Validators.required]),
                first_name: new FormControl(user.first_name, [Validators.required, Validators.maxLength(50)]),
                last_name: new FormControl(user.last_name, [Validators.maxLength(50)]),
                user_name: new FormControl(user.user_name, [Validators.required, Validators.maxLength(40)]),
                email: new FormControl(user.email, [Validators.required, Validators.maxLength(100)]),
                dob_month: new FormControl(user.tutor.dob_month, [Validators.required]),
                dob_year: new FormControl(user.tutor.dob_year, [Validators.required]),
                address: new FormControl(user.tutor.address, [Validators.required]),
                fee: new FormControl(user.fee, [Validators.required]),
                contact_1: new FormControl(user.tutor.contact_1, [Validators.required, Validators.maxLength(15)]),
                watsapp_no: new FormControl(user.tutor.watsapp_no),
                level_id: new FormControl(user.tutor.level_id),
                language: new FormControl(user.tutor.language, [Validators.required]),
                web_url: new FormControl(user.tutor.web_url, []),
                teaching_method: new FormControl(user.tutor.teaching_method, [Validators.required, Validators.maxLength(15)]),
                description: new FormControl(user.tutor.description),
                experience: new FormControl(user.tutor.experience, [Validators.required]),
                scrc: new FormControl(user.tutor.scrc),
            })
            this.thumbnail = this.api.userImageUrl(this.selectedTutorData.id)
        } else {
            this.profileFG = this.fb.group({
                title: new FormControl(null, [Validators.required]),
                first_name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
                last_name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
                user_name: new FormControl(null, [Validators.required, Validators.maxLength(40)]),
                email: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
                dob_month: new FormControl(null, [Validators.required]),
                dob_year: new FormControl(null, [Validators.required]),
                address: new FormControl(null, [Validators.required]),
                fee: new FormControl(null, [Validators.required]),
                contact_1: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
                watsapp_no: new FormControl(null, []),
                level_id: new FormControl(null),
                language: new FormControl(null, [Validators.required]),
                web_url: new FormControl(null, []),
                teaching_method: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
                description: new FormControl(null),
                experience: new FormControl(null, [Validators.required]),
                scrc: new FormControl(1),
            })
        }
        this.formStatus = 'done'
    }

    save(data: any): boolean {
        console.log(data)
        console.log('data', data.status);

        if (data.status === 'INVALID') {
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
        if (this.tutorId > -1) {
            saveMethod = this.dataService.updateProfile(formData)
        }
        saveMethod.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)

                return false
            } else {
                if (this.tutorId > -1) {
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


    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64
    }


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
