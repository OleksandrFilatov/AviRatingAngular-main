import { HttpClient } from '@angular/common/http'
import { apis } from '../../../environments/environment'
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

    sendMessage(params: any): Observable<any> {
        const url = `${this.baseUrl}/listing-detail`

        return this.http.post<any>(url,  params )
    }
}
