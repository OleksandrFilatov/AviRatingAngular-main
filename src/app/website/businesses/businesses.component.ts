import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';


@Component({
    selector: 'app-businesses',
    templateUrl: './businesses.component.html',
    styleUrls: ['./businesses.component.css', '/src/assets/css/advance-filters.css']
})
export class BusinessesComponent implements OnInit {
    userType = ''
    customerCheck = 'login'
    msg = ''
    moment = moment
    modalRef: BsModalRef
    catName = ''
    zipCode = ''
    businessName = ''
    state = null
    city = null
    airportId = null
    rating = null
    lat = null
    lng = null
    radius = null
    listingsList: any = []
    page = 1
    pagination: any
    results: any
    dataStatus = 'fetching'
    constructor(
        public api: ApiService,
        public router: Router,
        public route: ActivatedRoute,
        private ms: BsModalService,

    ) {
        if (api.user.user_type == "customer") {
            this.customerCheck = 'customer'
        } else if (api.user.user_type == "business") {
            this.customerCheck = 'business'
        }
        this.route.queryParams.subscribe(params => {
            if (params.page) {
                this.page = params.page
            }

            if (params.hasOwnProperty('business_name')) {
                this.businessName = params.business_name
            }

            if (params.hasOwnProperty('cat_name')) {
                this.catName = params.cat_name
            }
            if (params.hasOwnProperty('zip_code')) {
                this.zipCode = params.zip_code
            }
            if (params.hasOwnProperty('state')) {
                this.state = params.state
            } else {
                this.state = null
            }
            if (params.hasOwnProperty('city')) {
                this.city = params.city
            } else {
                this.city = null
            }
            if (params.hasOwnProperty('airport_id')) {
                this.airportId = params.airport_id
            } else {
                this.airportId = null
            }
            if (params.hasOwnProperty('lat')) {
                this.lat = params.lat
            }
            if (params.hasOwnProperty('lng')) {
                this.lng = params.lng
            }
            if (params.hasOwnProperty('radius')) {
                this.radius = params.radius
            }

            if (params.hasOwnProperty('rating')) {
                this.rating = params.rating
            }

            if (params) {
                this.getList()
            }
        })
    }

    ngOnInit() {
    }
    getList() {
        const params = {
            page: this.page,
            business_name: this.businessName,
            cat_name: this.catName,
            rating: this.rating,
            zip_code: this.zipCode,
            state: this.state,
            city: this.city,
            airport_id: this.airportId,
            lat: this.lat,
            lng: this.lng,
            radius: this.radius
        }
        this.api.businessListings(params).subscribe((resp: any) => {
            if (resp.success === true) {
                this.results = resp.data.data
                this.pagination = resp.data
                this.dataStatus = 'done'
                this.router.navigate(['/businesses'], { queryParams: params, replaceUrl: true })
            }
        })
    }

    setPagination(page: number) {
        let filtersParam: any = {}

        filtersParam = {
            page,
            business_name: this.businessName,
            cat_name: this.catName,
            zip_code: this.zipCode,
            state: this.state,
            city: this.city,
            airport_id: this.airportId,
            lat: this.lat,
            lng: this.lng,
            radius: this.radius,
            rating: this.rating
        }
        this.router.navigate(['/businesses'], { queryParams: filtersParam, replaceUrl: true })
    }

    openModal(modal, index) {
        this.modalRef = this.ms.show(
            modal,
            {
                class: 'modal-sm modal-dialog-centered admin-panel',
            }
        )
    }

    cancel() {
        this.modalRef.hide()
    }

    checkLogin(type) {
        if (this.customerCheck == 'login') {
            if (type == 'customer') {
                this.userType = 'customer'
            }
            if (type == 'business') {
                this.cancel()
                this.router.navigate(['/registration/owner'])
            }
        }
        if (this.customerCheck == 'customer') {
            if (type == 'customer') {
                this.cancel()
                this.router.navigate(['/add-a-business'])
            }
            if (type == 'business') {
                this.userType = 'business'
            }
        }

        if (this.customerCheck == 'business') {

            if (type == 'customer') {
                this.userType = 'customer'
            }
        }

    }

    logOut(): void {
        const check = this.api.logOut()
        if (check) {
            location.reload()
        }
    }
}
