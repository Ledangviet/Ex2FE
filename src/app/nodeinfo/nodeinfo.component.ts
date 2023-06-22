import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { NodeService } from '../service/node.service';
import { NodeModel } from '../model/NodeModel';
import { Subscription } from 'rxjs';


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
  public nodeId:string;
  public nodeData: NodeModel;
  public form:FormGroup;
  public type = "File";

  constructor(private nodeService:NodeService){  
  }
  ngOnInit(){
    this.eventSubscription.push( this.nodeService.idEmit.subscribe(id => {
      this.nodeId=id
      this.eventSubscription.push(
        this.nodeService.getNodeDataById(this.nodeId).subscribe((res) => {
          this.nodeData = this.nodeService.FormatData(res);
          console.log(this.nodeData);
          
          this.form = new FormGroup({
            title: new FormControl(this.nodeData.name, [Validators.required]),
            type: new FormControl(this.nodeData.nodeType, [Validators.required]),
          })}))
    }));
       
  } 
  ngOnDestroy(){
    this.eventSubscription.map(e => e.unsubscribe())
  }
}
