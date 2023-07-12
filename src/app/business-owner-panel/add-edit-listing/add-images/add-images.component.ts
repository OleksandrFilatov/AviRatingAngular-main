import { Component, OnInit, Input, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { DataService } from '../data.service'
import { FormBuilder } from '@angular/forms'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { BsModalService } from 'ngx-bootstrap/modal'
import { ApiService } from 'src/app/services/api.service'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'


@Component({
    selector: 'app-add-images',
    templateUrl: './add-images.component.html',
    styleUrls: ['./add-images.component.css']
})
export class AddImagesComponent implements OnInit {
    @Input() selectedId: any
    @Input() listingDetails: any
    filename = ''
    document: File = null
    spinnerSVG: string

    uploadedImages = []
    constructor(
        private route: ActivatedRoute,
        public ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
        public api: ApiService,
        public router: Router
    ) { }

    ngOnInit() {
        this.spinnerSVG = `/assets/images/spinner.svg`

        if (this.selectedId > -1) {
            this.uploadedImages = []
            this.listingDetails.listing_images.forEach(d => {
                this.uploadedImages.push({
                    id: d.id,
                    image: this.ds.getListingImageUrl(d.id)
                })//Uploaded images
            }) // for each ends
        }
    }

    browseImages(event: any) {
        event.preventDefault()
        const element = document.getElementById('other-images')
        element.click()
    }

    onImagesChange(event: any) {
        this.uploadFiles(event.target.files)
    }

    uploadFiles(files: FileList) {
        const allowedExtensions = ['png', 'jpg', 'jpeg']
        const defaulterFiles = []

        Array.from(files).forEach((file: any) => {
            const extension = file.name.split('.').pop().toLowerCase()
            if (allowedExtensions.indexOf(extension) > -1) {
                this.readFile(file)
            } else {
                defaulterFiles.push(file.name)
                this.alert.error(`${file.name} has an invalid file type. Only png, jpg or jpeg are allowed`)
            }
        })
    }


    readFile(file: any) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = (e: any) => {
            const index = this.uploadedImages.length
            this.uploadedImages.push({
                id: -1,
                image: reader.result,
                uploading: true
            })
            this.uploadImage(reader.result, index)
        }
    }

    uploadImage(imageData: any, index: number) {
        fetch(imageData)
            .then(res => res.blob())
            .then(blob => {
                const imageFile = new Blob([blob]) // for microsoft edge support
                const formData = new FormData()
                formData.append('image', imageFile)
                formData.append('listing_id', this.selectedId)
                this.ds.uploadImage(formData).subscribe((resp: any) => {
                    this.uploadedImages[index].id = resp.data
                    this.uploadedImages[index].uploading = false
                    this.listingDetails.listing_images.push({ id: resp.data })
                })
            })
    }

    deleteImage(index: number) {
        this.uploadedImages[index].image = this.spinnerSVG
        const params = {
            id: this.uploadedImages[index].id
        }
        this.ds.deleteImage(params).subscribe(resp => {
            this.uploadedImages.splice(index, 1)
            this.listingDetails.listing_images.splice(index, 1)
        })
    }

    chooseFile() {
        document.getElementById('document-file').click()
    }

    onDocumentChange(event: any) {
        const file = event.target.files[0]
        const allowedExtensions = ['png', 'jpg', 'jpeg', 'pdf', 'txt', 'doc', 'docx']
        const extension = file.name.split('.').pop().toLowerCase()
        this.filename = file.name

        const fileSize = file.size / 1024 / 1024
        if (fileSize > 3) {
            this.alert.error('File Size should not exceed 3mb')

        } else if (allowedExtensions.indexOf(extension) < 0) {
            this.alert.error('Invalid File Type')
        } else {
            this.document = file
            this.saveDocument()
        }
    }

    saveDocument() {
        const formData = new FormData()
        formData.append('file', this.document)
        formData.append('id', this.listingDetails.id)
        this.ds.saveDocument(formData).subscribe((resp: any) => {
            if (resp.success == true) {
                if (this.listingDetails.quality_certificate == 0) {
                    this.alert.success('Certificate added successfully')
                    this.listingDetails.quality_certificate = 1
                } else {
                    this.alert.success('Certificate changed successfully')
                    this.listingDetails.quality_certificate = 1
                }
            } else {
                this.alert.error(resp.errors.general)
            }
        })
    }

    downloadDocument() {
        this.ds.downloadDocument(this.listingDetails.id)
            .subscribe((resp: any) => {
                const binaryData = []
                binaryData.push(resp)
                const downloadLink = document.createElement('a')
                downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: resp.type }))
                downloadLink.setAttribute('download', 'document')
                document.body.appendChild(downloadLink)
                downloadLink.click()
            })
    }

    delete() {
        const params = {
            id: this.listingDetails.id
        }

        this.ds.deleteDocument(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {

                    return false
                } else {
                    this.alert.success('Certificate Dleted Successfully')
                    this.listingDetails.quality_certificate = 0
                }
            })
    }


}
