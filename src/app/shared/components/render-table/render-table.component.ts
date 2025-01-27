import { TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

type TableTypeValue = 'string' | 'number';
export interface IHeaderTable {
  name: string;
  key: string;
  type: TableTypeValue;
}

export interface ITableContent {
  headers: IHeaderTable[];
  control?: {
    add?: Function;
    delete?: Function;
    update?: Function;
  };
}

@Component({
  selector: 'app-render-table',
  imports: [TitleCasePipe],
  templateUrl: './render-table.component.html',
  styleUrl: './render-table.component.scss',
})
export class RenderTableComponent {
  @Input({ required: true }) content: ITableContent = {
    headers: [],
  };
  @Input() set data(data: Array<Record<string, any>>) {
    this.dataToRender = data;
  }

  public dataToRender: Array<Record<string, any>> = [];

  private getHeaders(content: IHeaderTable) {

  }
}
