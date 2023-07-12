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

    getMyBanners(page): Observable<any> {
        const url = `${this.baseUrl}/my-homepage-banners?page=${page}`

        return this.http.get<any>(url)
    }

    delete(params): Observable<any> {
        const url = `${this.baseUrl}/delete-homepage-banner`

        return this.http.post<any>(url, params)
    }

    changeStatus(params): Observable<any> {
        const url = `${this.baseUrl}/change-banner-status`

        return this.http.post<any>(url, params)
    }

    addBanner(params): Observable<any> {
        const url = `${this.baseUrl}/add-homepage-banner`

        return this.http.post<any>(url, params)
    }

    updateBanner(params): Observable<any> {
        const url = `${this.baseUrl}/update-homepage-banner`

        return this.http.post<any>(url, params)
    }
}
