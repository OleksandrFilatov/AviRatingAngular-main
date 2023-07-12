import { state } from '@angular/animations';
import { Component, OnInit , TemplateRef} from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { DataService } from './data.service'
import { IfStmt } from '@angular/compiler'

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  dataStatus = 'fetching'
  dataList = []
  dataForm: FormGroup
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

openFormModal(form, index) {
    if (index > -1) {
        this.selectedIndex = index
        this.dataForm .controls.id.setValue(this.dataList[index].id)
        this.dataForm .patchValue(this.dataList[index])
    }
    this.modalRef = this.ms.show(
        form,
        {
            class: 'modal-md modal-dialog-centered admin-panel',
            backdrop: 'static',
            ignoreBackdropClick: true,
            keyboard: false
        }
    )
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

updateStatus(rowId: number, readStatus: string) {
  const params = {
      id: rowId,
      status: readStatus
  }
  this.adminApi.statusUpdate(params)
      .subscribe((resp: any) => {
          if (resp.success === false) {
              this.alert.error(resp.errors.general)
              this.modalRef.hide()

              return false
          } else {
              const Index = this.dataList.findIndex(d => d.id === rowId)
              console.log(Index)
              this.dataList[Index].status = readStatus 
              this.alert.success('status updated successfully!!')
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
