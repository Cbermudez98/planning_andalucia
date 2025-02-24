import { Component, OnInit } from '@angular/core';
import {
  CardComponent,
  InputComponent,
  ModalService,
  QueryService,
  SpinnerService,
  TOAST,
  ToastService,
} from '../../shared/shared';
import { TABLES } from '../../constants/tables';
import { AuthService } from '../../shared/services/auth/auth.service';
import { ISubject } from '../../interfaces/ISubject';
import { Router } from '@angular/router';
import { IHistory } from '../../interfaces/IHistory';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ICsvImport } from '../../interfaces/ICsvImport';
import { RenderCsvComponent } from '../render-csv/render-csv.component';

@Component({
  selector: 'app-history',
  imports: [CardComponent, InputComponent, ReactiveFormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent implements OnInit {
  public data: ICsvImport[] = [];
  public week = new FormControl('', [Validators.required]);
  public formWeek = new FormGroup({
    week: this.week,
  });
  public subjects: ISubject[] = [];
  public preview: ISubject | null = null;
  public history: IHistory[] = [];
  public user_id = '';
  constructor(
    private readonly queryService: QueryService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly spinnerService: SpinnerService,
    private readonly toastService: ToastService,
    private readonly modalService: ModalService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinnerService.show();
    const { data } = await this.authService.isLogin();
    this.user_id = data.session?.user.id || '';
    this.history = await this.queryService.getAllByUserId(
      TABLES.HISTORY,
      this.user_id
    );
    this.spinnerService.hide();
  }

  public async addNewHistory() {
    try {
      if (this.week?.value && Number(this.week.value) <= 0) return;
      this.spinnerService.show();
      let history = await this.queryService.getSingleById<{
        id: string;
        subject_id: string;
      }>({
        table: TABLES.HISTORY,
        property: 'week',
        value: this.week.value?.toString() || '',
      });
      console.log('History encontrado', history);
      if (!history) {
        console.log('Creando history');
        history = await this.queryService.insert<{
          week: string;
          user_id: string;
        }>(TABLES.HISTORY, {
          week: this.week.value?.toString() || '',
          user_id: this.user_id,
        });
      }
      this.spinnerService.hide();
      this.router.navigate(['index/chat', history.id]);
    } catch (error) {
      this.spinnerService.hide();
      this.toastService.show({
        type: TOAST.ERROR,
        title: 'Error',
        message: 'No se pudo crear u obtener el chat',
      });
    }
  }

  public uploadFile(event: Event) {
    if (!event) return;
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = reader.result as string;
      this.data = this.parseCsv(text);
      input.value = '';
      this.modalService.show({
        component: RenderCsvComponent,
        data: {
          data: this.data,
        },
        title: 'Pre visualizacion',
      });
    };

    reader.readAsText(file);
  }

  private parseCsv(csvText: string): ICsvImport[] {
    const lines = csvText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',');
    return lines
      .slice(1)
      .map((line) => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header.trim()] = values[index]?.trim();
          return obj;
        }, {} as any);
      })
      .map((item: any) => ({ ...item, n: item?.['N°'] }));
  }
}
