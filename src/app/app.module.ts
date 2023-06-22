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




@NgModule({
  declarations: [
    AppComponent,
    TreeviewComponent,
    NodeinfoComponent,
    AttributelistComponent,
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
    DropDownsModule, GridModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
