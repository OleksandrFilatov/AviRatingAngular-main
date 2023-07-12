import { Router, NavigationEnd } from '@angular/router';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { ApiService } from '../../../services/api.service'
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core'
import { ConstantsService } from 'src/app/services/constants.service'
import { filter } from 'rxjs/operators';
declare var navigator: any
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: [
        './header.component.css',
        '/src/assets/css/resets.css',
        '/src/assets/css/inner-header.css',
        '/src/assets/css/home-banner.css',
        '/src/assets/css/search.css',
        '/src/assets/css/responsive.css',
    ],
    providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class HeaderComponent implements OnInit {
    @ViewChild('header') elm: ElementRef
    bannerIndex = 1
    pageName = ''
    showSearch: any
    showFilter: any = false
    isCollapsed = true
    isAuthenticated = false
    isBussinessOwner = false
    isCustomer = false
    isPlaygroup = false
    isAdmin = false
    isTutor = false
    profilePicture: any
    userName: any
    // newNotification = 0
    headerinterval: any

    title = ''
    businessName = ''
    filterBusiness = {
        business_name: null,
        cat_name: null,
        rating: null,
        zip_code: null,
        lat: null,
        lng: null,
        radius: null,
        city: null,
        state: null,
        airport_id: null,
        dropdown_filter: null

    }
    businessCategoriesList: any = []
    constructor(
        public api: ApiService,
        public cs: ConstantsService,
        public router: Router,
        public renderer2: Renderer2
    ) {
        router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        )
            .subscribe(event => {
                if (event instanceof NavigationEnd) {
                    const strArr = event.url.split('?')
                    if (strArr[0] == '/') {
                        this.showSearch = false
                        this.pageName = ''

                    } else if (strArr[0] == '/login' || strArr[0] == '/registration' || strArr[0] == '/registration/owner' || strArr[0] == '/registration/business' || strArr[0] == '/forgot-password') {

                        this.showSearch = 'login'
                        this.showFilter = 'login'
                        this.pageName = ''
                    } else if (strArr[0] == '/listings') {
                        this.showSearch = true
                        this.showFilter = true
                        this.pageName = 'listings'
                    }
                    else {
                        this.showSearch = true
                        this.pageName = ''
                    }
                }
            })
        api.userLoggedInObs.subscribe(m => {
            this.isAuthenticated = m
            if (this.isAuthenticated) {
                this.loginUpdates()
            }
        })
        this.api.businessCategoriesList().subscribe((resp: any) => {
            this.businessCategoriesList = resp.data
        })
        this.getNewNotification()
    }

    getNewNotification() {
        this.api.getNewNotification().subscribe((resp: any) => {
            // this.newNotification = resp.data;
            this.api.newNotification = resp.data
        })
    }

    loginUpdates(): void {
        this.isCustomer = this.api.isCustomer()
        this.isBussinessOwner = this.api.isBusinessOwner()
        this.isAdmin = this.api.isAdmin()

        if (this.api.user.user_type === 'tutor') {
            this.profilePicture = this.api.baseUrl + '/customer/profile-picture/' + this.api.user.id
        } else {
            this.profilePicture = this.api.baseUrl + '/busniess-owner/profile-picture/' + this.api.user.id
        }
        this.userName = this.api.user.name
    }

    ngOnInit() {
        // navigator.geolocation.getCurrentPosition((position: any) => {
        //     this.filterBusiness.lat = position.coords.latitude
        //     this.filterBusiness.lng = position.coords.longitude
        // })
        // this.getNewNotification();
        // this.headerinterval = setInterval(() => {
        //   this.getNewNotification(); 
        // }, 3000);
    }
    ngOnDestroy() {
        // if (this.headerinterval) {
        //   clearInterval(this.headerinterval);
        // }
    }
    ngAfterViewInit() {
        setInterval(() => {
            if (!this.elm) {
                return false
            }
            if (this.bannerIndex === 4) {
                this.bannerIndex = 1
            }
            this.renderer2.setStyle(this.elm.nativeElement, 'background', 'url(/assets/images/' + this.bannerIndex + '.jpg)')
            this.bannerIndex++
        }, 5000)
    }

    logOut(): void {
        const check = this.api.logOut()
        if (check) {
            location.reload()
        }
    }
    searchBusiness() {

        const params = {
            page: 1,
            business_name: this.filterBusiness.business_name,
            cat_name: this.filterBusiness.cat_name,
            rating: null,
            zip_code: this.filterBusiness.zip_code,
            state: this.filterBusiness.state,
            city: this.filterBusiness.city,
            airport_id: this.filterBusiness.airport_id,
            radius: this.filterBusiness.radius,
            lat: '',
            lng: ''
        }
        if (this.filterBusiness.radius > 0) {
            params.lat = this.filterBusiness.lat
            params.lng = this.filterBusiness.lng
        } else {
            params.lat = ''
            params.lng = ''
        }

        this.router.navigate(['/businesses'], { queryParams: params, replaceUrl: true })
    }
    searchList() {
        const params = {
            page: 1,
            title: this.title,
            business_name: this.businessName,
            rating: null,
            state: this.filterBusiness.state,
            city: this.filterBusiness.city,
            airport_id: this.filterBusiness.airport_id
        }
        this.router.navigate(['/listings'], { queryParams: params, replaceUrl: true })
    }
    selectOption(e) {
        if (e.target.value == 'state') {
            this.filterBusiness.city = null
            this.filterBusiness.airport_id = null
        } else if (e.target.value == 'city') {
            this.filterBusiness.state = null
            this.filterBusiness.airport_id = null
        } else if (e.target.value == 'airport') {
            this.filterBusiness.state = null
            this.filterBusiness.city = null
        } else {
            this.filterBusiness.state = null
            this.filterBusiness.city = null
            this.filterBusiness.airport_id = null
        }
    }
}
