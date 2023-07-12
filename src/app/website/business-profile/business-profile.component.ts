import { IAlertService } from './../../libs/ialert/ialerts.service'
import { ConstantsService } from './../../services/constants.service'
import { ApiService } from 'src/app/services/api.service'
import { Component, OnInit } from '@angular/core'
import { DataService } from './data.service'
import { ActivatedRoute, Router } from '@angular/router'
import * as moment from 'moment'
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { debounceTime } from 'rxjs/operators'
import { BsModalService } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { Lightbox } from 'ngx-lightbox'
import { appURL } from 'src/environments/environment'

@Component({
    selector: 'app-business-profile',
    templateUrl: './business-profile.component.html',
    styleUrls: ['./business-profile.component.css']
})
export class BusinessProfileComponent implements OnInit {
    albums: Array<any> = []
    spinnerSVG: string
    uploadedImages = []
    propertyId: number
    bId
    respId: any
    thumbnail: any
    rating = 0
    ratingForm: FormGroup
    moment = moment
    time = this.cs.DATE_TIME_FORMAT.TIME
    businessId: any
    businessProfileDetails: any
    listingDataStatus = 'fetching'
    profileDataStatus = 'fetching'
    customerCheck = 'login'
    page = 1
    scrollbarSub: any
    pagination: any
    results: any
    reviewDataStatus = 'fetching'
    reviewsList: any = []
    modalRef: BsModalRef
    claimForm: FormGroup
    days = ConstantsService.DAYS
    businessPrice = 0
    constructor(
        private lightbox: Lightbox,
        public fb: FormBuilder,
        public ds: DataService,
        public ui: UIHelpers,
        public api: ApiService,
        private route: ActivatedRoute,
        public router: Router,
        public cs: ConstantsService,
        public alert: IAlertService,
        private modalService: BsModalService,
    ) {

        this.bId = this.route.parent.snapshot.url[1].path
        // this.queryIndex = this.route.snapshot.queryParamMap.get('index')
        if (api.user.user_type == "customer") {
            this.customerCheck = 'customer'
        } else if (api.user.user_type == "business") {
            this.customerCheck = 'business'
        }
        this.businessId = this.route.snapshot.paramMap.get('id')
        this.api.businessProfile(this.businessId).subscribe((resp: any) => {
            if (resp.success == false) {
                this.router.navigate(['/businesses/'])

                return false;
            }
            this.businessProfileDetails = resp.data.business
            this.businessPrice = this.businessProfileDetails.business_type.price
            this.results = resp.data.listings
            this.profileDataStatus = 'done'
        })
        this.ratingForm = this.fb.group({
            business_id: new FormControl(null, []),
            rating: new FormControl(0, []),
            feedback: new FormControl(null, [Validators.required, Validators.maxLength(1200)]),
        })

        this.claimForm = this.fb.group({
            business_id: new FormControl(null, []),
            id: new FormControl(null),
            name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            email: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            contact_no: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
            business_price: new FormControl(this.businessPrice, [Validators.required])
        })

        this.route.queryParams.subscribe(params => {
            if (params.page) {
                this.page = params.page
            }
            if (params.user_id) {
                this.businessId = params.user_id
            }
            this.getReviews()
        })

        {
            this.spinnerSVG = `/assets/images/spinner.svg`
            this.thumbnail = this.spinnerSVG
        }
    }

