import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public types: Array<string> = [
    "Folder",
    "File"
 ];
  title = 'Excercise2_FE';
}
