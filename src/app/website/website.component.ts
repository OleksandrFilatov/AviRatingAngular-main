import { trigger, transition, style, animate } from '@angular/animations'
import { ApiService } from './../services/api.service'
import { LoaderService } from './../services/loader.service'
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router'
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core'
import { NgScrollbar } from 'ngx-scrollbar'
import { WebsiteService } from '../services/website.service';

@Component({
    selector: 'app-website',
    templateUrl: './website.component.html',
    styleUrls: ['./website.component.css'],
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({ transform: 'translateX(100%)' }),
                animate('500ms ease-in', style({ transform: 'translateX(0%)' }))
            ]),
            transition(':leave', [
                animate('500ms ease-in', style({ transform: 'translateX(100%)' }))
            ])
        ])
    ]
})
export class WebsiteComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(NgScrollbar, { static: true }) scrollbarRef: NgScrollbar
    isLoading: boolean
    scrollbarSub: any

    constructor(
        private route: Router,
        private loader: LoaderService,
        public api: ApiService,
        public web: WebsiteService
    ) {
        this.loader.isLoading.asObservable().subscribe((state) => {
            setTimeout(_ => this.isLoading = state, 0)
        })
    }

    ngOnInit() {
        this.route.events.subscribe((routerEvent: Event) => {
            if (routerEvent instanceof NavigationEnd) {
                this.scrollbarRef.scrollTo({ top: 0, duration: 500 })
            }
        })
    }

    ngAfterViewInit(): void {
        this.scrollbarSub = this.scrollbarRef.scrolled
            .subscribe(e => {
                const getHight = e.target.scrollHeight - e.target.scrollTop
                if ((getHight - e.target.clientHeight) < 500) {
                    // console.log(getHight, e.target.clientHeight, getHight - e.target.clientHeight)
                    this.api.toggleScrollBottom(true)
                } else {
                    this.api.toggleScrollBottom(false)
                }
            })
    }

    ngOnDestroy(): void {
        this.scrollbarSub.unsubscribe()
    }
}
