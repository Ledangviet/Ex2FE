import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { NodeService } from '../service/node.service';
import { NodeModel } from '../model/NodeModel';
import { Subscription } from 'rxjs';
import { UpdateNodeModel } from '../model/UpdateNodeModel';
import { DialogCloseResult, DialogRef, DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'app-nodeinfo',
  templateUrl: './nodeinfo.component.html',
  styleUrls: ['./nodeinfo.component.scss']
})

export class NodeinfoComponent {
  public eventSubscription : Subscription = new Subscription();
  public types: Array<string> = [
     "Folder",
     "File"
  ];
  public dialogresult:any;
  public nodeId:string = "0";
  public nodeData: NodeModel;
  public form = new FormGroup({
    title: new FormControl("", [Validators.required]),
    type: new FormControl("", [Validators.required]),
  });

  constructor(
    private dialogService:DialogService,
    private nodeService:NodeService
    ){ 
    
  }
  ngOnInit(){
 
    //subcrible id from treeview component and fetch API to get data & bind to UI
    this.eventSubscription.add(
       this.nodeService.idEmit.subscribe(id => {
        this.nodeId=id
        this.eventSubscription.add(
          this.nodeService.getNodeDataById(this.nodeId).subscribe((res) => {
            this.nodeData = this.nodeService.FormatData(res);
            this.form = new FormGroup({
              title: new FormControl(this.nodeData.name, [Validators.required]),
              type: new FormControl(this.nodeData.nodeType, [Validators.required]),
            })
          })
        )
      })
    );      
  } 
  
  saveClick(){  
    //logic validate
    if(this.nodeData.nodeType == "Folder" && this.form.value.type == "File"){
      alert("Folder can't update to File!")
      return;
    }
    //show dialog action
    const dialog: DialogRef = this.dialogService.open({
      title: "Please confirm",
      content: "Are you sure to update?",
      actions: [{ text: "Yes" }, { text: "Cancel", themeColor: "tertiary" }],
      width: 450,
      height: 200,
      minWidth: 250,
    });

    //subscrible dialog result
    this.eventSubscription.add(dialog.result.subscribe((result) => {
      if (result instanceof DialogCloseResult) {
        return;
      } else {
        if(result.text == "Yes"){
          var typeValue :number;      
          if(this.form.value.title && this.form.value.type){
            
            //call update service
            if(this.form.value.type == "File") typeValue = 1
            else typeValue = 0
            var updateNodeModel = new UpdateNodeModel(this.nodeData.id,this.form.value.title,typeValue,this.nodeData.parrentId);
            this.eventSubscription.add(
              this.nodeService.updateNodeData(updateNodeModel).subscribe((res) => {
                this.nodeService.reloadTreeEmit.emit(res); 
              })
            )     
          }     
        }
        else return;               
      }   
    }));
  }
  
  ngOnDestroy(){
    this.eventSubscription.unsubscribe();
  }
}
