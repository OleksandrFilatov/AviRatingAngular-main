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

    subscriptions(): Observable<any> {
        const url = `${this.baseUrl}/memberships`

        return this.http.get<any>(url)
    }
    setSubscriptions(params: any): Observable<any> {
        const url = `${this.baseUrl}/subscribe`

        return this.http.post<any>(url, params)
    }

    freeSubscription(params: any): Observable<any> {
        const url = `${this.baseUrl}/free-subscription`

        return this.http.post<any>(url, params)
    }

    unSubscribe(params: any): Observable<any> {
        const url = `${this.baseUrl}/unsubscribe`

        return this.http.post<any>(url, params)
    }

}
