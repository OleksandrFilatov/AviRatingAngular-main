import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    rsp:any

    private baseUrl = `${apis.baseUrl}/admin`
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    data$ = this.data.asObservable()

    constructor(public http: HttpClient) {
    }

    getReviewPrice(): Observable<any> {
        const url = `${this.baseUrl}/review-price-list`

        return this.http.get<any>(url)
    }

    deleteReviewPrice(params): Observable<any> {
        const url = `${this.baseUrl}/delete-review-price`

        return this.http.post<any>(url, params)
    }

    addReviewPrice(params): Observable<any> {
        const url = `${this.baseUrl}/add-review-price`

        return this.http.post<any>(url, params)
    }

    updateReviewPrice(params): Observable<any> {
        const url = `${this.baseUrl}/update-review-price`

        return this.http.post<any>(url, params)
    }

}
