import { UIHelpers } from './../../helpers/ui-helpers'
import { Router, ActivatedRoute } from '@angular/router'
import { Component, OnInit, Input } from '@angular/core'
import { ApiService } from 'src/app/services/api.service'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
    @Input() index: number

    contactUs: FormGroup
    simpleError: string
    dataService: any
    isSubmitted = <boolean>false
    formShow = true

    constructor(
        public apiService: ApiService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        public ui: UIHelpers
    ) {
        this.contactUs = this.fb.group({
            id: new FormControl(null, []),
            name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(255)]),
            contact_no: new FormControl(null, [Validators.required, Validators.maxLength(11)]),
            address: new FormControl(null, [Validators.maxLength(155)]),
            description: new FormControl(null, [Validators.required, Validators.maxLength(500)])
        })
    }

    ngOnInit() {
    }

    get g() {
        return this.contactUs.controls
    }

    save(data: any): boolean {
        if (data.status === 'INVALID') {
            this.simpleError = 'Please eneter valid data in all fields and try again'

            return false
        }

        let saveMethod = this.apiService.saveContactUs(data.value)

        saveMethod.subscribe((resp: any) => {
            if (resp.success === false) {
                this.simpleError = resp.errors.general

                return false
            } else {
                this.formShow = false
                data.value.id = resp.data
                this.apiService.saveContactUs(data.value)
                this.isSubmitted = true

            }
        })
    }
}
