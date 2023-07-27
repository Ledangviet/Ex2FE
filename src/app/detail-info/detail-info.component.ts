import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NodeService } from '../service/node.service';
import { NodeModel } from '../model/node/node.model';
import { Subscription } from 'rxjs';
import { DialogCloseResult, DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { UpdateNodeModel } from '../model/node/updatenode.model';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from '../service/application.service';
import { UpdateResponseModel } from '../model/node/updateresponse.model';

@Component({
  selector: 'app-detail-info',
  templateUrl: './detail-info.component.html',
  styleUrls: ['./detail-info.component.scss']
})
export class DetailInfoComponent {

  public updateStatus = false;
  public eventSub = new Subscription();
  @Input() nodeId: string;
  public nodeData: NodeModel;

  public types: Array<string> = [
    "Folder",
    "File"
  ];

  public form = new FormGroup({
    title: new FormControl("title", [Validators.required]),
    type: new FormControl("type", [Validators.required]),
    submitdate: new FormControl("submitdate", [Validators.required]),
    owner: new FormControl("owner", [Validators.required]),
  });

  constructor(
    private nodeService: NodeService,
    private dialog: DialogRef,
    private toastr: ToastrService,
    private dialogService: DialogService,
    private appService: ApplicationService,
  ) { }


  ngOnInit() {
    this.eventSub.add(this.nodeService.closeDialogEmit.subscribe(res => {
      this.closeClick()
    }))
    if (this.nodeId) {
      this.eventSub.add(

        //load node data
        this.nodeService.getNodeDataById(this.nodeId).subscribe(res => {
          this.nodeData = this.nodeService.FormatData(res);
          this.form = new FormGroup({
            title: new FormControl(this.nodeData.name, [Validators.required,
            Validators.maxLength(50)]),
            type: new FormControl(this.nodeData.nodeType, [Validators.required]),
            submitdate: new FormControl(this.nodeData.submissionDate.toString().slice(0, 10), [Validators.required]),
            owner: new FormControl(this.nodeData.owner, [Validators.required,
            Validators.maxLength(50)]),
          });
        })
      );
      this.eventSub.add(
        this.form.valueChanges.subscribe((value) => {
          this.updateStatus = false;
        })
      )
    }
  }

  /**
   * Validate and call update API
   * @returns 
   */
  saveClick() {
    this.updateStatus = true;
    var typeValue: number;
    //logic validate
    if (this.form.value.type == "File" && this.nodeData.nodeType == "Folder") {
      this.toastr.error("Folder cannot update to file!");
      return;
    }
    if (this.form.invalid) {
      this.toastr.error("Update fail!")
      return;
    }
    //get data & create model & call update api
    if (
      this.form.value.title &&
      this.form.value.owner &&
      this.form.value.submitdate &&
      this.form.value.type
    ) {

      if (this.form.value.type == "File") typeValue = 1
      else typeValue = 0

      //get model data form form value
      var model = new UpdateNodeModel(
        this.nodeData.id,
        this.form.value.title,
        typeValue,
        this.nodeData.parrentId,
        new Date(this.form.value.submitdate),
        this.form.value.owner
      )

      //call update node service
      this.eventSub.add(
        this.nodeService.updateNodeData(model).subscribe((res: UpdateResponseModel) => {
          if (res.succeed == true) {
            this.toastr.success("Update Succeed!")
            this.nodeService.idEmit.emit(this.nodeData.id);
            this.appService.appEmit.emit(this.nodeData.applicationId);
            // this.nodeService.lazyLoadEmit.emit(res.nodeModel);
          } else {
            this.toastr.error("Update Fail!")
          }
          this.dialog.close(this.form.value);
        })
      )
    }

  }

  /**
   * if data has not saved then ask user to save or not
   */
  changeVerify() {
    const dialog: DialogRef = this.dialogService.open({
      title: "Please confirm",
      content: "Do you want to save change?",
      actions: [{ text: "Yes", themeColor: "tertiary" }, { text: "No" }],
      width: 450,
      height: 200,
      minWidth: 250,
    });

    this.eventSub.add(dialog.result.subscribe((result) => {
      if (result instanceof DialogCloseResult) {
      } else {
        if (result.text == "Yes") {
          this.saveClick()
        } else {
          this.dialog.close();
        }
      }
    }))
  }

  /**
   * close dialog
   * @returns 
   */
  closeClick() {
    if (!this.updateStatus && !this.form.untouched) {
      this.changeVerify();
      return;
    }
    this.dialog.close();
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }
}
