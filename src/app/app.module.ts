import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TreeviewComponent } from './treeview/treeview.component';
import { NodeinfoComponent } from './nodeinfo/nodeinfo.component';
import { AttributelistComponent } from './attributelist/attributelist.component';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';

import { MaterialModule } from './module/material.module';
import { DialogModule, DialogRef } from '@progress/kendo-angular-dialog';
import { HomeComponent } from './home/home.component';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { LoginComponent } from './login/login.component';
import { CookieService } from 'ngx-cookie-service';
import { NodeService } from './service/node.service';
import { AuthenticationService } from './service/authen.service';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { EditComponent } from './edit/edit.component';
import { ToastrModule } from 'ngx-toastr';
import { DetailInfoComponent } from './detail-info/detail-info.component';
import { ApplicationListComponent } from './applicationlist/applicationlist.component';
import { CommonDialogComponent } from './common-dialog/commondialog.component';
import { CustomGridComponent } from './customgrid/customgrid.component';



@NgModule({
  declarations: [
    AppComponent,
    TreeviewComponent,
    NodeinfoComponent,
    AttributelistComponent,
    HomeComponent,
    LoginComponent,
    EditComponent,
    DetailInfoComponent,
    ApplicationListComponent,
    CommonDialogComponent,
    CustomGridComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TreeViewModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    InputsModule,
    LabelModule,
    DropDownsModule,
    GridModule,
    MaterialModule,
    DialogModule,
    NavigationModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: (service) => localStorage.getItem('access_token')
      }
    }),
    ToastrModule.forRoot(),
  ],

  providers: [DialogRef, CookieService, NodeService, AuthenticationService, JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
