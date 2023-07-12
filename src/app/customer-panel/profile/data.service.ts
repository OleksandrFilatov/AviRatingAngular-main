
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { apis } from 'src/environments/environment'

@Injectable()
export class DataService {

    private baseUrl = `${apis.baseUrl}/customer`
    customNotificationTmpl: any

    constructor(public http: HttpClient) {
    }

    updateProfile(params: any): Observable<any> {
        const url = `${this.baseUrl}/update-profile`

        return this.http.post<any>(url, params)
    }
}
