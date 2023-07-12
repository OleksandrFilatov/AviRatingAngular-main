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

    getServices(): Observable<any> {
        const url = `${this.baseUrl}/services`

        return this.http.get<any>(url)
    }

    deleteService(params): Observable<any> {
        const url = `${this.baseUrl}/delete-service`

        return this.http.post<any>(url, params)
    }

    addService(params): Observable<any> {
        const url = `${this.baseUrl}/add-service`

        return this.http.post<any>(url, params)
    }

    updateService(params): Observable<any> {
        const url = `${this.baseUrl}/update-service`

        return this.http.post<any>(url, params)
    }

}
