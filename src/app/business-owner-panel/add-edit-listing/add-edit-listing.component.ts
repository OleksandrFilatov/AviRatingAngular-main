import { Component, OnInit, TemplateRef } from '@angular/core'
import { ImageCroppedEvent } from 'ngx-image-cropper'
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import { ApiService } from 'src/app/services/api.service'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { DataService } from './data.service'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'

@Component({
    selector: 'app-add-edit-listing',
    templateUrl: './add-edit-listing.component.html',
    styleUrls: ['./add-edit-listing.component.scss']
})
export class AddEditListingComponent implements OnInit {
    thumbnail = '/assets/img/user.jpg'
    imageChangedEvent: any = ''
    selectedId: any = -1
    croppedImage: any = ''
    cropperModalRef: BsModalRef
    userType: any
    listingForm: FormGroup
    listingDetails: any

    listingId: any
    modalRef: BsModalRef
    selectedIndex: -1
    spinnerSVG: string
    // uploadedImages = []
    index: any
    constructor(
        private route: ActivatedRoute,
        public ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
        public api: ApiService,
        public router: Router
    ) {
        this.selectedId = this.route.snapshot.paramMap.get('id')
        if (this.selectedId == -1) {
            this.ds.getlistingId().subscribe((resp: any) => {
                if (resp.success === true) {
                    this.listingId = resp.data
                    this.listingForm.controls.id.setValue(this.listingId)
                    this.getDetails()
                }
            })
        } else {
            this.getDetails()
        }
        this.thumbnail = this.api.listingSmallThumbnailUrl(this.selectedId)
        this.listingForm = this.fb.group({
            id: new FormControl(null),
            title: new FormControl(null, [Validators.required]),
            description: new FormControl(null, [Validators.required]),
        })
    }

    get g() {
        return this.listingForm.controls
    }

    ngOnInit() {
    }
    getDetails() {
        let paramsId: any
        if (this.selectedId > -1) {
            paramsId = {
                id: this.selectedId
            }
        } else {
            paramsId = {
                id: this.listingId
            }
        }
        this.ds.getlistingDetails(paramsId).subscribe((resp: any) => {
            if (resp.success == false) {
                this.alert.error(resp.errors.general)
            } else {
                this.listingDetails = resp.data
                this.listingForm.patchValue(this.listingDetails)
            }
        })  // Listing Details end


    }

    saveListing(data: any, f: any) {
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')

            return false
        }

        fetch(this.thumbnail)
            .then(res => res.blob())
            .then(blob => {
                const imageFile = new Blob([blob]) // for microsoft edge support
                const formData = this.api.jsonToFormData(data.value)
                formData.append('listing_thumbnail', imageFile)
                this.ds.saveListing(formData).subscribe((resp: any) => {
                    if (resp.success === false) {
                        this.alert.error(resp.errors.general)
                        f.resetForm()

                        return false
                    } else {
                        if (this.selectedId > -1) {
                            this.alert.success('Changes done successfully!!')
                        } else {
                            data.value.id = resp.data
                            this.alert.success('Listing added successfully!!')
                        }
                        this.ds.step = 2
                    }
                })
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
            this.cropperModalRef = this.ms.show(
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

    isDefault(g: any): boolean {
        return g.id.value === '' || (g.id.value > 0 && !g.is_default.value)
    }

}
