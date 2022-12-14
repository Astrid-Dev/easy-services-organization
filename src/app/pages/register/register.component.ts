import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl} from '@angular/forms';
import {TranslationService} from "../../services/translation.service";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/User";
import {PasswordConfirmationValidator} from "../../helpers/password-confirmation.validator";
import {ScreenService} from "../../services/screen.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  registerForm !: UntypedFormGroup;
  formIsSubmitted: boolean = false;
  isProcessing: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private translationService: TranslationService,
    private authService: AuthService,
    private router: Router,
    private screenService: ScreenService,
  ) {
    this.registerForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
        terms_approbation: [false, Validators.required]
      }
    );

    this.registerForm.addControl('confirm_password', new UntypedFormControl('',
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        PasswordConfirmationValidator.matchPassword(this.registerForm.controls.password)
      ])));
  }
  get errorControl(){
    return this.registerForm.controls;
  }

  get formValue(){
    return this.registerForm.value;
  }

  get hasApprovedTerms(){
    return this.formValue.terms_approbation === true;
  }

  ngOnInit() {}

  inputStatusClassName(formControlName: string){
    let result = '';
    let control = this.registerForm.controls[formControlName];
    if(control){
      result = control.errors ? 'has-error' : 'has-success';
    }
    else{
      result = ''
    }

    return 'form-group has-feedback ' + (this.formIsSubmitted ? result : '');
  }

  onFormSubmit(){
    console.log(this.formValue);
    this.formIsSubmitted = true;

    if(!this.registerForm.valid || !this.hasApprovedTerms)
    {
      this.screenService.showErrorToast(this.translationService.getValueOf("REGISTER.INVALIDFORM"));
    }
    else{
      this.isProcessing = true;
      const user:User = {
        username: this.formValue.username,
        email: this.formValue.email,
        password: this.formValue.password,
        password_confirmation: this.formValue.confirm_password,
      }
      this.authService.register(user)
        .then((res) =>{

          let registeredUser:User = {
            email: user.email,
            password: user.password
          }
          this.authService.login(registeredUser)
            .then((res: any) =>{
              this.isProcessing = false;
              this.registerForm.reset();
              this.formIsSubmitted = false;
              this.screenService.showSuccessToast((this.translationService.getValueOf("LOGIN.WELCOME") + ", " + res.user.username) + " ! "+ this.translationService.getValueOf("LOGIN.SUCCESS"));
              this.router.navigate(["home"]);
            })
            .catch((err) =>{
              this.isProcessing = false;
              console.error(err);
              this.router.navigate(["login"], {state:{userIsNewer: true}});
            });
        })
        .catch((err) =>{
          this.isProcessing = false;
          console.error(err);

          let message = this.translationService.getValueOf("REGISTER.ERROR");
          if(err.status === 400)
          {
            message = this.translationService.getValueOf("REGISTER.VALIDATORERROR") + "<ul>";
            let error = JSON.parse(err.error);
            let errorsNumber = 0;
            if(error?.email) {
              errorsNumber++;
              message += "<li>" + this.translationService.getValueOf("REGISTER.EMAIL.USED") + "</li>";
            }
            if(error?.username) {
              errorsNumber++;
              message += "<li>" + this.translationService.getValueOf("REGISTER.USERNAME.USED") + "</li>";
            }
            if(error?.phone_number) {
              errorsNumber++;
              message += "<li>" + this.translationService.getValueOf("REGISTER.PHONENUMBER.USED") + "</li>";
            }

            if(errorsNumber > 0)
            {
              message += "</ul>"+this.translationService.getValueOf("REGISTER.CORRECTION");
            }
            else{
              message = this.translationService.getValueOf("REGISTER.ERROR");
            }
          }
          this.screenService.showErrorToast(message);
        })
    }

  }


}
