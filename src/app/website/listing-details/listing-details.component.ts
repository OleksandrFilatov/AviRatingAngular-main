import { IAlertService } from './../../libs/ialert/ialerts.service'
import { Component, OnInit, ViewChild } from '@angular/core'
import * as moment from 'moment'
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms'
import { ApiService } from 'src/app/services/api.service'
import { ActivatedRoute } from '@angular/router'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { Lightbox } from 'ngx-lightbox'
import { DataService } from './data.service'
import { debounceTime } from 'rxjs/operators'

@Component({
    selector: 'app-listing-details',
    templateUrl: './listing-details.component.html',
    styleUrls: ['./listing-details.component.css']
})
export class ListingDetailsComponent implements OnInit {

    moment = moment
    ratingForm: FormGroup
    @ViewChild('f', { static: false }) private formDirective: NgForm
    listingId: any
    propertyType: any
    postedBy: any
    details: any = {}
    showPhone = false
    dataStatus = 'fetching'
    reviewDataStatus = 'fethcing'
    businessPhoto = '/assets/images/spinner.svg'
    descriptionText: any
    locationMapUrl: any
    listingAddedDuration: any
    albums: Array<any> = []
    reviewsList: any = []
    page = 1
    pagination: any
    scrollbarSub: any
    rating = 0
    tabs = {
        description: 'active',
        location: '',
        contact: ''
    }
    customerCheck = 'login'

    constructor(
        public fb: FormBuilder,
        public api: ApiService,
        public ds: DataService,
        private route: ActivatedRoute,
        public ui: UIHelpers,
        public alert: IAlertService,
        private lightbox: Lightbox

    ) {

        if (api.user.user_type == "customer") {
            this.customerCheck = 'customer'
        } else if (api.user.user_type == "business") {
            this.customerCheck = 'business'
        }

        this.ratingForm = this.fb.group({
            listing_id: new FormControl(null, []),
            rating: new FormControl(0, []),
            feedback: new FormControl(null, [Validators.required, Validators.maxLength(1200)]),
        })

        this.listingId = this.route.snapshot.paramMap.get('id')
        //console.log('id=', this.listingId);
        const params = {
            id: this.listingId
        }
        this.api.listingDetails(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    return false
                } else {
                    this.details = resp.data
                    console.log('asd', this.details)
                    this.dataStatus = 'done'
                    const imageDataThumbnail = {
                        src: this.api.listingSmallThumbnailUrl(this.details.id),
                        caption: '',
                        thumb: ''
                    }
                    this.albums.push(imageDataThumbnail)
                    this.details.listing_images.forEach(d => {
                        const imageData = {
                            src: this.api.getListingImageUrl(d.id),
                            caption: '',
                            thumb: this.api.listingSmallThumbnailUrl(this.details.user_id)
                        }
                        this.albums.push(imageData)
                    })
                    this.listingAddedDuration = moment(this.details.created_at).fromNow()

                    if (this.details === null) {
                        this.dataStatus = 'no-data-found'

                        return false
                    }

                    // this.propertyType = this.operations[this.details.operation]
                    this.postedBy = this.details.user

                    this.businessPhoto = this.api.listingSmallThumbnailUrl(this.details.user_id)
                }
            })

        this.route.queryParams.subscribe(params => {

            if (params.page) {
                this.page = params.page
            }
            if (params) {
                this.getReviews()
            }
        })
    }

    get g() {
        return this.ratingForm.controls
    }

    open(index: number): void {
        // open lightbox
        this.lightbox.open(this.albums, index)
    }

    sendRating(data: any, f: any): boolean {

        if (data.status === 'INVALID') {
            this.alert.error('All fields are required')

            return false
        }
        data.value.rating = this.rating
        data.value.listing_id = this.listingId
        //data.value.name = this.api.user.name

        this.ds.sendRatings(data.value).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
            } else {
                this.alert.success('Review sent successfully!!')
            }

        })
    }
    ngOnInit() {
        this.scrollbarSub = this.api.scrollBottomChange
            .pipe(debounceTime(100))
            .subscribe((resp: any) => {
                if(this.pagination){
                    if (resp === true && +this.page < +this.pagination.last_page) {
                        this.page++
                        this.getReviews()
                    }
                } else {
                    if (resp === true && +this.page) {
                        this.page++
                        this.getReviews()
                    }
                } 
            })
    }

    getReviews() {
        const params = {
            page: this.page
        }
        this.ds.getMyFeedbacks(+this.listingId, params).subscribe((resp: any) => {
            if (resp.success === true && this.page == 1) {
                this.reviewsList = resp.data.data
                console.log('asdf', this.reviewsList);

                this.pagination = resp.data
                this.reviewDataStatus = 'done'
            } else {
                resp.data.data.forEach(d => {
                    this.reviewsList.push(d)
                })
            }
        })

    }

    selectTab(tab: string) {
        this.tabs.description = ''
        this.tabs.location = ''
        this.tabs.contact = ''
        this.tabs[tab] = 'active'
    }

    scroll(el: HTMLElement) {
        el.scrollIntoView()
    }

}
