import { Component, OnInit } from '@angular/core';
import {
  CardComponent,
  InputComponent,
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

@Component({
  selector: 'app-history',
  imports: [CardComponent, InputComponent, ReactiveFormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent implements OnInit {
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
    private readonly toastService: ToastService
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
      if (!history) {
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
}
