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

    getEducations(): Observable<any> {
        const url = `${this.baseUrl}/education-list`

        return this.http.get<any>(url)
    }

    deleteEducation(params): Observable<any> {
        const url = `${this.baseUrl}/delete-education`

        return this.http.post<any>(url, params)
    }

    addEducation(params): Observable<any> {
        const url = `${this.baseUrl}/add-education`

        return this.http.post<any>(url, params)
    }

    updateEducation(params): Observable<any> {
        const url = `${this.baseUrl}/update-education`

        return this.http.post<any>(url, params)
    }
}
