import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {TranslationService} from "../../services/translation.service";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/User";
import {ScreenService} from "../../services/screen.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm !: UntypedFormGroup;
  formIsSubmitted: boolean = false;
  isProcessing: boolean = false;
  passwordFieldType: string = "password";

  userIsNewer: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private translationService: TranslationService,
    private router: Router,
    private authService: AuthService,
    private screenService: ScreenService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    });
  }

  get errorControl(){
    return this.loginForm.controls;
  }

  get formValue() {
    return this.loginForm.value;
  }

  ngOnInit() {}

  inputStatusClassName(formControlName: string){
    let result = '';
    let control = this.loginForm.controls[formControlName];
    if(control){
      result = control.errors ? 'has-error' : 'has-success';
    }
    else{
      result = ''
    }

    return 'form-group has-feedback ' + (this.formIsSubmitted ? result : '');
  }

  onFormSubmit(){
    this.formIsSubmitted = true;

    if(!this.loginForm.valid)
    {
      this.screenService.showErrorToast(this.translationService.getValueOf("LOGIN.INVALIDFORM"));
    }
    else{
      this.isProcessing = true;
      let user:User = {
        email: this.formValue.email,
        password: this.formValue.password
      }
      this.authService.login(user)
        .then((res: any) =>{
          this.isProcessing = false;
          this.loginForm.reset();
          this.formIsSubmitted = false;
          this.screenService.showSuccessToast((this.translationService.getValueOf(this.userIsNewer ? "LOGIN.WELCOME" : "LOGIN.SEEAGAIN") + ", " + res.user.username) + " ! "+ this.translationService.getValueOf("LOGIN.SUCCESS"));
          this.router.navigate(["home"]);
        })
        .catch((err) =>{
          this.isProcessing = false;
          console.error(err);

          let message = this.translationService.getValueOf("LOGIN.ERROR");
          if(err.status === 401) {
            message = this.translationService.getValueOf("LOGIN.VALIDATORERROR");
          }
          this.screenService.showErrorToast(message);
        })

    }

  }

  changePasswordType()
  {
    if(this.passwordFieldType === "password")
    {
      this.passwordFieldType = "text";
    }
    else{
      this.passwordFieldType = "password";
    }
  }

}
