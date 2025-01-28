import { Component, Input } from '@angular/core';
import { IAiResponse } from '../../../interfaces/IAiResponse';
import { InputComponent } from '../input/input.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TextAreaComponent } from '../text-area/text-area.component';
import {
  QueryService,
  SpinnerService,
  TOAST,
  ToastService,
} from '../../shared';
import { TABLES } from '../../../constants/tables';

@Component({
  selector: 'app-table',
  imports: [InputComponent, ReactiveFormsModule, TextAreaComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  public edit = false;
  public data: IAiResponse | null = null;

  // Form Control
  public code!: FormControl;
  public plan!: FormControl;
  public date!: FormControl;
  public unit!: FormControl;
  public grade!: FormControl;
  public area!: FormControl;
  public thematicAxis!: FormControl;
  public estimatedTime!: FormControl;
  public actualTime!: FormControl;
  public achievement!: FormControl;
  public argumentative!: FormControl;
  public interpretative!: FormControl;
  public propositional!: FormControl;
  public complementaryAdjustments!: FormControl;
  public motivation!: FormControl;
  public priorKnowledgeExploration!: FormControl;
  public confrontation!: FormControl;
  public activitySchool!: FormControl;
  public activityHouse!: FormControl;
  public evaluation!: FormControl;
  public resources!: FormControl;
  public observations!: FormControl;

  public formTable!: FormGroup;
  @Input() id: string = '';

  @Input() set value(data: string) {
    this.data = JSON.parse(data || '{}');
    this.handleData(this.data as any);
  }
  constructor(
    private fb: FormBuilder,
    private readonly queryService: QueryService,
    private readonly spinnerService: SpinnerService,
    private readonly toastService: ToastService
  ) {
    this.handleData({} as any);
  }

  public setEdit() {
    this.edit = true;
  }

  public async update() {
    try {
      this.spinnerService.show();
      const data: IAiResponse = { ...this.formTable.value };
      data.resources = this.resources.value
        .split(',')
        .map((item: string) => item.trim());
      await this.queryService.update({
        table: TABLES.CHAT,
        column: 'id',
        value: this.id,
        data: {
          content: JSON.stringify(data),
        },
      });
      this.spinnerService.hide();
      this.data = data;
      this.handleData(data);
      this.edit = false;
      this.toastService.show({
        type: TOAST.SUCCESS,
        title: 'Exito',
        message: 'Contenido actualizado',
      });
    } catch (error) {
      this.toastService.show({
        type: TOAST.ERROR,
        title: 'Error',
        message: 'No se pudo actualizar el chat',
      });
      this.spinnerService.show();
    }
  }

  public cancel() {
    this.edit = false;
    this.handleData(this.data as any);
  }

  private handleData(data: IAiResponse) {
    this.code = new FormControl(data?.code || '');
    this.plan = new FormControl(data?.plan || '');
    this.date = new FormControl(data?.date || '');
    this.unit = new FormControl(data?.unit || '');
    this.grade = new FormControl(data?.grade || '');
    this.area = new FormControl(data?.area || '');
    this.thematicAxis = new FormControl(data?.thematicAxis || '');
    this.estimatedTime = new FormControl(data?.estimatedTime || '');
    this.actualTime = new FormControl(data?.actualTime || '');
    this.achievement = new FormControl(data?.achievement || '');
    this.argumentative = new FormControl(
      data?.competencies?.argumentative || ''
    );
    this.interpretative = new FormControl(
      data?.competencies?.interpretative || ''
    );
    this.propositional = new FormControl(
      data?.competencies?.propositional || ''
    );
    this.complementaryAdjustments = new FormControl(
      data?.complementaryAdjustments || ''
    );
    this.motivation = new FormControl(
      data?.pedagogicalProcess?.motivation || ''
    );
    this.priorKnowledgeExploration = new FormControl(
      data?.pedagogicalProcess?.priorKnowledgeExploration || ''
    );
    this.confrontation = new FormControl(
      data?.pedagogicalProcess?.confrontation || ''
    );
    this.activitySchool = new FormControl(data?.pedagogicalProcess?.activitySchool || '');
    this.activityHouse = new FormControl(data?.pedagogicalProcess?.activityHouse || '');
    this.evaluation = new FormControl(
      data?.pedagogicalProcess?.evaluation || ''
    );
    this.resources = new FormControl(data?.resources?.join(', ') || '');
    this.observations = new FormControl(data?.observations || '');
    this.formTable = this.fb.group({
      code: this.code,
      plan: this.plan,
      date: this.date,
      unit: this.unit,
      grade: this.grade,
      area: this.area,
      thematicAxis: this.thematicAxis,
      estimatedTime: this.estimatedTime,
      actualTime: this.actualTime,
      achievement: this.achievement,
      competencies: this.fb.group({
        argumentative: this.argumentative,
        interpretative: this.interpretative,
        propositional: this.propositional,
      }),
      complementaryAdjustments: this.complementaryAdjustments,
      pedagogicalProcess: this.fb.group({
        motivation: this.motivation,
        priorKnowledgeExploration: this.priorKnowledgeExploration,
        confrontation: this.confrontation,
        activityHouse: this.activityHouse,
        activitySchool: this.activitySchool,
        evaluation: this.evaluation,
      }),
      resources: this.resources,
      observations: this.observations,
    });
  }
}
