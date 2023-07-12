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

    getDistricts(): Observable<any> {
        const url = `${this.baseUrl}/districts`

        return this.http.get<any>(url)
    }

    deleteDistrict(params): Observable<any> {
        const url = `${this.baseUrl}/delete-district`

        return this.http.post<any>(url, params)
    }

    addDistrict(params): Observable<any> {
        const url = `${this.baseUrl}/add-district`

        return this.http.post<any>(url, params)
    }

    updateDistrict(params): Observable<any> {
        const url = `${this.baseUrl}/edit-district`

        return this.http.post<any>(url, params)
    }
}
