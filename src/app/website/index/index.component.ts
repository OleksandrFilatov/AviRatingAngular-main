import { Subject } from 'rxjs';
import { Router } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { ApiService } from '../../services/api.service'
import { DataService } from './data.service'
import * as moment from 'moment';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: [
        './index.component.css',
        '/src/assets/css/listings.css',
        '/src/assets/css/categories.css',
        '/src/assets/css/recent-ratings.css',
    ]
})
export class IndexComponent implements OnInit {
    moment = moment
    results: any = []
    dataStatus = 'fecting'
    bannerStatus = 'fecting'
    bannersList:any = []
    bannerIndex = 0
    banner = {
        id : '',
        title : '',
        bannerLink : '',
        description : ''
    }

    constructor(
        public api: ApiService,
        private route: Router,
        private dataService: DataService,
    ) {
        this.dataService.getHome().subscribe((resp: any) => {
            if (resp.success === true) {
                this.results = resp.data
                this.bannersList = resp.data.homepage_banners
                this.dataStatus = 'done'
                if(this.bannersList.length > 0){
                    this.showBanners()
                }
            }
        })
    }

    ngOnInit() {
    }
    showBanners(){
        if(this.bannersList.length > 0){
            setInterval(() => {
                this.bannerStatus = 'done'
                if(this.bannerIndex==this.bannersList.length){
                    this.bannerIndex = 0
                }
                this.banner.id = this.api.bannerImageUrl(this.bannersList[this.bannerIndex].id)
                this.banner.bannerLink = this.bannersList[this.bannerIndex].banner_link
                this.banner.title = this.bannersList[this.bannerIndex].title
                this.banner.description = this.bannersList[this.bannerIndex].description
                this.bannerIndex++
             }, 3000)
         }
    }

}
