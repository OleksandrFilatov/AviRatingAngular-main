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

    getMyFeedbacks(id: any, params: any): Observable<any> {
        const url = `${this.baseUrl}/my-business-reviews`

        return this.http.get<any>(url, { params })
    }

    checkRemainingReplies(): Observable<any> {
        const url = `${this.baseUrl}/review-reply-count`

        return this.http.post<any>(url, {})
    }

    reviewPriceList(): Observable<any> {
        const url = `${this.baseUrl}/review-price-list`

        return this.http.get<any>(url)
    }

    buyReplies(params): Observable<any> {
        const url = `${this.baseUrl}/buy-review-reply`

        return this.http.post<any>(url, params)
    }

    sentReply(params): Observable<any> {
        const url = `${this.baseUrl}/reply-business-review`

        return this.http.post<any>(url, params)
    }
    uploadImage(formData: FormData) {
        const url = `${this.baseUrl}/save-reply-image`

        return this.http.post<any>(url, formData)
    }

    deleteImage(params: any): Observable<any> {
        const url = `${this.baseUrl}/delete-reply-image`

        return this.http.post(url, params)
    }


}
