import { Component, HostListener, Input } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { NodeService } from '../service/node.service';
import { NodeModel } from '../model/node/node.model';
import { Subscription } from 'rxjs';
import { UpdateNodeModel } from '../model/node/updatenode.model';
import { DialogCloseResult, DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { EditComponent } from '../edit/edit.component';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from '../service/application.service';
import { AddApplicationModel } from '../model/application/addapplication.model';
import { CookieService } from 'ngx-cookie-service';
import { AddNodeModel } from '../model/node/addnode.model';
import { mode } from 'crypto-js';
import { UpdateResponseModel } from '../model/node/updateresponse.model';

@Component({
  selector: 'app-nodeinfo',
  templateUrl: './nodeinfo.component.html',
  styleUrls: ['./nodeinfo.component.scss']
})

export class NodeinfoComponent {

  public appId: number;
  public addStatus = false;
  public addState: number;
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

  @HostListener('window:beforeunload', ['$event'])
  handlePageRefresh(event: Event) {
    if (this.form.dirty) return false;
    return true;
  }

  constructor(
    private dialogService: DialogService,
    private nodeService: NodeService,
    private toastr: ToastrService,
    private appService: ApplicationService,
    private cookieService: CookieService
  ) { }
  ngOnInit() {

    //subcrible add node emit
    this.eventSubscription.add(this.nodeService.addNodeEmit.subscribe((id: number) => {
      if (id == 1 && this.nodeId != "0") {
        if(this.nodeData.nodeType == "Folder"){
          this.toastr.warning("Add child node!");
          this.form = new FormGroup({
            title: new FormControl("", [Validators.required]),
            type: new FormControl("Folder", [Validators.required]),
          })         
        }else{
          return;
        }        
      }
      if (id == 0) {
        this.toastr.warning("Add root node!");
        this.form = new FormGroup({
          title: new FormControl("", [Validators.required]),
          type: new FormControl("Folder", [Validators.required]),
        });
      }
      this.addState = id;
      this.addStatus = true;
    }))

    this.eventSubscription.add(this.appService.appEmit.subscribe(id => {
      this.appId = id;
      this.form = new FormGroup({
        title: new FormControl("", [Validators.required]),
        type: new FormControl("Folder", [Validators.required]),
      });
    }))

    //subcrible id from treeview component and fetch API to get data & bind to UI
    this.eventSubscription.add(
      this.nodeService.idEmit.subscribe(id => {

        //if data is adding data
        if (this.addStatus == true) {
          this.addStatus = false;
          const dialog: DialogRef = this.dialogService.open({
            title: "Data hasn't been save!",
            content: "Do you want to add?",
            actions: [{ text: "Yes", themeColor: "dark" }, { text: "No" }],
            width: 450,
            height: 200,
            minWidth: 250,
          });

          this.eventSubscription.add(dialog.result.subscribe((result) => {
            if (result instanceof DialogCloseResult) {
              this.bindingData(id);
              return;
            } else {
              if (result.text == "Yes") {
                this.addClick();
                this.bindingData(id);
                this.addStatus = false;
                return;
              }
            }
          }))
        } else {
          //if data is updating data
          if (this.form.dirty && !this.updateState) {
            const dialog: DialogRef = this.dialogService.open({
              title: "Data hasn't been save!",
              content: "Do you want to update?",
              actions: [{ text: "Yes", themeColor: "dark" }, { text: "No" }],
              width: 450,
              height: 200,
              minWidth: 250,
            });

            this.eventSubscription.add(dialog.result.subscribe((result) => {
              if (result instanceof DialogCloseResult) {
                this.bindingData(id);
                return;
              } else {
                if (result.text == "Yes") {
                   this.saveClick()                 
                }               
              }
              this.bindingData(id);
            }))
          }
        }
        //None of adding/upating then normaly bind data
        this.bindingData(id)               
      })
    );

    this.eventSubscription.add(
      this.form.valueChanges.subscribe(() => {
        this.updateState = false;
      }))

  }

  //binding new node data
  bindingData(id: string) {
    this.nodeId = id
    this.eventSubscription.add(
      this.nodeService.getNodeDataById(this.nodeId).subscribe((res) => {
        this.nodeData = this.nodeService.FormatData(res);
        if (this.nodeData.nodeType == "File") this.pattern = this.fileNamePattern;
        else this.pattern = this.folderPattern;

        this.form = new FormGroup({
          title: new FormControl(this.nodeData.name,
            [
              Validators.required,
              Validators.pattern(this.pattern),
              Validators.maxLength(50)
            ]
          ),
          type: new FormControl(this.nodeData.nodeType, [Validators.required]),
        })
        this.eventSubscription.add(this.form.valueChanges.subscribe(e => {
          this.updateState = false;
        }))
      })
    )

  }

  changeType(arg: any) {
    if (arg.value == "File") this.pattern = this.fileNamePattern;
    else this.pattern = this.folderPattern;
  }

  /**
   * add node event
   */
  addClick() {
    if (this.form.value.title) {
      var model = new AddNodeModel(
        this.form.value.title,
        this.form.value.type == "Folder" ? 0 : 1,
        this.addState == 0 ? 0 : this.nodeData.id,
        this.cookieService.get("username"),
        this.appId,
        new Date(),
      )

      this.eventSubscription.add(this.nodeService.addNode(model).subscribe((res: NodeModel) => {
        this.toastr.success("Add succeeded!")
        this.form = new FormGroup({
          title: new FormControl("", [Validators.required]),
          type: new FormControl("Folder", [Validators.required]),
        });
        this.appService.appEmit.emit(this.appId);
        this.nodeService.gridEmit.emit(0)
      }))
    }
  }



  saveClick() {
    console.log("update");

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
          //this.nodeService.reloadTreeEmit.emit(res);
          this.updateState = true;
          //this.nodeService.lazyLoadEmit.emit(res.nodeModel);
          this.appService.appEmit.emit(this.nodeData.applicationId);
          // this.nodeService.lazyLoadEmit.emit(res);
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
