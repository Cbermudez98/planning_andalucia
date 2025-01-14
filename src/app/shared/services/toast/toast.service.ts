import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

export enum TOAST {
  SHOW = 'secondary',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  SUCCESS = 'success',
  CONTRACT = 'contrast'
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
  constructor(private toastr: MessageService) {}

  show(payload: IToast) {
    this.toastr.add({
      severity: payload.type,
      summary: payload.title,
      detail: payload.message,
    });
  }
}
