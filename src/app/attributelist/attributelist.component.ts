import { Component, Input, Output } from '@angular/core';
import { NodeService } from '../service/node.service';
import { NodeAttributeModel } from '../model/nodeattribute/nodeattribute.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {
  GridComponent,
  CancelEvent,
  EditEvent,
  RemoveEvent,
  SaveEvent,
  AddEvent,
} from "@progress/kendo-angular-grid";
import { Subscription } from 'rxjs';
import { DialogCloseResult, DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { ToastrService } from 'ngx-toastr';
import { ApplicationService } from '../service/application.service';

@Component({
  selector: 'app-attributelist',
  templateUrl: './attributelist.component.html',
  styleUrls: ['./attributelist.component.scss']
})
export class AttributelistComponent {

  @Input() editId: string;
  public nodeId: string;
  public eventSubscription: Subscription = new Subscription();
  public attributes: NodeAttributeModel[] = [];
  public saveAttribute: NodeAttributeModel;
  public editingItem = new NodeAttributeModel(0, "", 0);
  public formGroup: FormGroup;
  private editedRowIndex: number;

  constructor(
    private nodeService: NodeService,
    private dialogService: DialogService,
    private toastr:ToastrService,
    private appService:ApplicationService
  ) { }

  ngOnInit() {
    //reset list after other action
    this.eventSubscription.add(this.appService.appEmit.subscribe( e=> {
      this.attributes = [];
    }))

    //if there's id input then load data
    if (this.editId) {
      this.loadData(this.editId)
    }

    //subscribe id to load data
    this.eventSubscription.add(this.nodeService.idEmit.subscribe((id) => {
      this.loadData(id);
    }));
    this.eventSubscription.add(this.nodeService.gridEmit.subscribe((id) => {
      if(id != 0){
        this.loadData(id);
      }else
      this.attributes = [];
      
    }))
    
  }

  //subscrible load node service by node 
  loadData(id: string) {
    this.nodeId = id;
    this.eventSubscription.add(this.nodeService.getNodeAttributeByNodeId(this.nodeId).subscribe((res) => {
      this.attributes = res;
    }))

  }


  //cancel editor
  cancelHandler(args: CancelEvent) {
    this.closeEditor(args.sender, args.rowIndex);
  }

  /**
   * add a row to edit row item
   * @param args 
   */
  editHandler(args: EditEvent) {

    const { dataItem } = args;
    this.editingItem = dataItem;
    this.closeEditor(args.sender);

    this.formGroup = new FormGroup({
      id: new FormControl({ value: this.editingItem.id, disabled: true }),
      name: new FormControl(this.editingItem.name, Validators.required),
    });

    this.editedRowIndex = args.rowIndex;
    // put the row in edit mode, with the `FormGroup` build above
    args.sender.editRow(args.rowIndex, this.formGroup);
  }


  /**
   * get data from grid action and call save service
   * @param param0 
   */
  saveHandler({ sender, rowIndex, formGroup, isNew }: SaveEvent): void {
    const attribute: NodeAttributeModel = formGroup.value;
    this.eventSubscription.add(this.nodeService.save(this.editingItem.id, attribute.name, parseInt(this.nodeId), isNew).subscribe(res => {     
      this.loadData(this.nodeId);
    }))
    sender.closeRow(rowIndex);
  }

  //call the remove attribute service
  public removeHandler(args: RemoveEvent): void {
    //show dialog 
    const dialog: DialogRef = this.dialogService.open({
      title: "Save Data",
      content: "Are you sure to delete?",
      actions: [{ text: "Yes", themeColor: "tertiary" }, { text: "Cancel" }],
      width: 450,
      height: 200,
      minWidth: 250,
    });


    this.eventSubscription.add(dialog.result.subscribe((result) => {
      if (result instanceof DialogCloseResult) {
        return;
      } else {
        if (result.text == "Yes") {
          this.eventSubscription.add(this.nodeService.remove(args.dataItem).subscribe(res => {
            this.toastr.success("Delete succeeded!");
             this.attributes = this.attributes.filter(e => e.id !== args.dataItem.id)            
            // this.loadData(this.nodeId);
          }))
        }
        else {
          return;
        }
      }
    }))


  }


  /**
   * add a form row to add new attribute with the same nodeId
   * @param args 
   */
  addHandler(args: AddEvent) {
    this.closeEditor(args.sender);
    // define all editable fields validators and default values
    this.formGroup = new FormGroup({
      id: new FormControl({ value: 0, disabled: true },),
      name: new FormControl("", [Validators.required,
        Validators.maxLength(50)]),
    });
    // show the new row editor, with the `FormGroup` build above
    args.sender.addRow(this.formGroup);
  }

  private closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex) {
    // close the editor
    grid.closeRow(rowIndex);
    // reset the helpers
    this.editedRowIndex = 0;
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }
}
