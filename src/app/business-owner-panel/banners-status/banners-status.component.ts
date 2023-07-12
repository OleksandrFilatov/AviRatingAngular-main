import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service'

@Component({
    selector: 'app-banners-status',
    templateUrl: './banners-status.component.html',
    styleUrls: ['./banners-status.component.css']
})
export class bannersSstatusComponent implements OnInit {
    
    status = ''
    constructor(

        private route: ActivatedRoute,
        public apiService: ApiService,
    ) {
        this.status = this.route.snapshot.paramMap.get('status')
    }

    ngOnInit() {
    }
}
