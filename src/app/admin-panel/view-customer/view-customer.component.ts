import { ConstantsService } from 'src/app/services/constants.service';
import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { UIHelpers } from 'src/app/helpers/ui-helpers';
import { DataService } from './data.service';
import { ApiService } from 'src/app/services/api.service';
import { BsModalService } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment'


@Component({
    selector: 'app-view-customer',
    templateUrl: './view-customer.component.html',
    styleUrls: ['./view-customer.component.scss']
})
export class ViewCustomerComponent implements OnInit {
    @Input() modalRef: BsModalRef
    moment = moment
    centerId: any = -1
    selectedCenterData: any
    dataStatus = "fetching"
    dateFormat: any

    constructor(
        private fb: FormBuilder,
        public ui: UIHelpers,
        private dataService: DataService,
        public api: ApiService,
        private modalService: BsModalService,
        private alert: IAlertService,
        private route: ActivatedRoute,
        public router: Router,
        public cs: ConstantsService

    ) {
        this.dateFormat = cs.DATE_TIME_FORMAT.DATE
        this.route.queryParams.subscribe(params => {
            if (params.id) {
                this.centerId = params.id
            }
        })
        // get userData call

        if (this.centerId > -1) {
            // get userData
            this.dataService.getUserDetail(this.centerId).subscribe((res: any) => {
                if (res.success === true) {
                    this.selectedCenterData = res.data[0]
                    console.log(this.selectedCenterData)
                    this.dataStatus = 'done'
                }
            }) // GetuserDetails end
        }
    }


    ngOnInit() {
    }




}
