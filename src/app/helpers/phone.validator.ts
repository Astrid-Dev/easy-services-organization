import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as libphonenumber from 'google-libphonenumber';

export class PhoneValidator {

  // Inspired on: https://github.com/yuyang041060120/ng2-validation/blob/master/src/equal-to/validator.ts
  static validCountryPhone = (countryControl: AbstractControl): ValidatorFn => {
    let subscribe: boolean = false;
    const PNF = libphonenumber.PhoneNumberFormat;

    return (phoneControl: AbstractControl): ({[key: string]: boolean} | null) => {
      if (!subscribe) {
        subscribe = true;
        countryControl.valueChanges.subscribe(() => {
          phoneControl.updateValueAndValidity();
        });
      }

      if(phoneControl.value !== ""){
        try{
          const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
          let phoneNumber = "" + phoneControl.value + "",
            region = countryControl.value,
            number = phoneUtil.parse(phoneNumber, region),
            isValidNumber = phoneUtil.isValidNumberForRegion(number, region);
          if(isValidNumber){
            phoneControl.setValue(phoneUtil.format(number, PNF.INTERNATIONAL));
            return null;
          }
        }catch(e){
          return {
            validCountryPhone: true
          };
        }
        return {
          validCountryPhone: true
        };
      }
      else{
        return null;
      }
    };
  };
}
