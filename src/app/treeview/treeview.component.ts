import { Component } from '@angular/core';
import { NodeService } from '../service/node.service';
import { NodeModel } from '../model/NodeModel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss']
})
export class TreeviewComponent {
  public eventSubscription : Subscription[] = [];
  public treeNodes: NodeModel[] = []; 
  constructor(private nodeService:NodeService){}
  ngOnInit(){
    this.eventSubscription.push(
      this.nodeService.getNodeData().subscribe((res)=> {
        this.treeNodes = res;   
      })
    ) 
  }

  nodeClick(arg:any){
    console.log(arg.dataItem.id); 
    this.nodeService.idEmit.emit(arg.dataItem.id); 
  }

  ngOnDestroy(){
    this.eventSubscription.map(e => e.unsubscribe())
  }
}
