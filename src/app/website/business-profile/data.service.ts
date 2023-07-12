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
        const url = `${apis.baseUrl}/customer/save-business-review`

        return this.http.post<any>(url, params)
    }

    claimBusiess(params: any): Observable<any> {
        const url = `${this.baseUrl}/claim-business`

        return this.http.post<any>(url, params)
    }

    getMyFeedbacks(id: any, params: any): Observable<any> {
        const url = `${this.baseUrl}/business-reviews/${id}`

        return this.http.get<any>(url, { params })
    }

    uploadImage(formData: FormData) {
        const url = `${apis.baseUrl}/customer/save-review-image?no-loader=true`

        return this.http.post<any>(url, formData)
    }
    // imageUrl(id: number) {
    //     return `${apis.baseUrl}/customer/save-review-image${id}?no-loader=true`
    // }

    getId(id: any): Observable<any> {
        const param = { business_id: id }
        const url = `${apis.baseUrl}/customer/pre-review`

        return this.http.post<any>(url, param)
    }
    deleteImage(id: number) {
        const url = `${apis.baseUrl}/customer/delete-review-image?no-loader=true`

        return this.http.post<any>(url, { id })
    }

}
