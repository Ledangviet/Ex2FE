import { Component } from '@angular/core';
import { NodeService } from '../service/node.service';
import { NodeModel, UpdateResponseModel } from '../model/node/node.model';
import { Subscription, take } from 'rxjs';
import { ApplicationService } from '../service/application.service';
import { FilterExpandSettings } from '@progress/kendo-angular-treeview';
import { DialogCloseResult, DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { ToastrService } from 'ngx-toastr';
import { CommonDialogComponent } from '../common-dialog/commondialog.component';

@Component({
  selector: 'app-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss']
})
export class TreeviewComponent {

  public searchState = true;
  public appId: number;
  public parentNodeId: number[] = [];
  public expandKeys: number[] = [];
  public resNode: NodeModel;
  public eventSubscription: Subscription = new Subscription();
  public treeNodes: NodeModel[] = [];
  public parsedTreenodes: NodeModel[] = [];
  public index = [];
  public get filterExpandSettings(): FilterExpandSettings {
    return { expandedOnClear: "none", expandMatches: true };
  }

  constructor(
    private dialogRef: DialogRef,
    private nodeService: NodeService,
    private appService: ApplicationService,
    private dialogService: DialogService,
    private toastr: ToastrService
  ) { }
  ngOnInit() {
    this.loadAppTree();
    this.nodeService.lazyLoadEmit.subscribe((node: NodeModel) => {
      this.resNode = node;
      this.lazyLoad(this.treeNodes, 0);
    })
    // this.eventSubscription.add(
    //   this.nodeService.reloadTreeEmit.subscribe(e => {
    //     this.loadAppTree();
    //   }))
  }

  /**
   * switch search state
   */
  searchClick() {
    const dialog: DialogRef = this.dialogService.open({
      title: "Find Node",
      content: CommonDialogComponent,
    });
    const info = dialog.content.instance as CommonDialogComponent;
    info.info = "Node title";
    info.btn = "Search";

    info.value.subscribe((e: any) => {
      this.expandKeys = [];
      var tempNode = [];
      tempNode = this.treeNodes;
      this.parsedTreenodes = this.search(tempNode, e.text);
    })

  }

  public search(nodes: NodeModel[], term: string): NodeModel[] {
    var acc: NodeModel[] = []
    nodes.map((node: NodeModel) => {
      if (this.contains(node.name, term)) {
        this.expandKeys = this.expandKeys.concat(node.id);
        acc.push(node)
      } else if (node.childs && node.childs.length > 0) {
        var newChild = this.search(node.childs, term)
        if (newChild.length > 0) {
          node.childs = newChild
          this.expandKeys = this.expandKeys.concat(node.id);
          acc.push(node)
        }
      }
    })
    return acc;
  }

  public contains(text: string, term: string): boolean {
    return text.toLowerCase().indexOf((term || "").toLowerCase()) >= 0;
  }



  /**
   * expand all tree view
   */
  expandClick() {
    this.getParrentNodeId(this.treeNodes);
    this.expandKeys = this.parentNodeId.slice();
  }



  /**
   * colapse all treeview
   */
  colapseClick() {
    this.expandKeys = [];
  }

  getParrentNodeId(nodes: NodeModel[]) {
    nodes.map(e => {
      if (e.childs.length > 0) {
        this.parentNodeId.push(e.id);
        this.getParrentNodeId(e.childs);
      }
    })
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
   * Load tree by application id
   */
  loadAppTree() {
    this.eventSubscription.add(
      this.appService.appEmit.subscribe(e => {
        this.appId = e;
        this.nodeService.getNodeByApplicationId(e).subscribe((res: NodeModel[]) => {
          this.treeNodes = res;
          this.parsedTreenodes = this.treeNodes;
        })
      })
    )
  }

  //refresh tree after search
  refresh() {
    this.expandKeys = [];
    this.parsedTreenodes = this.treeNodes;
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
    this.index = arg.index.toString().split("_");
    this.nodeService.currentIndex = arg.index.toString().split("_");
    this.nodeService.idEmit.emit(arg.dataItem.id);
  }

  removeButton() {

    const dialog: DialogRef = this.dialogService.open({
      title: "Delete!",
      content: "Are you sure to remove all node?",
      actions: [{ text: "Yes", themeColor: "dark" }, { text: "No" }],
      width: 450,
      height: 200,
      minWidth: 250,
    });

    this.eventSubscription.add(dialog.result.subscribe((result) => {
      if (result instanceof DialogCloseResult) {
        return;
      } else {
        if (result.text == "Yes") {
          this.eventSubscription.add(
            this.nodeService.removeNodeByApplicationId(this.appId).subscribe((e: boolean) => {
              if (e) {
                this.toastr.success("Delete succeeded!");
                this.parsedTreenodes = [];
              }
            })
          )
        }
      }
    }))


  }

  /**
   * access the updated treenode & update data
   * @param tree 
   * @param level 
   * @returns 
   */
  lazyLoad(tree: NodeModel[], level: number) {
    if (level == this.index.length - 1) {
      tree[this.index[level]].name = this.resNode.name;
      tree[this.index[level]].owner = this.resNode.owner;
      tree[this.index[level]].submissionDate = this.resNode.submissionDate;
      tree[this.index[level]].nodeType = this.resNode.nodeType;
      return;
    }
    this.lazyLoad(tree[this.index[level]].childs, level + 1)
  }

  /**
   * Add child node emit
   */
  addChild() {
    this.nodeService.addNodeEmit.emit(1)
  }

  /**
   * Add root node emit
   */
  addRoot() {
    this.nodeService.addNodeEmit.emit(0)
  }


  /**
   * remove one node
   */
  removeNode() {

  }

  //unsuscrible
  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }
}
