import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/business`

    constructor(public http: HttpClient) {
    }

    replies(): Observable<any> {
        const url = `${this.baseUrl}/business-profile`

        return this.http.get<any>(url)
    }
    reviewPriceList(): Observable<any> {
        const url = `${this.baseUrl}/review-price-list`

        return this.http.get<any>(url)
    }

    buyReplies(params): Observable<any> {
        const url = `${this.baseUrl}/buy-review-reply`

        return this.http.post<any>(url, params)
    }
}