    ngOnInit() {
        this.scrollbarSub = this.api.scrollBottomChange
            .pipe(debounceTime(100))
            .subscribe((resp: any) => {

                if (this.reviewDataStatus == 'done' && resp === true) {
                    if (this.page < +this.pagination.last_page) {
                        this.page++
                        this.getReviews()

                    }
                }
            })

        if (this.api.user.user_type == "customer") {
            this.ds.getId(this.bId).subscribe((resp: any) => {
                if (resp.success === true) {
                    this.respId = resp.data
                }
                else {
                    console.log('some error');

                }


            })
        }
        // this.propertyId = this.ds.propertyDetails.id
        // console.log(this.thumbnail)
        // this.ds.propertyDetails.images.forEach((img: any) => {
        //     this.uploadedImages.push({
        //         id: img.id,
        //         image: this.ds.imageUrl(img.id)
        //     })
        // })

    }
    getReviews() {
        const params = {
            page: this.page
        }
        this.ds.getMyFeedbacks(+this.businessId, params).subscribe((resp: any) => {
            if (resp.success === true && this.page == 1) {
                this.reviewsList = resp.data.data
                this.pagination = resp.data
                this.reviewDataStatus = 'done'
            } else {
                resp.data.data.forEach(d => {
                    this.reviewsList.push(d)
                })
            }
        })

    }
    sendRating(data: any, f: any): boolean {

        if (data.status === 'INVALID') {
            this.alert.error('All fields are required')

            return false
        }
        const params = {
            id: this.respId,
            rating: this.rating,
            feedback: data.value.feedback,
            business_id: this.businessId,
            name: this.api.user.name

        }

        // data.value.business_id = this.businessId
        // data.value.name = this.api.user.name

        this.ds.sendRatings(params).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
            } else {
                this.alert.success('Review sent successfully!!')
            }

        })
    }
    claimBusiness(data: any, f: any): boolean {

        if (data.status === 'INVALID') {
            this.alert.error('All fields are required')

            return false
        }
        data.value.business_id = this.businessId
        data.value.business_price = this.businessPrice

        this.ds.claimBusiess(data.value).subscribe((resp: any) => {
            if (resp.success == false) {
                this.alert.error(resp.errors.general)
            } else {
                if (resp.data) {
                    window.location = resp.data
                } else {
                    this.alert.success('Claim Request Submitted!!')
                    this.modalRef.hide()
                }
            }

        })
    }
    getList() {
        /* const params = {
             page: this.page,
             user_id:this.businessId
         }
         this.ds.listings(params).subscribe((resp: any) => {
             if (resp.success === true) {
                 this.results = resp.data.data
                 this.pagination = resp.data
                 this.listingDataStatus = 'done'
                 console.log(this.results)
                 this.router.navigate(['/business-profile/' + this.businessId], { queryParams: params, replaceUrl: true })
             }
         })*/
    }

    setPagination(page: number) {
        let filtersParam: any = {}

        filtersParam = {
            page,
            user_id: this.businessId
        }
        this.router.navigate(['/business-profile/' + this.businessId], { queryParams: filtersParam, replaceUrl: true })
    }
    scroll(el: HTMLElement) {
        el.scrollIntoView()
    }

    get g() {
        return this.ratingForm.controls
    }

    get c() {
        return this.claimForm.controls
    }
    openModal(claim) {
        this.modalRef = this.modalService.show(
            claim,
            {
                class: 'modal-lg modal-dialog-centered website',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }
    browseImages(event: any) {
        event.preventDefault()
        const element = document.getElementById('other-images')
        element.click()
    }

    onImagesChange(event: any) {
        this.uploadFiles(event.target.files)
    }

    uploadFiles(files: FileList) {
        const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif']
        const defaulterFiles = []

        Array.from(files).forEach((file: any) => {
            const extension = file.name.split('.').pop().toLowerCase()
            if (allowedExtensions.indexOf(extension) > -1) {
                this.readFile(file)
            } else {
                defaulterFiles.push(file.name)
                this.alert.error(`${file.name} has an invalid file type. Only png, jpg or jpeg are allowed`)
            }
        })
    }

    readFile(file: any) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = (e: any) => {
            const index = this.uploadedImages.length
            this.uploadedImages.push({
                id: -1,
                image: reader.result,
                uploading: true
            })
            this.uploadImage(reader.result, index)
        }
    }

    uploadImage(imageData: any, index: number) {
        fetch(imageData)
            .then(res => res.blob())
            .then(blob => {
                const imageFile = new Blob([blob]) // for microsoft edge support
                const formData = new FormData()
                formData.append('image', imageFile)
                formData.append('business_review_id', this.respId)
                this.ds.uploadImage(formData).subscribe((resp: any) => {
                    this.uploadedImages[index].id = resp.data
                    this.uploadedImages[index].uploading = false
                })
            })
    }

    imageDragStart(e: any): void {
        e.preventDefault()
        e.target.classList.add('highlight')
    }

    imageDragEnd(e: any): void {
        e.preventDefault()
        e.target.classList.remove('highlight')
    }

    imageDropped(e: any): void {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer && e.dataTransfer.files.length) {
            this.uploadFiles(e.dataTransfer.files)
        }
        e.target.classList.remove('highlight')
    }

    deleteImage(index: number) {
        this.uploadedImages[index].image = this.spinnerSVG
        const id = this.uploadedImages[index].id
        this.ds.deleteImage(id).subscribe(resp => {
            this.uploadedImages.splice(index, 1)
            const i = this.uploadedImages.findIndex((img: any) => img.id === id)
            this.uploadedImages.splice(i, 1)
        })
    }
    openGallery(index, galleryType, images: any) {
        this.albums = []
        let show = false
        if (galleryType == 'review') {

            images.forEach(d => {
                const imageData = {
                    src: this.api.reviewImageUrl(d.id),
                    caption: '',
                    thumb: this.api.reviewImageUrl(d.id)
                }
                this.albums.push(imageData)
            })
            show = true
        } else if (galleryType == 'reply') {

            images.forEach(d => {
                const imageData = {
                    src: this.api.replyImageUrl(d.id),
                    caption: '',
                    thumb: this.api.replyImageUrl(d.id)
                }
                this.albums.push(imageData)
            })
            show = true
        }
        if (show == true) {
            this.open(index)
        }
    }
    open(index: number): void {
        // open lightbox
        this.lightbox.open(this.albums, index, {
            alwaysShowNavOnTouchDevices: true,
            disableScrolling: true,
            albumLabel: '',
            wrapAround: true,
            showImageNumberLabel: true,
            centerVertically: true
        }
        )
    }
    profileUrl() {
        return `${appURL}/business-profile/${this.businessId}`
    }
}
