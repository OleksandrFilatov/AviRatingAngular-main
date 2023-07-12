import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
  private baseUrl = `${apis.baseUrl}/admin`
  constructor(private http: HttpClient) { }

  getBusinessTypes(): Observable<any> {
    const url = `${this.baseUrl}/business-types`

    return this.http.get<any>(url)
  }

  addBusinessType(params): Observable<any> {
    const url = `${this.baseUrl}/add-business-type`

    return this.http.post<any>(url, params)
  }

  updateBusinessType(params): Observable<any> {
    const url = `${this.baseUrl}/update-business-type`

    return this.http.post<any>(url, params)
  }

  deleteBusinessType(params): Observable<any> {
    const url = `${this.baseUrl}/delete-business-type`

    return this.http.post<any>(url, params)
  }

}

