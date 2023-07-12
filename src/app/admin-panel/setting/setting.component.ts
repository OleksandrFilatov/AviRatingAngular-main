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
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

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
      home_banner_price: new FormControl(null, [Validators.required])
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
        this.selectedId = id
        this.dataForm .controls.id.setValue(this.dataList[index].id)
        this.dataForm .patchValue(this.dataList[index])
    }
    this.modalRef = this.ms.show(
        form,
        {
            class: 'modal-sm modal-dialog-centered admin-panel',
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
  data.value.id = this.selectedId
 console.log(data.value)
  this.adminApi.update(data.value).subscribe((resp: any) => {
    if (resp.success === false) {
        this.alert.error(resp.errors.general)
        this.modalRef.hide()
        f.resetForm()


        return false
    } else {
          this.alert.success('Changes done successfully!!')
          this.dataList[this.selectedIndex] = data.value
    }
    this.thumbnail = '/assets/img/no_image.png' 
    this.modalRef.hide()
    f.resetForm()
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



}
