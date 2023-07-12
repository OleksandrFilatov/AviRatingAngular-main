import { apis } from '../../environments/environment.prod';
import { Observable, BehaviorSubject } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})
export class TutorApiService {
    userLoggedInSource = new BehaviorSubject(false)
    baseUrl: any
    constructor(public http: HttpClient) {
        this.baseUrl = apis.baseUrl + `/tutor`
    }

    profileStatus(): Observable<any> {
        const url = `${this.baseUrl}/profile-status`

        return this.http.get<any>(url)
    }

}
