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
    
    getBusniess(): Observable<any> {
        const url = `${this.baseUrl}/business-requests?status=approved`
        
        return this.http.get<any>(url)
    }
     getListing( params: any): Observable<any> {
        const url = `${this.baseUrl}/listings`

        return this.http.get<any>(url, { params })
    }

    active(params: any): Observable<any> {
        const url = `${this.baseUrl}/activate-listing`

        return this.http.post<any>(url, params)
    }

    deactive(params: any): Observable<any> {
        const url = `${this.baseUrl}/deactivate-listing`

        return this.http.post<any>(url, params)
    }
}
