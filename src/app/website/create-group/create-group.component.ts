import { Component, OnInit, Input, TemplateRef, ElementRef, ViewChild } from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { ApiService } from 'src/app/services/api.service'
import { ActivatedRoute, Router } from '@angular/router'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'
import { ImageCroppedEvent } from 'ngx-image-cropper'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'

declare var $: any;

@Component({
    selector: 'app-create-group',
    templateUrl: './create-group.component.html',
    styleUrls: ['./create-group.component.scss',
        '/src/assets/css/responsive.css',]
})
export class CreateGroupComponent implements OnInit {
    toppings = new FormControl();
    toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
    createGroupForm: FormGroup
    modalRef: BsModalRef
    thumbnail = '/assets/images/upload-icon.svg'
    imageChangedEvent: any = ''
    croppedImage: any = ''
    cropperModalRef: BsModalRef

    constructor(
        private fb: FormBuilder,
        public api: ApiService,
        private alert: IAlertService,
        private router: Router,
        private modalService: BsModalService,
    ) {
        this.initializeCreateGroupForm()
    }

    ngOnInit(): void {
        $(document).ready(function domReady() {
            $(".js-select2").select2({
                placeholder: "Pick states",
                theme: "material"
            });

            $(".select2-selection__arrow")
                .addClass("material-icons")
                .html("arrow_drop_down");
        });
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
                Object.assign({}, { class: 'modal-md modal-dialog-centered website' })
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

    createGroup(data: any): boolean {
        // data.value.services = this.selectedServices

        if (data.status === 'INVALID') {
            this.alert.error('Please fill out valid data in all fields a nd try again')

            return false
        }
        const requiredPromises: Array<any> = []

        const formData = this.api.jsonToFormData(data.value)

        if (this.thumbnail === '/assets/images/upload-icon.svg') {
            this.thumbnail = '/assets/images/no_image_group.png'
        }

        const thumbnailPromise = fetch(this.thumbnail)
            .then(res => res.blob())
            .then(blob => {
                const imageFile = new Blob([blob]) // for microsoft edge support
                formData.append('group_image', imageFile)
            })
        requiredPromises.push(thumbnailPromise)

        Promise.all(requiredPromises)
            .then(_ => this.sendCall(formData, this.router))
    }

    sendCall(formData: FormData, router: Router): void {
        this.api.createGroup(formData).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                return false
            } else {
                this.alert.success('New Group created successfully')
                router.navigate(['/group-post/', resp.data])
            }
        })
    }

    initializeCreateGroupForm() {
        this.createGroupForm = this.fb.group({
            group_name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            group_description: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
            // group_area: new FormControl(null, [Validators.required,]),
            group_type: new FormControl(null, [Validators.required]),
        })
    }
}