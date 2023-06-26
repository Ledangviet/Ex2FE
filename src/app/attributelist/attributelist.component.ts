import { Component, Input } from '@angular/core';
import { NodeService } from '../service/node.service';
import { NodeAttributeModel } from '../model/NodeAttributeModel';
import { State, process } from "@progress/kendo-data-query";
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {
  GridComponent,
  GridDataResult,
  CancelEvent,
  EditEvent,
  RemoveEvent,
  SaveEvent,
  AddEvent,
} from "@progress/kendo-angular-grid";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-attributelist',
  templateUrl: './attributelist.component.html',
  styleUrls: ['./attributelist.component.scss']
})
export class AttributelistComponent {
  public nodeId:string;
  public eventSubscription: Subscription[] = [];
  public attributes: NodeAttributeModel[] = [];
  public saveAttribute: NodeAttributeModel;

  public editingItem = new NodeAttributeModel(0,"",0);

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 5,
  };
  public formGroup:FormGroup;
  private editedRowIndex: number;

  constructor(private nodeService:NodeService){}

  ngOnInit(){
    this.nodeService.idEmit.subscribe((id)=> {
      this.nodeId = id;
      this.nodeService.getNodeAttributeByNodeId(this.nodeId).subscribe((res)=>{
        this.attributes = res;            
      })     
    })     
  }

  onStateChange(state: State){}


  cancelHandler(args: CancelEvent){
    this.closeEditor(args.sender, args.rowIndex);
  }


  editHandler(args: EditEvent){
    const { dataItem } = args;
    this.editingItem = dataItem;
    this.closeEditor(args.sender);

    this.formGroup = new FormGroup({    
      id: new FormControl({value:this.editingItem.id,disabled:true}),
      name: new FormControl(this.editingItem.name, Validators.required),
    });

    this.editedRowIndex = args.rowIndex;
    // put the row in edit mode, with the `FormGroup` build above

    args.sender.editRow(args.rowIndex, this.formGroup);
  }

  saveHandler({ sender, rowIndex, formGroup, isNew }: SaveEvent): void{
    const attribute: NodeAttributeModel = formGroup.value;
    this.eventSubscription.push(this.nodeService.save(this.editingItem.id,attribute.name,parseInt(this.nodeId),isNew).subscribe(res=>{
      this.nodeService.idEmit.emit(this.nodeId);    
    }))
    sender.closeRow(rowIndex);
  }

  public removeHandler(args: RemoveEvent): void {
    // remove the current dataItem from the current data source,
    this.eventSubscription.push(this.nodeService.remove(args.dataItem).subscribe(res => {
      console.log(res);
      this.nodeService.idEmit.emit(this.nodeId);
    }))
  }

  
  addHandler(args: AddEvent){
    this.closeEditor(args.sender);
    // define all editable fields validators and default values
    this.formGroup = new FormGroup({    
      id: new FormControl({value:0,disabled:true},),
      name: new FormControl("", Validators.required),
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

  ngOnDestroy(){
    this.eventSubscription.map(e => e.unsubscribe());
  }
}
