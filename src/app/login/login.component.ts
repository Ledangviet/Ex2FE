import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../service/authen.service';
import { Subscription } from 'rxjs';
import { SignInModel, SignInResponseModel, SignUpModel, SignUpResponseModel } from '../model/authen.model';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public loginData = new SignInResponseModel();
  public loginStatus = true;
  public eventSubscription = new Subscription;
  public model: SignInModel;
  public registerModel: SignUpModel;
  constructor(
    private authenService: AuthenticationService,
    private cookieService: CookieService,
    private router: Router,
    private toastr: ToastrService
  ) {
  }
  public form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required])
  })
  public numberPattern = /^0[0-9]+$/;
  public registerform = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]),
    username: new FormControl("", [Validators.required]),
    phonenumber: new FormControl("", [Validators.required, Validators.pattern(this.numberPattern)]),
  })


  ngOnInit(){   
  }

  /**
   * Login and set login info to cookie if success
   */
  loginClick() {
    if (this.loginStatus == true) {
      if (this.form.value.email && this.form.value.password) {
        this.model = new SignInModel(this.form.value.email, this.form.value.password);
        this.eventSubscription.add(this.authenService.login(this.model).subscribe((res: SignInResponseModel) => {
          this.loginData = res;
          if (this.loginData.succeeded == false) {
            this.toastr.success(this.loginData.status);
            return;
          }
         
          this.toastr.success(this.loginData.status);

          //set data to cookie
          this.cookieService.set('accesstoken', this.loginData.token.accessToken.toString());
          this.cookieService.set('refreshtoken', this.loginData.token.refreshToken.toString());
          this.cookieService.set('username', this.loginData.token.userName.toString());
          console.log(this.loginData.token.accessToken);
          this.router.navigate(['/home']);
          //this.router.navigate(['/home']);
        }));
      }
    } else {
      if (
        this.registerform.value.username
        && this.registerform.value.email
        && this.registerform.value.phonenumber
        && this.registerform.value.password
      ) {
        this.registerModel = new SignUpModel(
          this.registerform.value.username,
          this.registerform.value.email,
          this.registerform.value.phonenumber,
          this.registerform.value.password
        )
      }
      
      //call register api if loginState is false
      this.eventSubscription.add(this.authenService.register(this.registerModel).subscribe((res: SignUpResponseModel) => {
        this.toastr.success(res.status);
        this.router.navigate(['/login']);
      }))
    }
  }

  //switch state bettwen login/register
  createClick() {
    this.loginStatus = !this.loginStatus;
  }

  ngOnDestroy(){
    this.eventSubscription.unsubscribe();
  }

}
