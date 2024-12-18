import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export enum TOAST {
  SHOW = 'show',
  ERROR = 'error',
  WARN = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
}

interface IToast {
  message: string;
  title: string;
  type: TOAST;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  private override = {
    positionClass: 'toast-top-right',
    timeOut: 3000,
  };

  show(payload: IToast) {
    switch (payload.type) {
      case TOAST.SUCCESS:
        this.toastr.success(payload.message, payload.title, this.override);
        break;
      case TOAST.ERROR:
        this.toastr.error(payload.message, payload.title, this.override);
        break;
      case TOAST.INFO:
        this.toastr.info(payload.message, payload.title, this.override);
        break;
      case TOAST.WARN:
        this.toastr.warning(payload.message, payload.title, this.override);
        break;
      default:
        this.toastr.show(payload.message, payload.title, this.override);
        break;
    }
  }
}
