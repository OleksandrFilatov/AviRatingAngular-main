import { ConstantsService } from './../../services/constants.service';
import { ApiService } from 'src/app/services/api.service'
import { DataService } from './data.service'
import { Component, OnInit, TemplateRef } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { ImageCroppedEvent } from 'ngx-image-cropper'
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment'

@Component({
    selector: 'app-banners',
    templateUrl: './banners.component.html',
    styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit {
    minDate: Date;
    moment = moment
    dataStatus = 'fetching'
    bannerPrice = this.api.homeBannerPrice
    totalPrice = 0
    blogList: any = []
    pagination: any
    bannerForm: FormGroup
    selectedIndex: any
    modalRef: BsModalRef
    selectedId: any
    page = 1
    results: any = []
    fetching = false
    imageChangedEvent: any = ''
    croppedImage: any = ''
    cropperModalRef: BsModalRef
    thumbnail = '/assets/img/no-banner.png'
    filters = {
        startDate: '',
        endDate: '',
        days: '',
    }

    constructor(
        private ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
        public api: ApiService,
        private router: Router,
        private route: ActivatedRoute,
        private cs: ConstantsService
    ) {
        this.minDate = new Date();
        this.route.queryParams.subscribe(params => {
            if (params.page) {
                this.page = params.page
                this.search()
            }
            this.search()
        })
        this.bannerForm = this.fb.group({
            id: new FormControl(null),
            title: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
            status: new FormControl(null, []),
            banner_link: new FormControl(null, [Validators.required, Validators.maxLength(250)]),
            description: new FormControl(null, [Validators.maxLength(500)]),
            start_date: new FormControl(null, [Validators.required]),
            end_date: new FormControl(null, [Validators.required])
        })

    }
    search() {
        const mergeParams: any = {
            page: this.page
        }

        this.ds.getMyBanners(this.page).subscribe((resp: any) => {
            if (resp.success === true) {
                this.fetching = true
                this.results = resp.data.data
                this.pagination = resp.data
                this.dataStatus = 'done'
                this.router.navigate(['/business-owner/banners'], { queryParams: mergeParams, replaceUrl: true })

            }
        })
    }
    ngOnInit() {
        // this.ds.getBlogs(this.page).subscribe((resp: any) => {
        //     if (resp.success === true) {
        //         this.results = resp.data.data
        //         this.pagination = resp.data
        //         this.dataStatus = 'done'
        //     }
        // })
    }

    get g() {
        return this.bannerForm.controls
    }
    setPagination(page: number) {
        let filtersParam: any = {}
        filtersParam = {
            page
        }
        this.router.navigate(['/business-owner/banners'], { queryParams: filtersParam, replaceUrl: true })
    }
    openModal(modal, index) {
        if (index > -1) {
            this.selectedIndex = index
            this.bannerForm.controls.id.setValue(this.results[index].id)
            this.bannerForm.patchValue(this.results[index])
            this.thumbnail = this.api.bannerImageUrl(this.results[index].id)
        }
        this.modalRef = this.ms.show(
            modal,
            {
                class: 'modal-xl modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    save(data: any, f: any) {
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')

            return false
        }
        const params = {
            id: this.bannerForm.value.id,
            title: data.value.title,
            banner_link: data.value.banner_link,
            description: data.value.description,
            start_date: moment(data.value.start_date).format('YYYY-MM-DD'),
            end_date: moment(data.value.end_date).format('YYYY-MM-DD')
        }

        fetch(this.thumbnail)
            .then(res => res.blob())
            .then(blob => {
                const imageFile = new Blob([blob])
                const formData = this.api.jsonToFormData(params)
                formData.append('banner_image', imageFile)


                let saveUpdate = this.ds.addBanner(formData)
                if (this.bannerForm.value.id !== null) {
                    saveUpdate = this.ds.updateBanner(formData)
                }
                saveUpdate.subscribe((resp: any) => {
                    if (resp.success === false) {
                        this.alert.error(resp.errors.general)
                        // this.modalRef.hide()
                        // f.resetForm()


                        return false
                    } else {
                        if (this.bannerForm.value.id !== null) {
                            this.alert.success('Changes done successfully!!')
                            this.results[this.selectedIndex] = data.value
                            this.api.bannerImageUrl(this.bannerForm.value.id)
                            // console.log(this.bannerForm.value.id+'_image')
                            //document.getElementById(this.bannerForm.value.id+'_image').setAttribute('src',this.thumbnail)
                            this.bannerForm.controls.id.setValue(null)
                        } else {
                            window.location = resp.data
                            this.modalRef.hide()
                            return
                            this.alert.success('Banner added successfully!!')
                            const mergeParams = {
                                id: resp.data,
                                title: data.value.title,
                                description: data.value.description,
                                status: data.value.status,
                                summary: data.value.summary,
                            }
                            data.value.id = resp.data
                            this.results.push(data.value)
                        }
                    }
                    this.modalRef.hide()
                    f.resetForm()
                })
            })
    }
    calculate(price) {
        const start = moment(this.bannerForm.value.start_date)
        const end = moment(this.bannerForm.value.end_date)
        const days = end.diff(start, 'days')
        if (days == 0 || days < 0) {
            return 'The end date must be a date after start date '
        } else {
            return '$'+days * price
        }
    }
    delete() {
        const params = {
            id: this.selectedId
        }
        this.ds.delete(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()

                    return false
                } else {
                    this.results.splice(this.selectedIndex, 1)
                    this.modalRef.hide()
                    this.alert.success('Banner deleted successfully!!')
                }
            })
    }

    changeStatus() {
        const params = {
            id: this.selectedId
        }
        this.ds.changeStatus(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()

                    return false
                } else {
                    this.results[this.selectedIndex].status = resp.data.status
                    this.modalRef.hide()
                    this.alert.success('Status changed successfully!!')
                }
            })
    }
    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm website' })
    }

    cancelMembershipButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
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
                Object.assign({}, { class: 'modal-lg modal-dialog-centered website' })
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
