import { Component } from "@angular/core";
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { ApplicationService } from '../service/application.service';
import { Subscription, take } from "rxjs";
import { ApplicationModel } from '../model/application/application.model';
import { CommonDialogComponent } from "../common-dialog/commondialog.component";

import {
  RemoveEvent
} from "@progress/kendo-angular-grid";
import { AddApplicationModel } from "../model/application/addapplication.model";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { AddApplicationResponseModel } from "../model/application/applicationResponse.model";
import { FilterExpandSettings } from "@progress/kendo-angular-treeview";
import { ColumnList } from "../customgrid/customgridmodel/columnlist.model";

@Component({
    selector: 'app-applicationlist',
    templateUrl: './applicationlist.component.html',
    styleUrls: ['./applicationlist.component.scss']
  })
  export class ApplicationListComponent {  

    public selectedApp : number;
    public appData: ApplicationModel[] = [];
    public eventSubscription: Subscription = new Subscription();
  

    constructor(
      private dialogService:DialogService,
      private dialogRef:DialogRef,
      private appService:ApplicationService,
      private cookieService:CookieService,
      private toastr:ToastrService,
    ){}

    ngOnInit(){
      this.eventSubscription.add(this.appService.getApplication().pipe(take(1)).subscribe((res : ApplicationModel[]) =>{   
        this.appData = this.appService.formatData(res);   
      }));       
    }
    /**
     * Open Application
     */
    openClick(){
      this.appService.appEmit.emit(this.selectedApp);
      this.dialogRef.close();
    }

    /**
     * Get selected application's id
     * @param arg 
     */
    selectApp(arg:any){
      this.selectedApp = arg.selectedRows[0].dataItem.id;                              
    }

    /**
     * Close dialog
     */
    closeDialog(){
      this.dialogRef.close();
    }


    /**
     * Add new application
     */
    newClick(){ 
      const dialog: DialogRef = this.dialogService.open({
        title: "Add New Application",
        content: CommonDialogComponent,       
      });  
      const info = dialog.content.instance as CommonDialogComponent;
      info.info = "Application Name";
      info.btn = "Add";

      info.value.subscribe(e => {
              if(e){
                this.eventSubscription.add(
                  this.appService.addApplication(new AddApplicationModel(e.text,new Date,this.cookieService.get('username'))).subscribe( (res: AddApplicationResponseModel) => {
                    this.toastr.success(res.statusMessage);
                    this.appData = this.appService.formatData(res.model);
                  }))
              }
      })
    }

    /**
     * Remove application
     * @param args 
     */
    removeApp(args : RemoveEvent){ 
      this.appService.removeApplication(args.dataItem.id).subscribe( (res: boolean) => {
        if(res){
          this.toastr.success("Delete succeeded!");
          this.appData = this.appData.filter(e => e.id !== args.dataItem.id);
        }else this.toastr.warning("Delete fail!"); 
      })  
    }


    /**
     * Custom grid testing
     */

    public action = ["remove"]
    public columnData: ColumnList[] = [
      {
        field: "id",
        title: "Id",
        width: 50,
      },
      {
        field: "name",
        title: "Title",
        width: 200,
      },{
        field: "owner",
        title: "Owner",
        width: 200,
      }
    ]


    ngOnDestroy(){
      this.eventSubscription.unsubscribe();
    }
  }

  