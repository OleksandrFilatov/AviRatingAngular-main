import { ConstantsService } from 'src/app/services/constants.service'
import { ActivatedRoute, Router } from '@angular/router'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Component, OnInit, Input, TemplateRef, ElementRef, ViewChild } from '@angular/core'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { ApiService } from 'src/app/services/api.service'
import { MapsAPILoader } from '@agm/core'
import { BsModalService } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { ImageCroppedEvent } from 'ngx-image-cropper'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import * as moment from 'moment'

declare var google
@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: [
        './registration.component.css',
        '/src/assets/css/responsive.css',
    ]
})
export class RegistrationComponent implements OnInit {
    @ViewChild('search', { static: false }) public searchElementRef: ElementRef
    moment = moment
    registrationFG: FormGroup
    registerStatus = 'inProgress'
    registerUserType: any = 'customer'
    termsAndConditionsCheck = false
    modalRef: BsModalRef
    servicesList
    thumbnail = '/assets/images/upload-icon.svg'
    imageChangedEvent: any = ''
    croppedImage: any = ''
    cropperModalRef: BsModalRef
    selectedServices: any = []
    selectedbusinessCategories: any = []
    public searchControl: FormControl
    latit: any = null
    userType: any
    lngitut: any = null
    businessCategoriesList: any = []
    businessTypeList: any = []
    businessPrice = 0
    days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ]

    airports = []

    airportData = [
        'Airport 1',
        'Airport 2',
        'Airport 3',
        'Airport 4',
        'Airport 5',
    ]

    airportOptions = {
        multiple: true,
    };

    schedules: any = [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ]

    // companyThumbnail = '/assets/images/company-placeholder.png'
    // companyImageChangedEvent: any = ''
    // croppedCompanyImage: any = ''
    // companyCropperModalRef: BsModalRef

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public ui: UIHelpers,
        public api: ApiService,
        private mapsAPILoader: MapsAPILoader,
        private modalService: BsModalService,
        public cs: ConstantsService,
        private alert: IAlertService,
        public route: ActivatedRoute,
    ) {
        this.userType = this.route.snapshot.paramMap.get('user_type')
        this.api.servicesList().subscribe((resp: any) => {
            this.servicesList = resp.data
        })

        this.api.businessCategoriesList().subscribe((resp: any) => {
            this.businessCategoriesList = resp.data
        })

        this.api.businessTypeList().subscribe((resp: any) => {
            this.businessTypeList = resp.data
        })

        this.initializeCustomerForm()
        if (this.userType !== null) {
            this.registerUserType = 'business'
            this.initializeBusinessForm()
        }

        this.api.getAirports({ search_content: '' }).subscribe((resp: any) => {
            this.airports = resp.data;
        })
    }

    initializeBusinessForm() {
        this.registerUserType = 'business'
        this.registrationFG = this.fb.group({
            email: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            zip_code: new FormControl(null, [Validators.required, Validators.maxLength(5)]),
            airport_id: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            state: new FormControl(null, [Validators.required]),
            city: new FormControl(null, [Validators.required]),
            first_name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            password: new FormControl(null, [Validators.required]),
            password_confirmation: new FormControl(null, [Validators.required]),
            opening_time: new FormControl(null, [Validators.required]),
            closing_time: new FormControl(null, [Validators.required, Validators.required]),
            contact: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
            business_category_id: new FormControl(null, [Validators.required]),
            business_type_id: new FormControl(null, [Validators.required]),
            business_price: new FormControl(this.businessPrice, [Validators.required]),
            address: new FormControl(null, [Validators.required]),
            lng: new FormControl(null, []), // done
            lat: new FormControl(null, []), // done
        })
    }

    initializeCustomerForm() {
        this.registerUserType = 'customer'
        this.registrationFG = this.fb.group({
            email: new FormControl(null, [Validators.required, Validators.maxLength(100)]), // done
            first_name: new FormControl(null, [Validators.required, Validators.maxLength(50)]), // done
            last_name: new FormControl(null, [Validators.required, Validators.maxLength(50)]), // done
            password: new FormControl(null, [Validators.required]), // done
            password_confirmation: new FormControl(null, [Validators.required]), // done
            // gender: new FormControl(null, [Validators.required]), // done
            dob: new FormControl(null, [Validators.required]),
            contact_1: new FormControl(null, [Validators.required, Validators.maxLength(20)]), // done
            contact_2: new FormControl(null, [Validators.maxLength(20)]), // done
            // home_airport: new FormControl(null, [Validators.maxLength(150)]), // done
            address: new FormControl(null, [Validators.maxLength(150)]), // done
            lng: new FormControl(null, []), // done
            lat: new FormControl(null, []), // done
            title: new FormControl(null, [Validators.required]), // done
            home_airport: new FormControl(null, [Validators.required]), // done
            aircraft_type: new FormControl(null, [Validators.required]), // done
            aircraft_tail_number: new FormControl(null,[Validators.maxLength(20)]), // done


            // user_name: new FormControl(null, [Validators.required]),
            // title: new FormControl('', []),
        })
    }

    ngOnInit() {
        this.autoCom()
    }

    pushSpliceService(id: number) {
        const index = this.selectedServices.findIndex(d => d === id)
        if (index > -1) {
            this.selectedServices.splice(index, 1)
        } else {
            this.selectedServices.push(id)
        }
    }

    pushSplicebusinessCategories(id: number) {
        const index = this.selectedbusinessCategories.findIndex(d => d === id)
        if (index > -1) {
            this.selectedbusinessCategories.splice(index, 1)
        } else {
            this.selectedbusinessCategories.push(id)
        }
    }


    openModalTermsAndCondition(TCTemplate) {
        this.modalRef = this.modalService.show(
            TCTemplate,
            {
                class: 'modal-lg modal-dialog-centered website',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }



    get g() {
        return this.registrationFG.controls
    }

    requestTimeChange() {
        this.registrationFG.controls.opening_time.setValue(moment(this.registrationFG.value.opening_time).format('YYYY-MM-DD HH:mm:ss'))
    }

    reg(data: any): boolean {
        data.value.lng = this.lngitut
        data.value.lat = this.latit
        data.value.services = this.selectedServices

        if (this.registerUserType === 'business') {
            data.value.business_price = this.businessPrice
            data.value.holidays = this.schedules
            data.value.services = this.selectedServices
        } else {
            data.value.dob = moment(data.value.dob).format('YYYY-MM-DD HH:mm:ss')
        }

        if (this.termsAndConditionsCheck === false) {
            this.alert.error('You should agree to terms and conditions in order to proceed')

            return false
        }
        if (data.status === 'INVALID') {
            this.alert.error('Please fill out valid data in all fields a nd try again')

            return false
        }
        if (this.registerUserType === 'business') {
            data.value.opening_time = moment(data.value.opening_time).format('YYYY-MM-DD HH:mm:ss')
            data.value.closing_time = moment(data.value.closing_time).format('YYYY-MM-DD HH:mm:ss')
        }

        const requiredPromises: Array<any> = []

        const formData = this.api.jsonToFormData(data.value)

        if (this.thumbnail === '/assets/images/upload-icon.svg') {
            this.thumbnail = '/assets/images/no_image.jpg'
        }

        const thumbnailPromise = fetch(this.thumbnail)
            .then(res => res.blob())
            .then(blob => {
                const imageFile = new Blob([blob]) // for microsoft edge support
                formData.append('profile_image', imageFile)
            })
        requiredPromises.push(thumbnailPromise)

        Promise.all(requiredPromises)
            .then(_ => this.sendCall(formData, this.router))
    }

    sendCall(formData: FormData, router: Router): void {
        let saveMethod = this.api.registerBusiness(formData)
        if (this.registerUserType === 'customer') {
            saveMethod = this.api.registerCustomer(formData)
        }
        saveMethod.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                return false
            } else {

                if (resp.data == null) {
                    this.registerStatus = 'done'
                    this.alert.success('Registered successfully')
                    router.navigate(['/login'])
                } else {
                    window.location = resp.data // go to paypal
                }
            }
        })
    }

    browseThumbnail(event: any) {
        event.preventDefault()
        const element = document.getElementById('thumbnail-image')
        element.click()
    }

    onThumbnailChange(event: any, template: TemplateRef<any>) {
        const file = event.target.files[0]
        const allowedExtensions = ['png', 'jpg', 'jpeg']
        const extension = file.name.split('.').pop().toLowerCase()
        const fileSize = file.size / 1024 / 1024
        if (fileSize > 3) {
            this.alert.error('Invalid file size. File size must not exceeds 3MB')
        } else if (allowedExtensions.indexOf(extension) < 0) {
            this.alert.error('Invalid file type. Only png, jpg or jpeg are allowed')
        } else {
            this.imageChangedEvent = event
            this.cropperModalRef = this.modalService.show(
                template,
                Object.assign({}, { class: 'modal-md modal-dialog-centered website' })
            )
        }
    }

    doneCroppingThumbnail() {
        this.thumbnail = this.croppedImage
        document.getElementById('banner-img').setAttribute('src', this.thumbnail)
        this.cropperModalRef.hide()
    }

    // company thumbnail
    browseCompanyThumbnail(event: any) {
        event.preventDefault()
        const element = document.getElementById('company-thumbnail-image')
        element.click()
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64
    }


    imageLoaded() {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }

    isDefault(g: any): boolean {
        return g.id.value === '' || (g.id.value > 0 && !g.is_default.value)
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
                        this.registrationFG.controls.address.setValue(address)
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
                this.registrationFG.controls.address.setValue(place.formatted_address)

            })
        })
    }

    getPrice(val) {
        const index = this.businessTypeList.findIndex(d => d.id === val)
        this.businessPrice = this.businessTypeList[index].price
    }
}
