import { ApiService } from './../../../services/api.service';
import { Component, OnInit } from '@angular/core'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { AdminSidebarService } from './admin-sidebar.service'

@Component({
    selector: 'app-admin-sidebar',
    templateUrl: './admin-sidebar.component.html',
    styleUrls: ['./admin-sidebar.component.css'],
    animations: [
        trigger('slide', [
            state('up', style({ height: 0 })),
            state('down', style({ height: '*' })),
            transition('up <=> down', animate(200))
        ])
    ]
})
export class AdminSidebarComponent implements OnInit {
    menus = []
    user: any
    constructor(public sidebarservice: AdminSidebarService, private api: ApiService) {
        this.user = this.api.user
        this.menus = sidebarservice.getMenuList()
    }

    ngOnInit() {
    }

    getSideBarState() {
        return this.sidebarservice.getSidebarState()
    }

    toggle(currentMenu) {
        if (currentMenu.type === 'dropdown') {
            this.menus.forEach(element => {
                if (element === currentMenu) {
                    currentMenu.active = !currentMenu.active
                } else {
                    element.active = false
                }
            })
        }
    }

    getState(currentMenu) {

        if (currentMenu.active) {
            return 'down'
        } else {
            return 'up'
        }
    }

    hasBackgroundImage() {
        return this.sidebarservice.hasBackgroundImage
    }

    logOut(): void {
        const check = this.api.logOut()
        if (check) {
            location.reload()
        }
    }
}
