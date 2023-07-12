import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { DataService } from './data.service'

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
})
export class ServicesComponent implements OnInit {
  dataStatus = 'fetching'
  servicesList = []
  serviceForm: FormGroup
  selectedIndex: any
  modalRef: BsModalRef
  selectedId: any
  constructor(
    private adminApi: DataService,
    private fb: FormBuilder,
    public ui: UIHelpers,
    private alert: IAlertService,
    private ms: BsModalService,
  ) { 
    this.serviceForm = this.fb.group({
      id: new FormControl(null),
      full_name: new FormControl(null, [Validators.required]),
      short_name: new FormControl(null, [Validators.required]),
  })

  }

  ngOnInit() {
    this.adminApi.getServices().subscribe((resp: any) => {
      if (resp.success === true) {
          this.servicesList = resp.data
          this.dataStatus = 'done'
      }
   })
  }

get g() {
  return this.serviceForm.controls
}

openModalService(serviceModal, index) {
    if (index > -1) {
        this.selectedIndex = index
        this.serviceForm .controls.id.setValue(this.servicesList[index].id)
        this.serviceForm .patchValue(this.servicesList[index])
    }
    this.modalRef = this.ms.show(
        serviceModal,
        {
            class: 'modal-md modal-dialog-centered admin-panel',
            backdrop: 'static',
            ignoreBackdropClick: true,
            keyboard: false
        }
    )
}

saveService(data: any, f: any) {
  if (data.status === 'INVALID') {
      this.alert.error('Please fill-in valid data in all fields & try again.')

      return false
  }
  const params = {
      id: this.serviceForm.value.id,
      full_name: data.value.full_name,
      short_name: data.value.short_name,
  }

  let saveUpdate = this.adminApi.addService(params)
  if (this.serviceForm.value.id !== null) {
      saveUpdate = this.adminApi.updateService(params)
  }
  saveUpdate.subscribe((resp: any) => {
      if (resp.success === false) {
          this.alert.error(resp.errors.general)
          this.modalRef.hide()
          f.resetForm()


          return false
      } else {
          if (this.serviceForm.value.id !== null) {
              this.alert.success('Changes done successfully!!')
              this.servicesList[this.selectedIndex] = params
              this.serviceForm.controls.id.setValue(null)
          } else {
              params.id = resp.data
              this.alert.success('service added successfully!!')
              this.servicesList.push(params)
          }
      }
      this.modalRef.hide()
      f.resetForm()
  })
}

deleteService() {
  const params = {
      id: this.selectedId
  }
  this.adminApi.deleteService(params)
      .subscribe((resp: any) => {
          if (resp.success === false) {
              this.alert.error(resp.errors.general)
              this.modalRef.hide()

              return false
          } else {
              const deletingIndex = this.servicesList.findIndex((d: any) => {
                  return d.id === this.selectedId
              })
              this.servicesList.splice(deletingIndex, 1)
              this.modalRef.hide()
              this.alert.success('Service deleted successfully!!')
          }
      })
}

confirmingModal(template: TemplateRef<any>, id: any, i: any) {
  this.selectedId = id
  this.selectedIndex = i
  this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
}

cancelServiceButton(f: any) {
  f.resetForm()
  this.modalRef.hide()
}


}
