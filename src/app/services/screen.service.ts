import { Injectable } from '@angular/core';
import {ToastrService} from "ngx-toastr";
import Swal from 'sweetalert2';
import {TranslationService} from "./translation.service";

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  constructor(private toastrService: ToastrService, private translationService: TranslationService){}

  //Toast

  showSuccessToast(message: string) {
    this.toastrService.success(message, this.translationService.getValueOf('TOAST.SUCCESS'), {
      enableHtml: true
    });
  }

  showErrorToast(message: string) {
    this.toastrService.error(message, this.translationService.getValueOf('TOAST.ERROR'), {
      enableHtml: true,
    });
  }

  showWarningToast(message: string) {
    this.toastrService.warning(message, this.translationService.getValueOf('TOAST.ERROR'), {
      enableHtml: true,
    });
  }

  //Alert

  askConfirmation(message: string){
    return new Promise<boolean>((resolve, reject) =>{
      Swal.fire({
        title: 'Demande de confirmation',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, continuer',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(true);
        }
        else{
          resolve(false);
        }
      })
        .catch((err) =>{
          reject(err);
        });
    });
  }

}
