import { HttpClient } from '@angular/common/http'
import { apis } from './../../../environments/environment'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'


@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/business`
    private data = new BehaviorSubject<Array<any>>([{ fetching: true }])
    data$ = this.data.asObservable()
    step = 1

    constructor(public http: HttpClient) {
    }

    getlistingDetails(params: any): Observable<any> {
        const url = `${this.baseUrl}/listing-detail`

        return this.http.post<any>(url,  params )
    }

    getlistingId(): Observable<any> {
        const url = `${this.baseUrl}/pre-listing`

        return this.http.post<any>(url, null)
    }

    saveListing(params: any): Observable<any> {
        const url = `${this.baseUrl}/update-listing`

        return this.http.post<any>(url, params)
    }


    getListingImageUrl(id: number) {

        return `${apis.baseUrl}/public/listing-image/${id}`
    }

    uploadImage(formData: FormData) {
        const url = `${this.baseUrl}/save-listing-image`

        return this.http.post<any>(url, formData)
    }

    deleteImage(params: any): Observable<any> {
        const url = `${this.baseUrl}/delete-listing-image`

        return this.http.post(url, params)
    }

    saveDocument(params: any): Observable<any> {
        const url = `${apis.baseUrl}/seller/upload-quality-certificate`

        return this.http.post<any>(url, params)
    }

    deleteDocument(params: any): Observable<any> {
        const url = `${apis.baseUrl}/seller/delete-quality-certificate`

        return this.http.post(url, params)
    }

    downloadDocument(documentId: number) {
        const url = `${this.baseUrl}/download-quality-certificate/${documentId}`

        return this.http.get<any>(url, { responseType: 'blob' as 'json' })
    }
}
