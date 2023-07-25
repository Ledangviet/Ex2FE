import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NodeService } from '../service/node.service';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { EditComponent } from '../edit/edit.component';
import { AuthenticationService } from '../service/authen.service';
import { ApplicationListComponent } from '../applicationlist/applicationlist.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public userName = "";
  public loginContent = "Login";
  public token: string;
  constructor(
    private router: Router,
    private authenService:AuthenticationService,
    private dialogService:DialogService,
  ) { }

  ngOnInit() {
    
    this.userName = this.authenService.userName;
    if(this.userName) this.loginContent = "Logout"   
  }

  /**
   * Open application
   */
  openApplication(){
    const dialogRef: DialogRef = this.dialogService.open({
      title: "Application List",
      content: ApplicationListComponent,
    });

  }

  /**
   * navigate to login and remove all login infor form cookie
   */
  async logoutClick(){
    if(await this.authenService.loginCheck() == true){
      this.authenService.logOut();     
    }
    this.router.navigate(['/login'])
  }
}
