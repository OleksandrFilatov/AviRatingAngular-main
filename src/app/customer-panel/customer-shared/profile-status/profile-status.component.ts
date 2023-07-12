import { TutorApiService } from './../../../services/tutor-api.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-profile-status',
    templateUrl: './profile-status.component.html',
    styleUrls: ['./profile-status.component.scss']
})
export class ProfileStatusComponent implements OnInit {
    @Input() screenType = ''
    profileData: any
    dataStatus = 'fetching'
    constructor(
        public tutorApi: TutorApiService
    ) { }

    ngOnInit() {
        this.tutorApi.profileStatus().subscribe((resp: any) => {
            if (resp.success === true) {
                this.profileData = resp.data
                this.dataStatus = 'done'
                console.log(this.profileData.total_locations)

            } else {

            }
        })
        console.log(this.screenType);
        
    }

}
