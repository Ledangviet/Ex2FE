import { Component, Input } from '@angular/core';
import { NodeService } from '../service/node.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {
  @Input() nodeId: string;
  constructor(private nodeService: NodeService) {
  }

  closeDialog(){
    console.log('close');  
    this.nodeService.closeDialogEmit.emit()
  }

  ngOnDestroy() {
  }
}
