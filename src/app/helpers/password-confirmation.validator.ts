import {
  AbstractControl,
  UntypedFormGroup, ValidatorFn
} from '@angular/forms';

export class PasswordConfirmationValidator {
  constructor() {}

  // static onlyChar(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: boolean } | null => {
  //     if (control.value == '') return null;
  //
  //     let re = new RegExp('^[a-zA-Z ]*$');
  //     if (re.test(control.value)) {
  //       return null;
  //     } else {
  //       return { onlyChar: true };
  //     }
  //   };
  // }
  static mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: UntypedFormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
      return null;
    };
  }

  static matchPassword = (passwordControl: AbstractControl): ValidatorFn =>{

    return (ConfirmPasswordControl: AbstractControl): ({[key: string]: boolean} | null) => {
      if(ConfirmPasswordControl.value !== ""){
        try{
          let confirm_password = '' + ConfirmPasswordControl.value,
            password = ''+passwordControl.value,
            passwordsAreEquals = password === confirm_password;
          if(passwordsAreEquals){
            return null;
          }
        }catch(e){
          return {
            mustMatch: true
          };
        }
        return {
          mustMatch: true
        };
      }
      else{
        return null;
      }
    };
  };
}

export function confirmedValidator(controlName: string, matchingControlName: string) {
  return (formGroup: UntypedFormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (
      matchingControl.errors &&
      !matchingControl.errors.confirmedValidator
    ) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmedValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}


