import { Component } from '@angular/core';
import { NodeService } from '../service/node.service';
import { NodeModel } from '../model/node.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss']
})
export class TreeviewComponent {
  public eventSubscription : Subscription = new Subscription();
  public treeNodes: NodeModel[] = []; 

  constructor(private nodeService:NodeService){}
  ngOnInit(){
    this.loadTree();

    //refresh tree if there's any update in other component
    this.eventSubscription.add(
      this.nodeService.reloadTreeEmit.subscribe(e =>{
        this.loadTree();
      })
    )
  }


  /**
   * load new tree form
   */
  loadTree(){
    this.eventSubscription.add(
      this.nodeService.getNodeData().subscribe((res)=> {
        this.treeNodes = res;   
      })
    ) 
  }

  /**
   * define name for mat icon by nodeType
   * @param dataItem 
   * @returns 
   */
  
  public iconClass(dataItem:NodeModel): any {
    if(dataItem.nodeType == "1")
      return "insert_drive_file";
    return "folder";
  }

  /**
   * binding selected node's id to other component through service's "idEmit"
   */  
  nodeClick(arg:any): void{

    this.nodeService.idEmit.emit(arg.dataItem.id);    
  }

  //unsuscrible
  ngOnDestroy(){
    this.eventSubscription.unsubscribe();
  }
}
