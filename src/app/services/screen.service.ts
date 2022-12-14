import { Injectable } from '@angular/core';
import {ToastrService} from "ngx-toastr";
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

}
