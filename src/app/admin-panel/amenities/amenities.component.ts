import { Component, OnInit , TemplateRef} from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { DataService } from './data.service'

@Component({
  selector: 'app-amenities',
  templateUrl: './amenities.component.html',
  styleUrls: ['./amenities.component.scss']
})
export class AmenitiesComponent implements OnInit {
  dataStatus = 'fetching'
  amenityList = []
  amenityForm: FormGroup
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
    this.amenityForm = this.fb.group({
      id: new FormControl(null),
      full_name: new FormControl(null, [Validators.required]),
      short_name: new FormControl(null, [Validators.required]),
  })

  }

  ngOnInit() {
    this.adminApi.get().subscribe((resp: any) => {
      if (resp.success === true) {
          this.amenityList = resp.data
          this.dataStatus = 'done'
      }
   })
  }

get g() {
  return this.amenityForm.controls
}

openModalAmenity(amenityModal, index) {
    if (index > -1) {
        this.selectedIndex = index
        this.amenityForm .controls.id.setValue(this.amenityList[index].id)
        this.amenityForm .patchValue(this.amenityList[index])
    }
    this.modalRef = this.ms.show(
        amenityModal,
        {
            class: 'modal-md modal-dialog-centered admin-panel',
            backdrop: 'static',
            ignoreBackdropClick: true,
            keyboard: false
        }
    )
}

saveAmenity(data: any, f: any) {
  if (data.status === 'INVALID') {
      this.alert.error('Please fill-in valid data in all fields & try again.')

      return false
  }
  const params = {
      id: this.amenityForm.value.id,
      full_name: data.value.full_name,
      short_name: data.value.short_name,
  }

  let saveUpdate = this.adminApi.add(params)
  if (this.amenityForm.value.id !== null) {
      saveUpdate = this.adminApi.update(params)
  }
  saveUpdate.subscribe((resp: any) => {
      if (resp.success === false) {
          this.alert.error(resp.errors.general)
          this.modalRef.hide()
          f.resetForm()


          return false
      } else {
          if (this.amenityForm.value.id !== null) {
              this.alert.success('Changes done successfully!!')
              this.amenityList[this.selectedIndex] = params
              this.amenityForm.controls.id.setValue(null)
          } else {
              params.id = resp.data
              this.alert.success('Amenity added successfully!!')
              this.amenityList.push(params)
          }
      }
      this.modalRef.hide()
      f.resetForm()
  })
}

deleteAmenity() {
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
              const deletingIndex = this.amenityList.findIndex((d: any) => {
                  return d.id === this.selectedId
              })
              this.amenityList.splice(deletingIndex, 1)
              this.modalRef.hide()
              this.alert.success('Amenity deleted successfully!!')
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



}
