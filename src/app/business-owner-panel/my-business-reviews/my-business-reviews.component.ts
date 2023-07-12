import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { DataService } from './data.service'
import { ApiService } from 'src/app/services/api.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { debounceTime } from 'rxjs/operators'
import { ActivatedRoute, Router } from '@angular/router'
import { NgScrollbar } from 'ngx-scrollbar'
import { Lightbox } from 'ngx-lightbox'

@Component({
    selector: 'app-my-business-reviews',
    templateUrl: './my-business-reviews.component.html',
    styleUrls: ['./my-business-reviews.component.scss']
})
export class MyBusinessReviewsComponent implements OnInit {
    albums: Array<any> = []
    @ViewChild(NgScrollbar, { static: false }) scrollRef: NgScrollbar
    reviewsList: any = []
    fromName: any
    scrollbarSub: any
    chatLogList: any = []
    dataStatus = 'fetching'
    chatLogStatus = 'fetching'
    modalRef: BsModalRef
    messageForm: FormGroup
    selectedIndex: any = -1
    loggedInId: any
    toId: any
    showMore = true
    reviewCustomlength = 5
    page = 1
    pagination: any
    replyForm: FormGroup
    feedbackValue: any = ''
    selectedObject: any = {}
    reviewPriceList = []
    selectedReviewId = null
    repliesLeft = false
    spinnerSVG: string
    uploadedImages = []
    reviewId: any = ''
    constructor(
        public ds: DataService,
        public api: ApiService,
        public ui: UIHelpers,
        public router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private ms: BsModalService,
        private alert: IAlertService,
        private lightbox: Lightbox,
    ) {
        this.spinnerSVG = `/assets/images/spinner.svg`
        this.route.queryParams.subscribe(params => {

            if (params.page) {
                this.page = params.page
            }
            if (params) {
                this.getReviews()
            }
        })
        this.ds.reviewPriceList().subscribe((resp: any) => {
            if (resp.success == true) {
                this.reviewPriceList = resp.data
                console.log('review price list=', this.reviewPriceList)

            }
        })
        this.replyForm = this.fb.group({
            id: new FormControl(null),
            reply: new FormControl(null, [Validators.required, Validators.maxLength(500)])
        })
    }

    ngOnInit() {
        this.scrollbarSub = this.api.scrollBottomChange
            .pipe(debounceTime(100))
            .subscribe((resp: any) => {
                if (resp === true && +this.page < +this.pagination.last_page) {
                    this.page++
                    this.getReviews()
                }
            })
    }

    checkRemainingReplies(replyTemplate: TemplateRef<any>, index: number) {
        this.ds.checkRemainingReplies().subscribe((resp: any) => {
            if (resp.success == true) {
                this.repliesLeft = true
            } else {
                this.repliesLeft = false

            }
            this.openReplyModal(replyTemplate, index)
        }) //check if bussiness can replies 
    }
    purchaseReplies(data: any) {
        // purchase replies call
        this.ds.buyReplies({ id: data.id }).subscribe((resp: any) => {
            if (resp.success == true) {
                console.log('data', resp.data)
                window.location = resp.data
            } else {
                this.alert.error(resp.errors.general)
            }
        })
        // purchase replies call end
    }

    cancelMembershipButton(f?: any) {
        f?.resetForm()
        this.uploadedImages = []
        this.modalRef.hide()
    }
    setPagination(page: number) {
        this.page = page
        this.getReviews()
    }

    getReviews() {
        const params = {
            page: this.page
        }
        this.ds.getMyFeedbacks(this.api.user.id, params).subscribe((resp: any) => {
            if (resp.success === true && this.page == 1) {
                this.reviewsList = resp.data.data
                this.pagination = resp.data
                this.dataStatus = 'done'
                console.log(this.dataStatus)
            } else {
                resp.data.data.forEach(d => {
                    this.reviewsList.push(d)
                })
            }
        })

    }
    get g() {
        return this.replyForm.controls
    }
    openReplyModal(modal, index) {
        if (index > -1) {
            this.selectedIndex = index
            this.reviewId = this.reviewsList[index].id
            this.feedbackValue = this.reviewsList[index].feedback
            this.replyForm.controls.id.setValue(this.reviewsList[index].id)
            console.log('inside if');

        }
        this.modalRef = this.ms.show(
            modal,
            {
                class: 'modal-lg modal-dialog-centered admin-panel',
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

        let saveUpdate = this.ds.sentReply(data.value)

        saveUpdate.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                // this.modalRef.hide()
                // f.resetForm()


                return false
            } else {
                if (this.replyForm.value.id !== null) {
                    this.alert.success('Reply Sent successfully!!')
                    this.reviewsList[this.selectedIndex].reply = this.replyForm.value.reply
                    this.reviewsList[this.selectedIndex].reply_date = resp.data.reply_date
                    this.reviewsList[this.selectedIndex].reply_images = this.uploadedImages
                    this.replyForm.controls.id.setValue(null)
                }
            }
            this.uploadedImages = []
            this.modalRef.hide()
            f.resetForm()
        })
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
        const allowedExtensions = ['png', 'jpg', 'jpeg']
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
                formData.append('review_id', this.reviewId)
                this.ds.uploadImage(formData).subscribe((resp: any) => {
                    this.uploadedImages[index].id = resp.data
                    this.uploadedImages[index].uploading = false
                })
            })
    }

    deleteImage(index: number) {
        this.uploadedImages[index].image = this.spinnerSVG
        const params = {
            id: this.uploadedImages[index].id
        }
        this.ds.deleteImage(params).subscribe(resp => {
            this.uploadedImages.splice(index, 1)
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
}