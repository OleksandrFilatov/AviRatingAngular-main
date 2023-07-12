import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { DataService } from './data.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { Component, OnInit, Input, TemplateRef, ViewChild, ElementRef } from '@angular/core'
import { ImageCroppedEvent } from 'ngx-image-cropper'
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { ApiService } from 'src/app/services/api.service'
import * as moment from 'moment'
import { getTime } from 'ngx-bootstrap/chronos/utils/date-getters'
import { MapsAPILoader } from '@agm/core'

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: [
        './profile.component.css',
    ],
    providers: [DataService]
})
export class ProfileComponent implements OnInit {
    @ViewChild('search', { static: false }) public searchElementRef: ElementRef
    @Input() modalRef: BsModalRef
    public searchControl: FormControl
    lat: any = null
    lng: any = null
    businessCatStatus = 'fetching'
    amenitiesStatus = 'featching'
    servicesStatus = 'featching'
    dataStatus = 'featching'
    profileFG: FormGroup
    businessCategoriesList: any = []
    profileData: any
    selectedbusinessCategories: any = []
    servicesList
    amenityList
    selectedServices: any = []
    requestTimeValid: any
    thumbnail = '/assets/images/user-placeholder.png'
    imageChangedEvent: any = ''
    croppedImage: any = ''
    schedules = this.api.user.business.business_schedule
    services = []
    amenities = []
    cropperModalRef: BsModalRef
    disabledUserData = {
        userName: this.api.user.user_name,
        email: this.api.user.email,
    }
    days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ]
    closingTime: any = null
    openingTime: any = null
    constructor(
        private fb: FormBuilder,
        public ui: UIHelpers,
        private dataService: DataService,
        public api: ApiService,
        private modalService: BsModalService,
        private alert: IAlertService,
        private mapsAPILoader: MapsAPILoader
    ) {
        const user = this.api.user

        this.api.user.business.business_services.forEach((bs: any) => {
            this.services.push(bs.service_id)
        })

        this.api.user.business.business_amenities.forEach((ba: any) => {
            this.amenities.push(ba.amenity_id)
        })

        this.api.businessCategoriesList().subscribe((resp: any) => {
            this.businessCategoriesList = resp.data
            this.businessCatStatus = 'done'
        })

        this.api.servicesList().subscribe((resp: any) => {
            this.servicesList = resp.data
            this.servicesStatus = 'done'
        })

        this.api.amenityList().subscribe((resp: any) => {
            this.amenityList = resp.data
            this.amenitiesStatus = 'done'
        })
    }



    get g() {
        return this.profileFG.controls
    }

    ngOnInit() {

        const user = this.api.user

        if(user.business.opening_time!=null) {
            this.openingTime = new Date('2020-11-11 ' + user.business.opening_time)
        }
        if(user.business.closing_time!=null) {
            this.closingTime = new Date('2020-11-11 ' + user.business.closing_time)
        }
        const webUrlPatteren = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
        this.profileFG = this.fb.group({
            first_name: new FormControl(user.first_name, [Validators.required, Validators.maxLength(40)]),
            zip_code: new FormControl(user.business.zip_code, [Validators.required, Validators.maxLength(5)]),
            airport_id: new FormControl(user.business.airport_id, [Validators.required, Validators.maxLength(100)]),
            state: new FormControl(user.business.state, [Validators.required]),
            city: new FormControl(user.business.city, [Validators.required]),
            description: new FormControl(user.business.description, [Validators.required, Validators.maxLength(500)]),
            contact: new FormControl(user.business.contact, [Validators.maxLength(15)]),
            address: new FormControl(user.business.address, [Validators.required, Validators.maxLength(500)]),
            lat: new FormControl(user.business.lat, []),
            lng: new FormControl(user.business.lng, []),
            business_category_id: new FormControl(user.business.business_category_id, [Validators.maxLength(15)]),
            opening_time: new FormControl(this.openingTime , [Validators.required]),
            closing_time: new FormControl(this.closingTime , [Validators.required]),
            website: new FormControl(user.business.website , [Validators.pattern(webUrlPatteren)]),
        })

        this.thumbnail = this.api.userImageUrl(this.api.user.id)
        // this.companyThumbnail = this.api.agencyLogoUrl(this.api.user.id)
        this.autoCom()
    }

    pushSpliceService(id: number) {
        const index = this.services.findIndex(d => d === id)
        if (index > -1) {
            this.services.splice(index, 1)
        } else {
            this.services.push(id)
        }
    }

    pushSpliceAmenities(id: number) {
        const index = this.amenities.findIndex(d => d == id)
        if (index > -1) {
            this.amenities.splice(index, 1)
        } else {
            this.amenities.push(id)
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

    save(data: any): boolean {
        if (data.status === 'INVALID') {
            this.alert.error('Please fill valid data and try again')

            return false
        }
        const schedulesFinal: any = []
        this.schedules.forEach((resp: any) => {
            if (resp.holiday == true) {
                schedulesFinal.push(1)
            } else {
                schedulesFinal.push(0)
            }
        })


        if (this.lng != null) {
            data.value.lng = this.lng
        } else {
            data.value.lng = this.api.user.business.lng
        }

        if (this.lat != null) {
            data.value.lat = this.lat
        } else {
            data.value.lat = this.api.user.business.lat
        }
        if(data.value.website) {
            if(!this.validURL(data.value.website)) {
                this.alert.error('Please enter valid website url')

                return false      
            }
        }
        
        data.value.holidays = schedulesFinal
        data.value.services = this.services
        data.value.amenities = this.amenities
        data.value.opening_time = moment(data.value.opening_time).format('YYYY-MM-DD HH:mm:ss')
        data.value.closing_time = moment(data.value.closing_time).format('YYYY-MM-DD HH:mm:ss')

        const requiredPromises: Array<any> = []

        const formData = this.api.jsonToFormData(data.value)
        const thumbnailPromise = fetch(this.thumbnail)
            .then(res => res.blob())
            .then(blob => {
                const imageFile = new Blob([blob]) // for microsoft edge support
                formData.append('profile_image', imageFile)
            })
        requiredPromises.push(thumbnailPromise)
        Promise.all(requiredPromises)
            .then(_ => this.sendCall(formData))
    }

    sendCall(formData: FormData): void {
        this.dataService.updateProfile(formData)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)

                    return false
                } else {
                    const oldUser = this.api.user
                    this.api.user = resp.data
                    this.api.userImage.next(this.thumbnail)
                    this.api.user.api_token = oldUser.api_token
                    localStorage.setItem('apiToken', oldUser.api_token)
                    localStorage.setItem('user', JSON.stringify(this.api.user))
                    this.alert.success('Profile Edited successfully')
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
            this.alert.error('File size must not exceed 3MB')
        } else if (allowedExtensions.indexOf(extension) < 0) {
            this.alert.error('Format type is invalid.Required formats are PNG,JPG,JPEG')
        } else {
            this.imageChangedEvent = event
            this.cropperModalRef = this.modalService.show(
                template,
                Object.assign({}, { class: 'modal-md modal-dialog-centered modal-dialog-scrollable' })
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

    // onCompanyThumbnailChange(event: any, template: TemplateRef<any>) {
    //     const file = event.target.files[0]
    //     const allowedExtensions = ['png', 'jpg', 'jpeg']
    //     const extension = file.name.split('.').pop().toLowerCase()
    //     const fileSize = file.size / 1024 / 1024
    //     if (fileSize > 3) {
    //         this.alert.error('Invalid file size. File size must not exceeds 3MB')
    //     } else if (allowedExtensions.indexOf(extension) < 0) {
    //         this.alert.error('Invalid file type. Only png, jpg or jpeg are allowed')
    //     } else {
    //         this.companyImageChangedEvent = event
    //         this.companyCropperModalRef = this.modalService.show(
    //             template,
    //             Object.assign({}, { class: 'modal-md modal-dialog-centered modal-dialog-scrollable' })
    //         )
    //     }
    // }

    // doneCroppingCompanyThumbnail() {
    //     this.companyThumbnail = this.croppedCompanyImage
    //     document.getElementById('company-img').setAttribute('src', this.companyThumbnail)
    //     this.companyCropperModalRef.hide()
    // }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64
    }

    // companyImageCropped(event: ImageCroppedEvent) {
    //     this.croppedCompanyImage = event.base64
    // }

    imageLoaded() {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }

    checkService(id: number): boolean {
        const index = this.services.findIndex(d => d == id)
        if (index > -1)
            return true
        else
            return false
    }

    checkAmenities(id: number): boolean {
        const index = this.amenities.findIndex(d => d == id)
        if (index > -1)
            return true
        else
            return false
    }
    getLocation(): void {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.lng = position.coords.longitude
                this.lat = position.coords.latitude
                this.mapsAPILoader.load().then(() => {
                    const geocoder = new google.maps.Geocoder()
                    const latlng = new google.maps.LatLng(this.lat, this.lng)
                    const request = {
                        location: latlng
                    }
                    geocoder.geocode(request, (results, status) => {
                        const address = results[0].formatted_address
                        this.profileFG.controls.address.setValue(address)
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
                this.lat = place.geometry.location.lat()
                this.lng = place.geometry.location.lng()
                this.profileFG.controls.address.setValue(place.formatted_address)

            })
        })
    }

    validURL(str) {
        var res = str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        if(res == null)
            return false;
        else
            return true;
      }
}
