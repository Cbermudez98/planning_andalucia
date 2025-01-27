import { TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-text-area',
  imports: [TitleCasePipe],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.scss',
})
export class TextAreaComponent {
  @Input({ required: true }) label: string = '';
  @Input() control: FormControl = new FormControl();
  public error = '';
  public isPasswordVisible: boolean = false;

  private errorMessages: { [key: string]: string } = {
    required: '{{label}} es obligatorio.',
    email: 'Por favor, ingrese una dirección de correo electrónico válida.',
    minlength: '{{label}} debe tener al menos {{requiredLength}} caracteres.',
    maxlength: '{{label}} no puede exceder los {{requiredLength}} caracteres.',
    pattern: '{{label}} tiene un formato inválido.',
    nullValidator: '{{label}} es inválido.',
    max: '{{label}} debe ser menor o igual a {{max}}.',
    min: '{{label}} debe ser mayor o igual a {{min}}.',
    requiredTrue: '{{label}} debe ser marcado.',
  };

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  public setData(event: any) {
    this.error = '';
    if (this.control.errors) {
      this.setMessageError(Object.keys(this.control?.errors)?.[0] || '');
    }
    this.control.setValue(event.target.value);
  }

  private setMessageError(errorKey: string): void {
    const error: ValidationErrors = this.control?.errors?.[errorKey];
    let message = this.errorMessages[errorKey];
    if (message) {
      message = message.replace('{{label}}', this.label);
      if (error['requiredLength']) {
        message = message.replace(
          '{{requiredLength}}',
          error['requiredLength']
        );
      }
      if (error['actualLength']) {
        message = message.replace('{{actualLength}}', error['actualLength']);
      }
      if (error['max']) {
        message = message.replace('{{max}}', error['max']);
      }
      if (error['min']) {
        message = message.replace('{{min}}', error['min']);
      }
    }

    this.error = message || '';
  }
}
