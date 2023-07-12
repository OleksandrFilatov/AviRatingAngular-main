import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { DataService } from './data.service'
import { ApiService } from 'src/app/services/api.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { BsModalRef } from 'ngx-bootstrap/modal'
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
    selectedIndex = -1
    loggedInId: any
    toId: any
    showMore = true
    reviewCustomlength = 5
    page = 1
    pagination: any
    constructor(
        public tutorApi: DataService,
        public api: ApiService,
        public ui: UIHelpers,
        public router: Router,
        private route: ActivatedRoute,
        private lightbox: Lightbox,
    ) {
        this.route.queryParams.subscribe(params => {

            if (params.page) {
                this.page = params.page
            }
            if (params) {
                this.getReviews()
            }
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

    setPagination(page: number) {
        this.page = page
        this.getReviews()
    }

    getReviews() {
        const params = {
            page: this.page
        }
        this.tutorApi.getMyFeedbacks(this.api.user.id, params).subscribe((resp: any) => {
            if (resp.success === true && this.page == 1) {
                this.reviewsList = resp.data.data
                this.pagination = resp.data
                this.dataStatus = 'done'
            } else {
                resp.data.data.forEach(d => {
                    this.reviewsList.push(d)
                })
            }
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
