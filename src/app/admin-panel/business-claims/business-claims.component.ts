import { ConstantsService } from './../../services/constants.service'
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit , TemplateRef} from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { DataService } from './data.service'
import * as moment from 'moment'



@Component({
  selector: 'app-business-claims',
  templateUrl: './business-claims.component.html',
  styleUrls: ['./business-claims.component.css']
})
export class BusinessClaimsComponent implements OnInit {

  dataStatus = 'fetching'
  dataList = []
  dataForm: FormGroup
  moment = moment
  selectedIndex: any
  modalRef: BsModalRef
  selectedId: any
  constructor(
    public cs: ConstantsService,
    private adminApi: DataService,
    private fb: FormBuilder,
    public ui: UIHelpers,
    private alert: IAlertService,
    private ms: BsModalService,
   
  ) { 
    this.dataForm = this.fb.group({
      id: new FormControl(null),
      response_note: new FormControl(null, [Validators.required]),
  })

  }

  ngOnInit() {
    this.adminApi.get().subscribe((resp: any) => {
      console.log('data', resp.data)
      
      if (resp.success === true) {
          this.dataList = resp.data
          this.dataStatus = 'done'
      }
   })
  }

  get g() {
    return this.dataForm.controls
  }

  openModal(dataModal,id, index) {
      if (index > -1) {
          this.selectedIndex = index
          this.selectedId = id
      }
      this.modalRef = this.ms.show(
          dataModal,
          {
              class: 'modal-md modal-dialog-centered admin-panel',
              backdrop: 'static',
              ignoreBackdropClick: true,
              keyboard: false
          }
      )
  }

  rejectRequest(data: any, f: any) {
    if (data.status === 'INVALID') {
        this.alert.error('Please fill-in valid data in all fields & try again.')

        return false
    }
    data.value.id = this.selectedId 
    let status = this.adminApi.rejectClaim(data.value)
    status.subscribe((resp: any) => {
        if (resp.success === false) {
            this.alert.error(resp.errors.general)
            this.modalRef.hide()
            f.resetForm()
            return false
        } else {
            this.alert.success('Request Rejected successfully!!')
            this.dataList.splice(this.selectedIndex)
        }
        this.modalRef.hide()
        f.resetForm()
    })
  }

  acceptRequest(id:any, index) {
    this.selectedIndex = index
    this.selectedId= id
    const params={id:this.selectedId}  
    console.log(params)
    let status = this.adminApi.approveRequest(params)
    status.subscribe((resp: any) => {
        if (resp.success === false) {
            this.alert.error(resp.errors.general)
            return false
        } else {
            this.alert.success('Request Approved successfully!!')
            this.dataList.splice(this.selectedIndex)
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
