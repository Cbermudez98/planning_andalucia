import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

interface IModalDialog {
  title: string;
  data: Record<string, any> | Record<string, any>[];
  component: any;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private ref: DynamicDialogRef | undefined;
  constructor(public dialogService: DialogService) {}

  show(data: IModalDialog) {
    this.ref = this.dialogService.open(data.component, {
      header: data.title,
      width: '80vw',
      height: '100vw',
      modal: true,
      inputValues: data.data,
      closable: true,
      style: {
        'background-color': 'white',
        color: 'black',
      },
    });
  }
}
