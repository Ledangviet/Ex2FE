import { Component, HostListener, Input } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { NodeService } from '../service/node.service';
import { NodeModel, UpdateResponseModel } from '../model/node.model';
import { Subscription } from 'rxjs';
import { UpdateNodeModel } from '../model/updatemodel.model';
import { DialogCloseResult, DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { EditComponent } from '../edit/edit.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nodeinfo',
  templateUrl: './nodeinfo.component.html',
  styleUrls: ['./nodeinfo.component.scss']
})

export class NodeinfoComponent {

  @HostListener ('window:beforeunload',['$event'])
  handlePageRefresh(event:Event){
    if(this.form.dirty) return false;
    return true;
  }

  public updateState = false;

  public eventSubscription: Subscription = new Subscription();
  public types: Array<string> = [
    "Folder",
    "File"
  ];
  public dialogresult: any;
  public nodeId: string = "0";
  public nodeData: NodeModel;
  public form = new FormGroup({
    title: new FormControl("", [Validators.required]),
    type: new FormControl("", [Validators.required]),
  });
  public fileNamePattern = /^\b[a-zA-Z][a-zA-Z0-9._]+$/;
  public folderPattern = /[a-zA-Z0-9_\s]+$/;

  public pattern: any;

  constructor(
    private dialogService: DialogService,
    private nodeService: NodeService,
    private toastr: ToastrService,
  ) {

  }
  ngOnInit() {
    //subcrible id from treeview component and fetch API to get data & bind to UI
    this.eventSubscription.add(
      this.nodeService.idEmit.subscribe(id => {

        if (this.form.dirty && !this.updateState) {

          console.log('aaaa');

          const dialog: DialogRef = this.dialogService.open({
            title: "Data hasn't been save!",
            content: "Do you want to update?",
            actions: [{ text: "Yes", themeColor: "tertiary" }, { text: "No" }],
            width: 450,
            height: 200,
            minWidth: 250,
          });

          this.eventSubscription.add(dialog.result.subscribe((result) => {
            if (result instanceof DialogCloseResult) {
              return;
            } else {
              if (result.text == "Yes") {
                this.saveClick()
              }

              //binding new node data
              this.nodeId = id
              this.eventSubscription.add(
                this.nodeService.getNodeDataById(this.nodeId).subscribe((res) => {
                  this.nodeData = this.nodeService.FormatData(res);
                  if (this.nodeData.nodeType == "File") this.pattern = this.fileNamePattern;
                  else this.pattern = this.folderPattern;
                  this.form = new FormGroup({
                    title: new FormControl(this.nodeData.name,
                      [Validators.required,
                      Validators.pattern(this.pattern)]
                    ),
                    type: new FormControl(this.nodeData.nodeType, [Validators.required]),
                  })
                  this.eventSubscription.add(this.form.valueChanges.subscribe( e => {   
                    this.updateState = false;
                  }))
                })
              )
            }
          }))

        } else {
          this.nodeId = id
          this.eventSubscription.add(
            this.nodeService.getNodeDataById(this.nodeId).subscribe((res) => {
              this.nodeData = this.nodeService.FormatData(res);
              if (this.nodeData.nodeType == "File") this.pattern = this.fileNamePattern;
              else this.pattern = this.folderPattern;

              this.form = new FormGroup({
                title: new FormControl(this.nodeData.name,
                  [Validators.required,
                  Validators.pattern(this.pattern)]
                ),
                type: new FormControl(this.nodeData.nodeType, [Validators.required]),
              })
              this.eventSubscription.add(this.form.valueChanges.subscribe( e => {   
                this.updateState = false;
              }))
            })
          )

        }

      })
    );
  }

  changeType(arg: any) {
    if (arg.value == "File") this.pattern = this.fileNamePattern;
    else this.pattern = this.folderPattern;
  }

  
  saveClick() {
    //logic validate
    if (this.nodeData.nodeType == "Folder" && this.form.value.type == "File") {
      this.toastr.error("Folder can't update to File!")
      return;
    }
    if (this.form.invalid) {
      this.toastr.error("Update Fail!");
      return;
    }
    //subscrible dialog result
    this.updateState = true;
    var typeValue: number;
    if (this.form.value.title && this.form.value.type) {

      //call update service
      if (this.form.value.type == "File") typeValue = 1
      else typeValue = 0
      var updateNodeModel = new UpdateNodeModel(
        this.nodeData.id,
        this.form.value.title, typeValue,
        this.nodeData.parrentId,
        this.nodeData.submissionDate,
        this.nodeData.owner
      );
      this.eventSubscription.add(
        this.nodeService.updateNodeData(updateNodeModel).subscribe((res: UpdateResponseModel) => {
          this.toastr.success("Update Succeeded!");
          this.nodeService.reloadTreeEmit.emit(res);
        })
      )
    }
  }

  editClick() {
    const dialogRef: DialogRef = this.dialogService.open({
      title: "Edit Information",
      content: EditComponent,
      width: 550,
    });

    const userInfo = dialogRef.content.instance as EditComponent;
    userInfo.nodeId = this.nodeId
  }


  //unsubscrible subscription
  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }
}
