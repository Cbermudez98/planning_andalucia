import { Component, OnInit } from '@angular/core';
import { SubjectsComponent } from './subjects/subjects.component';
import {
  ModalService,
  QueryService,
  RenderTableComponent,
  ITableContent,
  SpinnerService,
  ConfirmService,
  ToastService,
  TOAST,
} from '../../shared/shared';
import { TABLES } from '../../constants/tables';
import { AuthService } from '../../shared/services/auth/auth.service';
import { ISubject } from '../../interfaces/ISubject';

@Component({
  selector: 'app-config',
  imports: [SubjectsComponent, RenderTableComponent],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
  standalone: true,
})
export class ConfigComponent implements OnInit {
  public show = true;
  public subjects: ISubject[] = [];
  public subjectToUpdate!: ISubject;
  public tableTemplate: ITableContent = {
    headers: [
      {
        name: 'Asignatura',
        key: 'name',
        type: 'string',
      },
      {
        name: 'Grado',
        key: 'grade',
        type: 'string',
      },
      {
        name: 'Codigo',
        key: 'code',
        type: 'string',
      },
    ],
    control: {
      update: this.updateSubject.bind(this),
      delete: this.delete.bind(this),
    },
  };
  constructor(
    private readonly queryService: QueryService,
    private readonly authService: AuthService,
    private readonly spinnerService: SpinnerService,
    private readonly confirmService: ConfirmService,
    private readonly toastService: ToastService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.spinnerService.show();
      const { data, error } = await this.authService.isLogin();
      if (error) {
        this.spinnerService.hide();
        return await this.authService.logOut();
      }
      this.subjects = await this.queryService.getAllByUserId<ISubject>(
        TABLES.SUBJECT,
        data.session?.user.id || ''
      );
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
    }
  }

  public updateSubject(subject: ISubject) {
    this.show = false;
    setTimeout(() => {
      this.subjectToUpdate = null as any;
      this.subjectToUpdate = subject;
      this.show = true;
    }, 5);
  }

  public delete(subject: ISubject) {
    this.confirmService.show({
      header: 'Seguro',
      message: 'Esta accion es irreversible y eliminara todo el historial asociado a esta asignatura',
      accept: this.successDelete.bind(this),
      reject: this.cancel.bind(this),
      data: subject.id,
    });
  }

  private async successDelete(id: string) {
    try {
      await this.queryService.deleteById({
        table: TABLES.SUBJECT,
        id,
      });
      this.toastService.show({
        message: 'Eliminado con exito',
        title: 'Exito',
        type: TOAST.SUCCESS,
      });
      await this.ngOnInit();
    } catch (error) {
      this.toastService.show({
        message: 'Se produjo un error al eliminar',
        title: 'Error',
        type: TOAST.ERROR,
      });
    }
  }

  private cancel() {
    this.ngOnInit();
  }
}
