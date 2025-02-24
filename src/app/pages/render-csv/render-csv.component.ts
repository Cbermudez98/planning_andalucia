import { Component, Input, OnInit } from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ICsvImport } from '../../interfaces/ICsvImport';
import {
  OpenAiService,
  QueryService,
  SpinnerService,
  TableComponent,
  TOAST,
  ToastService,
} from '../../shared/shared';
import { TABLES } from '../../constants/tables';
import { ISubject } from '../../interfaces/ISubject';
import { IAiResponse } from '../../interfaces/IAiResponse';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/services/auth/auth.service';
import { IChatCreate } from '../../interfaces/IChat';
import { Router } from '@angular/router';

@Component({
  selector: 'app-render-csv',
  imports: [TableComponent, ReactiveFormsModule],
  templateUrl: './render-csv.component.html',
  styleUrl: './render-csv.component.scss',
})
export class RenderCsvComponent implements OnInit {
  public data: ICsvImport[] = [];
  public response: string[] = [];
  public user_id = '';

  public form: FormGroup = new FormGroup({
    week: new FormControl('', [Validators.required]),
  });

  private subjects: ISubject[] = [];

  constructor(
    private readonly config: DynamicDialogConfig,
    private readonly openAiService: OpenAiService,
    private readonly queryService: QueryService,
    private readonly loadingService: SpinnerService,
    private readonly toastService: ToastService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly ref: DynamicDialogRef,
    private readonly dialogService: DialogService
  ) {}

  async ngOnInit() {
    try {
      const isValidJsonArray = (jsonStrings: string[]) => {
        return jsonStrings.every((jsonString) => {
          try {
            JSON.parse(jsonString);
            return true;
          } catch (error) {
            return false;
          }
        });
      };
      this.loadingService.show();
      const { data } = await this.authService.isLogin();
      this.user_id = data.session?.user.id || '';
      const values = this.config.inputValues as any;
      this.data = values.data;
      const prompts: string[] = await this.getPrompts(this.data);
      let responseAi = await this.getOpenAiResponse(prompts);
      // let error = true;
      // while (error) {
      //   const response = isValidJsonArray(this.response);
      //   if (!response) {
      //     responseAi = await this.getOpenAiResponse(prompts);
      //   } else {
      //     error = false;
      //   }
      // }
      this.response = responseAi;
      this.loadingService.hide();
    } catch (error) {
      this.loadingService.hide();
    }
  }

  public update(data: any) {
    this.response[Number(data.id)] = JSON.stringify(data.data);
  }

  public async save() {
    let idToDelete = '';
    try {
      this.loadingService.show();
      const history = await this.queryService.getSingleById({
        table: TABLES.HISTORY,
        property: 'week',
        value: this.form.value.week,
      });

      if (history) {
        this.loadingService.hide();
        return this.toastService.show({
          title: 'Error',
          message: 'Semana ya existe',
          type: TOAST.ERROR,
        });
      }

      let { id } = await this.queryService.insert<{
        week: string;
        user_id: string;
      }>(TABLES.HISTORY, {
        week: String(this.form.value.week),
        user_id: this.user_id,
      });
      idToDelete = id;
      console.log('Init operation');
      console.time('operation');
      await Promise.all(
        this.data.map((item, index) => {
          const newHistory: IChatCreate = {
            prompt: item.Tema,
            content: this.response[index],
            history_id: id,
            subject_id: this.subjects[index]?.id || '0',
          };

          return this.queryService.insert(TABLES.CHAT, newHistory);
        })
      );
      console.timeEnd('operation');
      console.log('End operation');
      this.router.navigate(['index/chat', id]);
      this.form.reset();
      this.dialogService.getInstance(this.ref).close();
    } catch (error) {
      await this.queryService.deleteById({
        table: TABLES.HISTORY,
        id: idToDelete,
      });
      console.log(error);
      this.loadingService.hide();
      this.toastService.show({
        message: 'Error al guardar',
        title: 'Error',
        type: TOAST.ERROR,
      });
    }
  }

  private async getPrompts(data: ICsvImport[]): Promise<string[]> {
    const responses = await Promise.allSettled(
      data.map((item) =>
        this.queryService.getDataEqualAndLike<ISubject>({
          table: TABLES.SUBJECT,
          grade: item.Grado,
          like: item.Materia,
        })
      )
    );
    this.subjects = responses.map((item: any) => item.value);
    return responses.map(
      (item: any, index: number) =>
        this.openAiService.getPrompt({
          area: item.value?.name || item.Materia,
          code: item.value?.code || '',
          grade: item.value?.grade,
          message: `Tema: ${item.Tema} Actividad: ${
            item?.Actividad ||
            'Generame una actividada acorde al los datos suministrados'
          }`,
        }) + ` fecha={${data[index].Fecha}} en formato JSON`
    );
  }

  private async getOpenAiResponse(prompts: string[]): Promise<string[]> {
    const rsp = await Promise.allSettled(
      prompts.map((prompt) => this.openAiService.sendRequest(prompt))
    );
    return rsp.map((item: any) => item.value);
  }
}
