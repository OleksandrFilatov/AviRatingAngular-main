import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
    selector: 'app-listings',
    templateUrl: './listings.component.html',
    styleUrls: ['./listings.component.css', '/src/assets/css/advance-filters.css']
})
export class ListingsComponent implements OnInit {
    moment = moment
    title = ''
    businessName = ''
    rating = null
    listingsList: any = []
    page = 1
    pagination: any
    results: any
    dataStatus = 'fetching'
    constructor(
        public api: ApiService,
        public router: Router,
        public route: ActivatedRoute

    ) {
        this.route.queryParams.subscribe(params => {

            if (params.page) {
                this.page = params.page
            }

            if (params.hasOwnProperty('business_name')) {
                this.businessName = params.business_name
            }

            if (params.hasOwnProperty('title')) {
                this.title = params.title
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
            title: this.title,
            rating: this.rating
        }
        this.api.listings(params).subscribe((resp: any) => {
            if (resp.success === true) {
                this.results = resp.data.data
                this.pagination = resp.data
                this.dataStatus = 'done'
                this.router.navigate(['/listings'], { queryParams: params, replaceUrl: true })
            }
        })
    }

    setPagination(page: number) {
        let filtersParam: any = {}

        filtersParam = {
            page,
            title: this.title,
            business_name: this.businessName,
            rating: this.rating
        }
        this.router.navigate(['/listings'], { queryParams: filtersParam, replaceUrl: true })
    }
}
