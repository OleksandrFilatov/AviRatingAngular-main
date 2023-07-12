import { ApiService } from '../../../services/api.service'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router, NavigationEnd } from '@angular/router';
import { ConstantsService } from 'src/app/services/constants.service'
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown'
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: [
        './header.component.css',
        '/src/assets/css/inner-header.css',
        '/src/assets/css/search.css'
    ],
    providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class HeaderComponent implements OnInit,OnDestroy{
    showSearch: any
    isCollapsed = true
    userImage:string
    userImageSubscription: any
    isAuthenticated = false
    isBusinessOwner = false
    isCenter = false
    isPlaygroup = false
    isAdmin = false
    isTutor = false
    profilePicture: any
    userName: any
    languages = this.cs.LANGUAGES
    businessName = ''
    filterBusiness = {
        business_name : null,
        cat_name : null,
        rating : null,
        zip_code : null,

    }
    constructor(
        public api: ApiService,
        public cs: ConstantsService,
        public router: Router
        ) {
            router.events.pipe(
                filter(event => event instanceof NavigationEnd)
            )
                .subscribe(event => {
                    if (event instanceof NavigationEnd) {
                        const strArr = event.url.split('?')
                        if (strArr[0] == '/') {
                            this.showSearch = false
                        } else {
                            this.showSearch = true
                        }
                    }
                })
        api.userLoggedInObs.subscribe(m => {
            this.isAuthenticated = m
            if (this.isAuthenticated) {
                this.loginUpdates()
            }
        })
    }

    loginUpdates(): void {
        this.isTutor = this.api.isCustomer()
        this.isBusinessOwner = this.api.isBusinessOwner()
        this.isAdmin = this.api.isAdmin()

        // if (this.api.user.user_type === 'tutor') {
        //     this.profilePicture = this.api.baseUrl + '/tutor/profile-picture/' + this.api.user.id
        // } else {
        //     this.profilePicture = this.api.baseUrl + '//profile-picture/' + this.api.user.id
        // }
        // this.userName = this.api.user.name
    }

    ngOnInit() {
        this.userImage = this.api.userImageUrl(this.api.user.id)
        this.userImageSubscription = this.api.userImage.subscribe((resp : string)=>{
            this.userImage = resp
        })
    }

    logOut(): void {
        const check = this.api.logOut()
        if (check) {
            location.reload()
        }
    }

    searchBusiness () {
        const params = {
            page: 1,
            business_name: this.filterBusiness.business_name,
            cat_name: this.filterBusiness.cat_name,
            rating: null,
            zip_code: this.filterBusiness.zip_code,

        }
        this.router.navigate(['/businesses'], { queryParams: params, replaceUrl: true })
    }
    ngOnDestroy() {
        this.userImageSubscription.unsubscribe()
        
    }
}
