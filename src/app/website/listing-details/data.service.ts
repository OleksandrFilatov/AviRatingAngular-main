import { HttpClient } from '@angular/common/http'
import { apis } from './../../../environments/environment'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'


@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/public`
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    data$ = this.data.asObservable()
    step = 1

    constructor(public http: HttpClient) {
    }

    sendRatings(params: any): Observable<any> {
        const url = `${apis.baseUrl}/customer/save-review`

        return this.http.post<any>(url,  params )
    }

    getMyFeedbacks(id: any, params: any): Observable<any> {
        const url = `${this.baseUrl}/listing-reviews/${id}`
        
        return this.http.get<any>(url, { params })
    }
}
