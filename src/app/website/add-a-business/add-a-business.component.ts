import { ApiService } from '../../services/api.service'
import { Component, OnInit, Input, TemplateRef, ElementRef, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { MapsAPILoader } from '@agm/core'

@Component({
    selector: 'app-add-a-business',
    templateUrl: './add-a-business.component.html',
    styleUrls: [
        './add-a-business.component.css',
        '/src/assets/css/resets.css',
        '/src/assets/css/inner-header.css',
        '/src/assets/css/advance-filters.css',
        '/src/assets/css/home-banner.css',
        '/src/assets/css/search.css',
        '/src/assets/css/responsive.css',
    ]
})
export class AddAbusinessComponent implements OnInit {
    @ViewChild('search', { static: false }) public searchElementRef: ElementRef
    loginError: string
    businessForm: FormGroup
    rating = 0
    businessCategoriesList: any = []
    status = 'inprogress'
    latit: any = null
    lngitut: any = null
    businessTypeList: any = []
    public searchControl: FormControl
    constructor(
        private api: ApiService,
        private router: Router,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private mapsAPILoader: MapsAPILoader,
    ) {
        const userType = this.api.user.user_type

        if (userType === 'admin') {
            this.router.navigate(['/'])
        } else if (userType === '') {
            this.router.navigate(['/'])
        }
        this.businessForm = this.fb.group({
            first_name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            contact: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
            zip_code: new FormControl(null, [Validators.required, Validators.maxLength(10)]),
            business_category_id: new FormControl(null, [Validators.required]),
            business_type_id: new FormControl(null, [Validators.required]),
            address: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
            city: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            state: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            description: new FormControl(null, [Validators.maxLength(500)]),
            rating: new FormControl(null, []),
            feedback: new FormControl(null, [Validators.required, Validators.maxLength(1200)]),
            lng: new FormControl(null, []), //done
            lat: new FormControl(null, []), //done
        })

        this.api.businessCategoriesList().subscribe((resp: any) => {
            this.businessCategoriesList = resp.data
        })

        this.api.businessTypeList().subscribe((resp: any) => {
            this.businessTypeList = resp.data
        })
    }

    ngOnInit() {
        this.autoCom()
    }

    save(data: any, f: any): boolean {

        if (data.status === 'INVALID') {
            this.alert.error('All fields are required')

            return false
        }
        data.value.rating = this.rating
        data.value.lng = this.lngitut
        data.value.lat = this.latit
        //data.value.name = this.api.user.name

        this.api.addBusiness(data.value).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
            } else {
               this.status = 'done'
            }

        })
    }
    get g() {
        return this.businessForm.controls
    }

    getLocation(): void {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.lngitut = position.coords.longitude
                this.latit = position.coords.latitude
                this.mapsAPILoader.load().then(() => {
                    const geocoder = new google.maps.Geocoder()
                    const latlng = new google.maps.LatLng(this.latit, this.lngitut)
                    const request = {
                        location: latlng
                    }
                    geocoder.geocode(request, (results, status) => {
                        const address = results[0].formatted_address
                        this.businessForm.controls.address.setValue(address)
                    })
                })
            })
        } else {
            this.alert.error('Unable to get current location')
        }
    }

    autoCom(): void {
        this.searchControl = new FormControl()
        this.mapsAPILoader.load().then(() => {
            const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ['address']
            })
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace()
                if (place.geometry === undefined || place.geometry === null) {
                    return
                }
                this.latit = place.geometry.location.lat()
                this.lngitut = place.geometry.location.lng()
                this.businessForm.controls.address.setValue(place.formatted_address)

            })
        })
    }
}
