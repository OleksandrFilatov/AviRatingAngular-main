
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { apis } from 'src/environments/environment'

@Injectable()
export class DataService {

    private baseUrl = `${apis.baseUrl}/admin`
    customNotificationTmpl: any

    constructor(public http: HttpClient) {
    }

    createProfile(params: any): Observable<any> {
        const url = `${this.baseUrl}/add-tutor`

        return this.http.post<any>(url, params)
    }

    updateProfile(params: any): Observable<any> {
        const url = `${this.baseUrl}/tutor-update-profile`

        return this.http.post<any>(url, params)
    }
    
    getUserDetail(id: number): Observable<any> {
        const url = `${this.baseUrl}/user-profile/${id}`

        return this.http.get<any>(url)
    }
}
