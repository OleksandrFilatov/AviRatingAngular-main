import { DataService } from './data.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { Component, OnInit, Input, TemplateRef, ViewChild, ElementRef } from '@angular/core'
import { ImageCroppedEvent } from 'ngx-image-cropper'
import { ModalModule } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { ApiService } from 'src/app/services/api.service'
import * as moment from 'moment'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { MapsAPILoader } from '@agm/core'

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    providers: [DataService],
    styles: [
        '.select2 .select2-container .select2-container--default .select2-container--focus {border: none;}'
    ]
})
export class ProfileComponent implements OnInit {
    toppings = new FormControl();
    toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

    options: FormGroup;
    colorControl = new FormControl('primary');
    fontSizeControl = new FormControl(16, Validators.min(10));
    airports = []

    getFontSize() {
        return Math.max(10, this.fontSizeControl.value);
    }

    @ViewChild('search', { static: false }) public searchElementRef: ElementRef
    public searchControl: FormControl
    lat: any = null
    lng: any = null
    @Input() modalRef: BsModalRef
    profileFG: FormGroup
    educationLevelList: any = []

    thumbnail = '/assets/images/user-placeholder.png'
    imageChangedEvent: any = ''
    croppedImage: any = ''
    cropperModalRef: BsModalRef
    disabledUserData = {
        userName: this.api.user.user_name,
        email: this.api.user.email,
    }
    months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]

    airportOptions = {
        theme: 'classic',
        multiple: true,
        // tags: true
    };

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
        this.options = fb.group({
            color: this.colorControl,
            fontSize: this.fontSizeControl,
        });
        this.api.getAirports({ search_content: '' }).subscribe((resp: any) => {
            // this.airports = resp.data.map(airport => airport.airport_name)
            this.airports = resp.data;
        })
    }

    get g() {
        return this.profileFG.controls
    }

    ngOnInit() {
        const user = this.api.user
        this.profileFG = this.fb.group({
            first_name: new FormControl(user.first_name, [Validators.required, Validators.maxLength(50)]),
            last_name: new FormControl(user.last_name, [Validators.required, Validators.maxLength(50)]),
            title: new FormControl(user.customer.title, [Validators.required]),
            lat: new FormControl(user.customer.lat, []),
            lng: new FormControl(user.customer.lng, []),
            // gender: new FormControl(user.customer.gender, [Validators.required]),
            dob: new FormControl(new Date(user.customer.dob), [Validators.required]),
            address: new FormControl(user.customer.address, [Validators.maxLength(150)]),
            home_airport: new FormControl(user.customer.home_airport, [Validators.required]),
            aircraft_type: new FormControl(user.customer.aircraft_type, [Validators.required]),
            aircraft_tail_number: new FormControl(user.customer.aircraft_tail_number, [Validators.maxLength(20)]),
            contact_1: new FormControl(user.customer.contact_1, [Validators.required, Validators.maxLength(20)]), // done
            contact_2: new FormControl(user.customer.contact_2, [Validators.maxLength(20)]), // done
        })


        this.thumbnail = this.api.userImageUrl(this.api.user.id)
        // this.companyThumbnail = this.api.agencyLogoUrl(this.api.user.id)
        this.autoCom()
    }

    save(data: any): boolean {

        if (data.status === 'INVALID') {
            this.alert.error('Please fill valid data and try again')

            return false
        }
        data.value.lng = this.lng
        data.value.lat = this.lat
        const requiredPromises: Array<any> = []
        data.value.dob = moment(data.value.dob).format('YYYY-MM-DD').toString()
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
                    const oldToken = this.api.user.api_token
                    const userData = resp.data
                    userData.api_token = oldToken
                    this.api.user = userData

                    this.api.userImage.next(this.thumbnail)
                    localStorage.setItem('apiToken', oldToken)
                    localStorage.setItem('user', JSON.stringify(userData))
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
}
