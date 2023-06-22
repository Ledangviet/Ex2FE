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
  @Input() nodeId:string;
  public eventSubscription: Subscription[];
  public attributes: NodeAttributeModel[];
  public saveAttribute: NodeAttributeModel;
  public title = "aaa"

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 5,
  };
  public formGroup:FormGroup;
  private editedRowIndex: number;

  constructor(private nodeService:NodeService){}

  ngOnInit(){
    if(this.nodeId){
      this.eventSubscription.push(this.nodeService.getNodeAttributeByNodeId(this.nodeId).subscribe((res) =>{
        this.attributes = res;
      }))
  }    
    this.formGroup = new FormGroup({});
  }

  ngOnDestroy(){
    this.eventSubscription.map(e => e.unsubscribe())
  }

  onStateChange(state: State){}
  editHandler(args: EditEvent){}
  cancelHandler(args: CancelEvent){}
  saveHandler({ sender, rowIndex, formGroup, isNew }: SaveEvent): void{}
  removeHandler(args: RemoveEvent):void{}

  
  addHandler(args: AddEvent){
    this.closeEditor(args.sender);
    // define all editable fields validators and default values
    this.formGroup = new FormGroup({    
      id: new FormControl({value:"",disabled:true},),
      name: new FormControl(this.title , Validators.required),
      nodeId: new FormControl({value: this.nodeId, disabled:true },Validators.required,),
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

}
