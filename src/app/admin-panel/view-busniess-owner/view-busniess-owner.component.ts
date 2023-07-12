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
import { ConstantsService } from 'src/app/services/constants.service';


@Component({
    selector: 'app-view-busniess-owner',
    templateUrl: './view-busniess-owner.component.html',
    styleUrls: ['./view-busniess-owner.component.scss']
})
export class ViewBusniessOwnerComponent implements OnInit {
    @Input() modalRef: BsModalRef
    moment = moment
    centerId: any = -1
    selectedCenterData: any
    dataStatus = "fetching"
    dateFormat: any
    timeFormat:any
    days = ConstantsService.DAYS
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
        this.timeFormat = cs.DATE_TIME_FORMAT.AM_PM
        this.route.queryParams.subscribe(params => {
            if (params.id) {
                this.centerId = params.id
            }
        })
        // get userData call


        if (this.centerId > -1) {
            this.dataService.getUserDetail(this.centerId).subscribe((res: any) => {
                if (res.success === true) {
                    this.selectedCenterData = res.data['business']
                    this.dataStatus = 'done'
                }
            }) // GetuserDetails end
        }




    }


    ngOnInit() {
    }




}
