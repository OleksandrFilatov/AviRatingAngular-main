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
        const url = `${this.baseUrl}/claim-business-requests`

        return this.http.get<any>(url)
    }

    approveRequest(params): Observable<any> {
        const url = `${this.baseUrl}/approve-business-request`

        return this.http.post<any>(url, params)
    }

    rejectClaim(params): Observable<any> {
        const url = `${this.baseUrl}/reject-business-request`

        return this.http.post<any>(url, params)
    }
   
}
