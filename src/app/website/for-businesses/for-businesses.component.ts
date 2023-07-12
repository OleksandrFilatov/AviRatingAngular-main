import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-for-businesses',
    templateUrl: './for-businesses.component.html',
    styleUrls: ['./for-businesses.component.css']
})
export class ForBusinessesComponent implements OnInit {
    loginUser = ''
    userType = ''
    constructor(
        public apiService: ApiService,
        private route: Router,
    ) { }

    ngOnInit() {
        console.log(this.apiService.user.user_type)
        if(this.apiService.user.user_type){
            if(this.apiService.user.user_type=='business') {
                this.userType = 'business'
            } else {
                this.userType = 'login'
            }
        }
        console.log('sss',this.userType)
    }

}
