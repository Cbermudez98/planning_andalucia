import { Component, Input } from '@angular/core';
import { IAiResponse } from '../../../interfaces/IAiResponse';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  public data!: IAiResponse;
  @Input() set value(data: string) {
    this.data = JSON.parse(data);
    console.log(this.data);
    this.handleData();
  }
  constructor() {}

  private handleData() {
    // console.log(Object.keys(this.data));
  }
}
