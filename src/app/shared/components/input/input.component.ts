import { TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

type InputType = 'text' | 'password' | 'tel' | 'email' | 'tel';

@Component({
  selector: 'app-input',
  imports: [TitleCasePipe],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  @Input({ required: true }) label: string = '';
  @Input() type: InputType = 'text';
  @Input() control: FormControl = new FormControl();

  public setData(event: any) {
    this.control.setValue(event.target.value);
  }
}
