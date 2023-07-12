import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/admin`
    constructor(private http: HttpClient) { }

    getPaymentHistory(): Observable<any> {
        const url = `${this.baseUrl}/payment-history/${'business'}`

        return this.http.get<any>(url)
    }
}

