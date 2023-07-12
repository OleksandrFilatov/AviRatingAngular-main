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

    getRegions(): Observable<any> {
        const url = `${this.baseUrl}/regions`

        return this.http.get<any>(url)
    }

    deleteRegion(params): Observable<any> {
        const url = `${this.baseUrl}/delete-region`

        return this.http.post<any>(url, params)
    }

    addRegion(params): Observable<any> {
        const url = `${this.baseUrl}/add-region`

        return this.http.post<any>(url, params)
    }

    updateRegion(params): Observable<any> {
        const url = `${this.baseUrl}/edit-region`

        return this.http.post<any>(url, params)
    }

}
