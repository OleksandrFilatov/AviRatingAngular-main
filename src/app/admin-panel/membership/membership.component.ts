import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit , TemplateRef} from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { DataService } from './data.service'
import { ImageCroppedEvent } from 'ngx-image-cropper'


@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent implements OnInit {

  dataStatus = 'fetching'
  dataList = []
  dataForm: FormGroup
  selectedIndex: any
  thumbnail = '/assets/img/no_image.png'
  imageChangedEvent: any = ''
  cropperModalRef: BsModalRef
  submitData = ''
  croppedImage: any = ''
  modalRef: BsModalRef
  selectedId: any
  constructor(
    private adminApi: DataService,
    private fb: FormBuilder,
    public ui: UIHelpers,
    private alert: IAlertService,
    private modalService: BsModalService,
    private ms: BsModalService,
    public api: ApiService
  ) { 
    this.dataForm = this.fb.group({
      id: new FormControl(null),
      title: new FormControl(null, [Validators.required]),
      number_of_listings: new FormControl(null, [Validators.required]),
      monthly_price: new FormControl(null, [Validators.required]),
  })

  }

  ngOnInit() {
    this.adminApi.get().subscribe((resp: any) => {
      if (resp.success === true) {
          this.dataList = resp.data
          this.dataStatus = 'done'
      }
   })
  }

get g() {
  return this.dataForm.controls
}

openFormModal(form, index, id) {
    if (index > -1) {
        this.selectedIndex = index
        this.dataForm .controls.id.setValue(this.dataList[index].id)
        this.dataForm .patchValue(this.dataList[index])
        this.thumbnail = this.api.membershipImageUrl(id)
    }
    this.modalRef = this.ms.show(
        form,
        {
            class: 'modal-lg modal-dialog-centered admin-panel',
            backdrop: 'static',
            ignoreBackdropClick: true,
            keyboard: false
        }
    )
}

saveForm(data: any, f: any): boolean {
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
          formData.append('membership_image', imageFile)
      })
  requiredPromises.push(thumbnailPromise)
  Promise.all(requiredPromises)
      .then(_ => this.sendCall(formData,f))
}

sendCall(formData: FormData, f:any): void {
  let saveUpdate = this.adminApi.add(formData)
  if (this.dataForm.value.id !== null) {
      saveUpdate = this.adminApi.update(formData)
  }
  saveUpdate.subscribe((resp: any) => {
    if (resp.success === false) {
        this.alert.error(resp.errors.general)
        this.modalRef.hide()
        f.resetForm()


        return false
    } else {
        if (this.dataForm.value.id !== null) {
            this.alert.success('Changes done successfully!!')
            this.dataList[this.selectedIndex] = this.submitData
            this.api.categoryImageUrl(this.dataForm.value.id)
        } else {
            this.alert.success('added successfully!!')
            this.dataList.push(resp.data)
        }
    }
    this.thumbnail = '/assets/img/no_image.png' 
    this.modalRef.hide()
    f.resetForm()
})
}

deleteRow() {
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
              const deletingIndex = this.dataList.findIndex((d: any) => {
                  return d.id === this.selectedId
              })
              this.dataList.splice(deletingIndex, 1)
              this.modalRef.hide()
              this.alert.success('category deleted successfully!!')
          }
      })
}

activePlan(id,index){
  this.selectedId = id
  this.selectedIndex = index
  const params = {id:this.selectedId}
  this.adminApi.activePlan(params)
      .subscribe((resp: any) => {
          if (resp.success === false) {
              this.alert.error(resp.errors.general)
              this.modalRef.hide()

              return false
          } else {
              this.dataList[this.selectedIndex].status = 'ACTIVE'
              this.alert.success('Membershiup Active successfully!!')
          }
      })


}

inactivePlan(id,index){
  this.selectedId = id
  this.selectedIndex = index
  const params = {id:this.selectedId}
  this.adminApi.inactivePlan(params)
      .subscribe((resp: any) => {
          if (resp.success === false) {
              this.alert.error(resp.errors.general)
              this.modalRef.hide()

              return false
          } else {
              this.dataList[this.selectedIndex].status = 'INACTIVE'
              this.alert.success('Membership Inactive successfully!!')
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
