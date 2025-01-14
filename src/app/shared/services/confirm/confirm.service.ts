import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

export interface IConfirm {
  header: string;
  message: string;
  accept: Function;
  reject: Function;
  data?: Record<string, any> | number | string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  constructor(private readonly confirmationDialog: ConfirmationService) {}

  show(dialog: IConfirm) {
    this.confirmationDialog.confirm({
      header: dialog.header,
      message: dialog.message,
      icon: '',
      accept: () => {
        dialog.accept(dialog?.data);
      },
      reject: () => {
        dialog.reject(dialog?.data);
      },
    });
  }
}
