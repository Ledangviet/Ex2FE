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
    this.loadTree();
    this.eventSubscription.push(
      this.nodeService.reloadTreeEmit.subscribe(e =>{
        this.loadTree();
      })
    )
  }

  loadTree(){
    this.eventSubscription.push(
      this.nodeService.getNodeData().subscribe((res)=> {
        this.treeNodes = res;   
      })
    ) 
  }

  items = Array.from({length: 100000}).map((_, i) => `Item #${i}`);

  public iconClass(dataItem:NodeModel): any {
    if(dataItem.nodeType == "1")
      return "insert_drive_file";
    else return "folder";
  }


  nodeClick(arg:any): void{
    this.nodeService.idEmit.emit(arg.dataItem.id);    
  }

  ngOnDestroy(){
    this.eventSubscription.map(e => e.unsubscribe())
  }
}
