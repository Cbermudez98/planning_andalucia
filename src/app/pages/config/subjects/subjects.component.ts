import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  InputComponent,
  QueryService,
  SpinnerService,
  ToastService,
} from '../../../shared/shared';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { TABLES } from '../../../constants/tables';
import { ISubject, ISubjectCreate } from '../../../interfaces/ISubject';
import { TOAST } from '../../../shared/services/toast/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subjects',
  imports: [InputComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss',
})
export class SubjectsComponent implements OnInit {
  @Input() set subject(subject: ISubject) {
    if (!subject) return;
    this.subjectToUpdateId = subject.id;
    this.setData(subject);
  }
  public subjectToUpdateId = '';
  public name!: FormControl;
  public grade!: FormControl;
  public code!: FormControl;
  public user_id!: FormControl;
  public subjectForm!: FormGroup;
  public isUpdate = false;
  @Output() onActionPerformed = new EventEmitter<boolean>();

  constructor(
    private readonly authService: AuthService,
    private readonly queryService: QueryService,
    private readonly toastService: ToastService,
    private readonly spinnerService: SpinnerService
  ) {
    this.initForm();
  }

  async ngOnInit(): Promise<void> {
    this.spinnerService.show();
    const { data, error } = await this.authService.isLogin();
    if (error) {
      this.spinnerService.hide();
      return await this.authService.logOut();
    }
    this.user_id.setValue(data.session?.user.id);
    this.spinnerService.hide();
  }

  public resetForm() {
    this.name.setValue('');
    this.code.setValue('');
    this.grade.setValue('');
    this.subjectToUpdateId = '';

    this.isUpdate = false;
    this.onActionPerformed.emit(true);
  }

  public async saveSubject(): Promise<void> {
    try {
      this.spinnerService.show();
      if (this.isUpdate) {
        await this.queryService.update({
          table: TABLES.SUBJECT,
          column: 'id',
          value: this.subjectToUpdateId,
          data: this.subjectForm.value,
        });
        this.toastService.show({
          type: TOAST.SUCCESS,
          title: 'Exito',
          message: 'Grado actualizado con exito',
        });
        this.resetForm();
        return;
      }
      await this.queryService.insert<ISubjectCreate>(
        TABLES.SUBJECT,
        this.subjectForm.value
      );
      this.spinnerService.hide();
      this.toastService.show({
        type: TOAST.SUCCESS,
        title: 'Creado',
        message: 'Grado creado con exito',
      });
      this.resetForm();
    } catch (error) {
      this.spinnerService.hide();
      this.toastService.show({
        type: TOAST.ERROR,
        title: 'Error',
        message: 'Algo fallo',
      });
    }
  }

  public async updateSubject(): Promise<void> {
    try {
      this.spinnerService.show();
      await this.queryService.update({
        column: 'id',
        table: TABLES.SUBJECT,
        value: this.subjectToUpdateId,
        data: this.subjectForm.value,
      });
      this.spinnerService.hide();
      this.toastService.show({
        type: TOAST.SUCCESS,
        title: 'Actualizado',
        message: 'Con exito',
      });
      this.resetForm();
    } catch (error) {
      this.spinnerService.hide();
      this.toastService.show({
        type: TOAST.ERROR,
        title: 'Error',
        message: 'Algo fallo',
      });
    }
  }

  private initForm() {
    this.name = new FormControl('', [Validators.required]);
    this.grade = new FormControl('', [Validators.required]);
    this.code = new FormControl('', [Validators.required]);
    this.user_id = new FormControl('', [Validators.required]);
    this.subjectForm = new FormGroup({
      name: this.name,
      grade: this.grade,
      code: this.code,
      user_id: this.user_id,
    });
  }

  private setData(subject: ISubject) {
    this.isUpdate = true;
    this.name.setValue(subject.name);
    this.grade.setValue(subject.grade);
    this.code.setValue(subject.code);
    this.user_id.setValue(subject.user_id);
  }
}
