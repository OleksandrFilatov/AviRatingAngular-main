import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { DataService } from './data.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'

@Component({
    selector: 'app-bulk-upload',
    templateUrl: './bulk-upload.component.html',
    styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit {
    @ViewChild('f', { static: false }) domFileElement: ElementRef
    document: any

    seletcedFile: any
    filename: 'Upload CSV File'
    modalRef: BsModalRef
    existingUsers = []
    CSVDuplicateUsers = []
    totalCSVDuplicates = 0
    totalFailed = 0
    totalUser = 0
    totalSuccess = 0
    resultStatus = false
    subjectDistrictList = []
    latLngStatus = false
    userArray: any = [];
    userData: any = []
    colArray: any = [];

    constructor(
        private alert: IAlertService,
        public adminApi: DataService,
        private ms: BsModalService,
        private http: HttpClient
    ) { }

    ngOnInit() {
    }
    viewSample() {
        this.http.get('assets/sample/sample-data.csv', { responseType: 'text' })
            .subscribe(
                data => {
                    let csvToRowArray = data.split("\n");

                    for (let index = 0; index < csvToRowArray.length - 1; index++) {
                        let row = csvToRowArray[index].split(",");
                        if (index == 0) {
                            this.colArray = csvToRowArray[index].split(",");
                        } else {
                            this.userArray.push(csvToRowArray[index].split(","));

                        }
                    }

                    console.log(csvToRowArray[0], '------', csvToRowArray[1]);
                },
                error => {
                    console.log(error);
                }
            );
    }
    openModal(sample, index) {

        this.modalRef = this.ms.show(
            sample,
            {
                class: 'modal-xl modal-dialog-centered admin-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
        this.viewSample()
    }
    browseFile(event: any) {
        event.preventDefault()
        const element = document.getElementById('csv-file')
        element.click()
    }

    onFileChange(event: any) {
        const file = event.target.files[0]
        const allowedExtensions = ['csv']
        this.filename = file.name
        const extension = file.name.split('.').pop().toLowerCase()
        const fileSize = file.size / 1024 / 1024
        if (fileSize > 10) {
            this.alert.error('Invalid file size. File size must not exceeds 10MB')
            this.domFileElement.nativeElement.value = ''
        } else if (allowedExtensions.indexOf(extension) < 0) {
            this.alert.error('Invalid file type. Only CSV file is allowed')
            this.domFileElement.nativeElement.value = ''
        } else {
            this.seletcedFile = file
        }
    }

    searchReviews() {


        if (this.domFileElement.nativeElement.value == '') {
            this.alert.error('Please select a valid CSV file to upload')

            return false
        }

        const formData = new FormData()
        formData.append('file', this.seletcedFile)
        this.adminApi.uploadFile(formData).subscribe((resp: any) => {
            if (resp.success === true) {
                this.alert.success(resp.msg)
                if (resp.data.existing_users.length > 0) {
                    this.existingUsers = resp.data.existing_users
                }
                if (resp.data.csv_duplicates.length > 0) {
                    this.CSVDuplicateUsers = resp.data.csv_duplicates
                }
                if (resp.data.missing_lat_lng.length > 0) {
                    this.subjectDistrictList = resp.data.missing_lat_lng
                    this.latLngStatus = true
                }
                this.totalFailed = resp.data.total_failed_users
                this.totalUser = resp.data.total_users
                this.totalSuccess = resp.data.total_success_users
                this.resultStatus = true

            } else {
                this.alert.error(resp.errors.general)
            }
            this.domFileElement.nativeElement.value = ''
        })
    }

    browseImages(event: any) {
        event.preventDefault()
        const element = document.getElementById('csv-file')
        element.click()
    }

    key(field: string) {
        const tutorMappings = [
            'email', 'user_name', 'first_name', 'last_name', 'dob_month', 'dob_year', 'title',
            'password', 'contact_1', 'whatsapp_no', 'districts', 'level', 'description',
            'scrc', 'fee', 'language', 'web_url', 'teaching_method', 'experience',
            '0_morning', '0_afternoon', '0_evening', // SUNDAY
            '1_morning', '1_afternoon', '1_evening',
            '2_morning', '2_afternoon', '2_evening',
            '3_morning', '3_afternoon', '3_evening',
            '4_morning', '4_afternoon', '4_evening',
            '5_morning', '5_afternoon', '5_evening',
            '6_morning', '6_afternoon', '6_evening', // SATURDAY
            'subjects'
        ]

        const centerMappings = [
            'email', 'user_name', 'first_name', 'password', 'level', 'established',
            'contact_1', 'contact_2', 'watsapp_no', 'districts', 'description',
            'web_url', 'address_1', 'address_2', 'region_id', 'district_id', 'fee',
            '0_opening_time', '0_closing_time', '0_holiday', // SUNDAY
            '1_opening_time', '1_closing_time', '1_holiday',
            '2_opening_time', '2_closing_time', '2_holiday',
            '3_opening_time', '3_closing_time', '3_holiday',
            '4_opening_time', '4_closing_time', '4_holiday',
            '5_opening_time', '5_closing_time', '5_holiday',
            '6_opening_time', '6_closing_time', '6_holiday', // SATURDAY
            'subjects'
        ]

        const playgroupMappings = [
            'email', 'user_name', 'first_name', 'password', 'level', 'established',
            'contact_1', 'contact_2', 'watsapp_no', 'districts', 'description',
            'web_url', 'address_1', 'address_2', 'region_id', 'district_id', 'fee',
            '0_opening_time', '0_closing_time', '0_holiday', // SUNDAY
            '1_opening_time', '1_closing_time', '1_holiday',
            '2_opening_time', '2_closing_time', '2_holiday',
            '3_opening_time', '3_closing_time', '3_holiday',
            '4_opening_time', '4_closing_time', '4_holiday',
            '5_opening_time', '5_closing_time', '5_holiday',
            '6_opening_time', '6_closing_time', '6_holiday', // SATURDAY
            'classes'
        ]

        const studentMappings = [
            'email', 'user_name', 'first_name', 'last_name',
            'password', 'contact_1', 'contact_2', 'level',
            'gender', 'dob_month', 'dob_year', 'title', 'subjects'
        ]


    }
}
