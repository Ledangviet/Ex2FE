import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DialogRef } from "@progress/kendo-angular-dialog";


@Component({
    selector: 'app-commondialog',
    templateUrl: './commondialog.component.html',
    styleUrls: ['./commondialog.component.scss']
})

export class CommonDialogComponent {
    @Input() btn:string;
    @Input() info:string;

    @Output() value = new EventEmitter()


    public form = new FormGroup({
        text : new FormControl("",[Validators.required])
    });

    constructor(
        private dialogRef:DialogRef,
    ){}

    buttonClick(){
        this.value.emit(this.form.value);
        this.dialogRef.close();
    }
    
}