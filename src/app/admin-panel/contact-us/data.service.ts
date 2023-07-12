import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/admin`
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    data$ = this.data.asObservable()

    constructor(public http: HttpClient) {
    }

    get(): Observable<any> {
        const url = `${this.baseUrl}/contact-us-requests`

        return this.http.get<any>(url)
    }

    delete(params): Observable<any> {
        const url = `${this.baseUrl}/delete-membership`

        return this.http.post<any>(url, params)
    }

    statusUpdate(params): Observable<any> {
        const url = `${this.baseUrl}/contact-us-request-update-status`

        return this.http.post<any>(url, params)
    }

}
