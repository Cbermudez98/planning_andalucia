import { Component, OnInit } from '@angular/core';
import {
  CardComponent,
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

@Component({
  selector: 'app-history',
  imports: [CardComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent implements OnInit {
  public subjects: ISubject[] = [];
  public preview: ISubject | null = null;
  public history: IHistory[] = [];
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
    this.subjects = await this.queryService.getAllByUserId<ISubject>(
      TABLES.SUBJECT,
      data.session?.user.id || ''
    );
    this.history = await this.queryService.getInnerJoin<IHistory>({
      table: TABLES.HISTORY,
      query: `id, subjects: subject_id (name, grade, code, user_id, id)`,
    });
    this.spinnerService.hide();
  }

  public async addNewHistory() {
    try {
      if (!this.preview?.id) throw new Error();
      this.spinnerService.show();
      let history = await this.queryService.getSingleById<{
        id: string;
        subject_id: string;
      }>({
        table: TABLES.HISTORY,
        property: 'subject_id',
        value: this.preview.id,
      });
      if (!history) {
        history = await this.queryService.insert<{ subject_id: string }>(
          TABLES.HISTORY,
          {
            subject_id: this.preview.id,
          }
        );
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

  public updateSelection(event: any) {
    this.preview =
      this.subjects.find((item) => item.id === event.target.value) || null;
  }
}
