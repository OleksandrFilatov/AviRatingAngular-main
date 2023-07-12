import { LoaderService } from './services/loader.service'
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router'
import { Component } from '@angular/core'
import { SocketsService } from 'src/app/services/sockets.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    isLoading: boolean

    constructor(
        private route: Router,
        private loader: LoaderService,
        public socketsService: SocketsService,

    ) {

        this.route.events.subscribe((routerEvent: Event) => {
            if (routerEvent instanceof NavigationStart) {
                this.loader.show()
            }

            if (routerEvent instanceof NavigationEnd) {
                if (this.loader.requestCount === 0) {
                    this.loader.hide()
                }
            }
        })

        this.socketsService.createSocket();
    }
}
