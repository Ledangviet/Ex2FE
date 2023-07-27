import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ColumnList } from "./customgridmodel/columnlist.model";
 import { GridComponent, RemoveEvent } from "@progress/kendo-angular-grid";

@Component({
    selector: 'customgrid',
    templateUrl: './customgrid.component.html',
    styleUrls: ['./customgrid.component.scss']
  })
  export class CustomGridComponent{
    @Input() title:string;
    @Input() columnlist: ColumnList[] = [];
    @Input() actionlist: string[];
    @Input() filterable: boolean = false;
    @Input() pageable: boolean = false;
    @Input() pagesize: number = 5;
    @Input() sortable: boolean = false;
    @Input() sourceData: any[] = [];
    @Input() selectable: boolean;


    @Output() removeEvent = new EventEmitter();
    @Output() selection = new EventEmitter();

    remove(args: RemoveEvent){
        this.removeEvent.emit(args);
    }
    
    selectionChange(args:any){
        this.selection.emit(args);
    }   
  }

