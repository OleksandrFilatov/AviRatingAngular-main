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

    getClasses(): Observable<any> {
        const url = `${this.baseUrl}/class-list`

        return this.http.get<any>(url)
    }

    addClass(params: any): Observable<any> {
        const url = `${this.baseUrl}/add-class`

        return this.http.post<any>(url, params)
    }

    updateClass(params: any): Observable<any> {
        const url = `${this.baseUrl}/edit-class`

        return this.http.post<any>(url, params)
    }

    deleteClass(params): Observable<any> {
        const url = `${this.baseUrl}/delete-class`

        return this.http.post<any>(url,  params )
    }
}
