import { Component } from '@angular/core';
import { NodeService } from '../service/node.service';
import { NodeModel, UpdateResponseModel } from '../model/node.model';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss']
})
export class TreeviewComponent {
  public resNode: NodeModel;
  public eventSubscription: Subscription = new Subscription();
  public treeNodes: NodeModel[] = [];
  public indexArray = [];

  constructor(private nodeService: NodeService) { }
  ngOnInit() {
    this.eventSubscription.add(this.nodeService.lazyLoadEmit.subscribe((res: UpdateResponseModel) => {

      this.resNode = res.nodeModel;
      this.lazyLoad(this.treeNodes, 0);
    }))

    this.loadTree();

    //refresh tree if there's any update in other component
    this.eventSubscription.add(
      this.nodeService.reloadTreeEmit.subscribe(e => {
        this.loadTree();
      })
    )
  }


  /**
   * load new tree form
   */
  loadTree() {
    this.eventSubscription.add(
      this.nodeService.getNodeData().subscribe((res) => {
        this.treeNodes = res;
      })
    )
  }

  /**
   * define name for mat icon by nodeType
   * @param dataItem 
   * @returns 
   */

  public iconClass(dataItem: NodeModel): any {
    if (dataItem.nodeType == "1")
      return "insert_drive_file";
    return "folder";
  }


  /**
   * binding selected node's id to other component through service's "idEmit"
   */
  nodeClick(arg: any): void {
    this.indexArray = arg.index.toString().split("_");
    this.nodeService.idEmit.emit(arg.dataItem.id);
  }

  /**
   * access the updated treenode & update data
   * @param tree 
   * @param level 
   * @returns 
   */
  lazyLoad(tree: NodeModel[], level: number) {
    if (level == this.indexArray.length - 1) {
      tree[this.indexArray[level]].name = this.resNode.name;
      tree[this.indexArray[level]].owner = this.resNode.owner;
      tree[this.indexArray[level]].submissionDate = this.resNode.submissionDate;
      tree[this.indexArray[level]].nodeType = this.resNode.nodeType;
      return;
    }
    this.lazyLoad(tree[this.indexArray[level]].childs, level + 1)
  }

  //unsuscrible
  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }
}
