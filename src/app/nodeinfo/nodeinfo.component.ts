import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { NodeService } from '../service/node.service';
import { NodeModel } from '../model/NodeModel';
import { Subscription } from 'rxjs';
import { UpdateNodeModel } from '../model/UpdateNodeModel';

@Component({
  selector: 'app-nodeinfo',
  templateUrl: './nodeinfo.component.html',
  styleUrls: ['./nodeinfo.component.scss']
})

export class NodeinfoComponent {
  public eventSubscription : Subscription[] = [];
  public types: Array<string> = [
     "Folder",
     "File"
  ];
  public nodeId:string = "0";
  public nodeData: NodeModel;
  public form = new FormGroup({
    title: new FormControl("This is title!", [Validators.required]),
    type: new FormControl("This is type!", [Validators.required]),
  });

  constructor(private nodeService:NodeService){ 
    
  }
  ngOnInit(){
 
    //subcrible id from treeview component and fetch API to get data & bind to UI
    this.eventSubscription.push(
       this.nodeService.idEmit.subscribe(id => {
        this.nodeId=id
        this.eventSubscription.push(
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
    var sucess = false;
    var typeValue :number;      
    if(this.form.value.title && this.form.value.type){
      if(this.form.value.type == "File") typeValue = 1
      else typeValue = 0
      var updateNodeModel = new UpdateNodeModel(this.nodeData.id,this.form.value.title,typeValue,this.nodeData.parrentId);
      this.eventSubscription.push(
        this.nodeService.updateNodeData(updateNodeModel).subscribe((res) => {
          alert("Update Sucessful!") 
          this.nodeService.reloadTreeEmit.emit(res);   
        })
      )     
    }     
  }

  ngOnDestroy(){
    this.eventSubscription.map(e => e.unsubscribe())
  }
}
