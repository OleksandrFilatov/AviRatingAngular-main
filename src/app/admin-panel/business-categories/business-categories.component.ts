import { ApiService } from 'src/app/services/api.service'
import { Component, OnInit , TemplateRef} from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { DataService } from './data.service'
import { ImageCroppedEvent } from 'ngx-image-cropper'


@Component({
  selector: 'app-business-categories',
  templateUrl: './business-categories.component.html',
  styleUrls: ['./business-categories.component.scss']
})
export class BusinessCategoriesComponent implements OnInit {

  dataStatus = 'fetching'
  businessCategoryList = []
  submitData: any
  businessCategoryForm: FormGroup
  selectedIndex: any
  modalRef: BsModalRef
  thumbnail = '/assets/img/no_image.png'
  imageChangedEvent: any = ''
  cropperModalRef: BsModalRef
  croppedImage: any = ''
  selectedId: any
  constructor(
    private adminApi: DataService,
    public api:ApiService,
    private fb: FormBuilder,
    public ui: UIHelpers,
    private modalService: BsModalService,
    private alert: IAlertService,
    private ms: BsModalService,
  ) { 
    this.businessCategoryForm = this.fb.group({
      id: new FormControl(null),
      full_name: new FormControl(null, [Validators.required]),
      short_name: new FormControl(null, [Validators.required]),
  })

  }

  ngOnInit() {
    this.adminApi.get().subscribe((resp: any) => {
      if (resp.success === true) {
          this.businessCategoryList = resp.data
          this.dataStatus = 'done'
      }
   })
  }

get g() {
  return this.businessCategoryForm.controls
}

openModalBusinessCategory(amenityModal, index, id) {
    if (index > -1) {
        this.thumbnail = this.api.categoryImageUrl(id)
        this.selectedIndex = index
        console.log(this.selectedIndex)
        this.businessCategoryForm .controls.id.setValue(this.businessCategoryList[index].id)
        this.businessCategoryForm .patchValue(this.businessCategoryList[index])
    }
    this.modalRef = this.ms.show(
        amenityModal,
        {
            class: 'modal-lg modal-dialog-centered admin-panel',
            backdrop: 'static',
            ignoreBackdropClick: true,
            keyboard: false
        }
    )
}

saveBusinessCategory(data: any, f: any): boolean {
  if (data.status === 'INVALID') {
      this.alert.error('Please fill valid data and try again')
      return false
  }
  this.submitData = data.value
  const requiredPromises: Array<any> = []

  const formData = this.api.jsonToFormData(data.value)
  const thumbnailPromise = fetch(this.thumbnail)
      .then(res => res.blob())
      .then(blob => {
          const imageFile = new Blob([blob]) // for microsoft edge support
          formData.append('category_image', imageFile)
      })
  requiredPromises.push(thumbnailPromise)
  Promise.all(requiredPromises)
      .then(_ => this.sendCall(formData,f))
}

sendCall(formData: FormData, f:any): void {
  let saveUpdate = this.adminApi.add(formData)
  if (this.businessCategoryForm.value.id !== null) {
      saveUpdate = this.adminApi.update(formData)
  }
  saveUpdate.subscribe((resp: any) => {
    if (resp.success === false) {
        this.alert.error(resp.errors.general)
        this.modalRef.hide()
        f.resetForm()


        return false
    } else {
        if (this.businessCategoryForm.value.id !== null) {
            this.alert.success('Changes done successfully!!')
            this.businessCategoryList[this.selectedIndex] = this.submitData
            this.api.categoryImageUrl(this.businessCategoryForm.value.id)
        } else {
            this.alert.success('category added successfully!!')
            this.businessCategoryList.push(resp.data)
        }
    }
    this.thumbnail = '/assets/img/no_image.png' 
    this.modalRef.hide()
    f.resetForm()
})
}

deleteBusinessCategory() {
  const params = {
      id: this.selectedId
  }
  this.adminApi.delete(params)
      .subscribe((resp: any) => {
          if (resp.success === false) {
              this.alert.error(resp.errors.general)
              this.modalRef.hide()

              return false
          } else {
              const deletingIndex = this.businessCategoryList.findIndex((d: any) => {
                  return d.id === this.selectedId
              })
              this.businessCategoryList.splice(deletingIndex, 1)
              this.modalRef.hide()
              this.alert.success('category deleted successfully!!')
          }
      })
}

confirmingModal(template: TemplateRef<any>, id: any, i: any) {
  this.selectedId = id
  this.selectedIndex = i
  this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
}

cancelButton(f: any) {
  f.resetForm()
  this.thumbnail = '/assets/img/no_image.png' 
  this.modalRef.hide()
}
browseThumbnail(event: any) {
  event.preventDefault()
  const element = document.getElementById('thumbnail-image')
  element.click()
}

onThumbnailChange(event: any, template: TemplateRef<any>) {
  const file = event.target.files[0]
  const allowedExtensions = ['png', 'jpg', 'jpeg']
  const extension = file.name.split('.').pop().toLowerCase()
  const fileSize = file.size / 1024 / 1024
  if (fileSize > 3) {
      this.alert.error('File size must not exceed 3MB')
  } else if (allowedExtensions.indexOf(extension) < 0) {
      this.alert.error('Format type is invalid.Required formats are PNG,JPG,JPEG')
  } else {
      this.imageChangedEvent = event
      this.cropperModalRef = this.modalService.show(
          template,
          Object.assign({}, { class: 'modal-md modal-dialog-centered modal-dialog-scrollable' })
      )
  }
}

doneCroppingThumbnail() {
  this.thumbnail = this.croppedImage
  document.getElementById('banner-img').setAttribute('src', this.thumbnail)
  this.cropperModalRef.hide()
}

imageCropped(event: ImageCroppedEvent) {
  this.croppedImage = event.base64
}

imageLoaded() {
  // show cropper
}
cropperReady() {
  // cropper ready
}
loadImageFailed() {
  // show message
}

}
