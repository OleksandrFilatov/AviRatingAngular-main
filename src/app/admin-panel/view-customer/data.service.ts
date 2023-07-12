import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { apis } from 'src/environments/environment'

@Injectable()
export class DataService {

    private baseUrl = `${apis.baseUrl}/admin`
    customNotificationTmpl: any

    constructor(public http: HttpClient) {
    }

    getUserDetail(id: number): Observable<any> {
        const url = `${apis.baseUrl}/public/customer/${id}`

        return this.http.get<any>(url)
    }
}
