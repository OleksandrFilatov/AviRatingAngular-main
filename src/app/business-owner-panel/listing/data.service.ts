import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/business`
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    data$ = this.data.asObservable()

    constructor(public http: HttpClient) {
    }

    getListing(page: any): Observable<any> {
        const url = `${this.baseUrl}/my-listings?page=${page}`

        return this.http.get<any>(url)
    }

    checkAllowList(): Observable<any> {
        const url = `${this.baseUrl}/check-allow-listing`

        return this.http.post<any>(url,{})
    }

    deleteListiing(params: any): Observable<any> {
        const url = `${this.baseUrl}/delete-listing`

        return this.http.post<any>(url, params)
    }

    changeStatus(params: any): Observable<any> {
        const url = `${this.baseUrl}/change-status`

        return this.http.post<any>(url, params)
    }
}
