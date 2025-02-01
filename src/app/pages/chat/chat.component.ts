import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ConfirmService,
  DocxDownloaderService,
  OpenAiService,
  QueryService,
  SkeletonChatComponent,
  SpinnerService,
  TableComponent,
  TOAST,
  ToastService,
} from '../../shared/shared';
import { exampleLesson, IAiResponse } from '../../interfaces/IAiResponse';
import { AuthService } from '../../shared/services/auth/auth.service';
import { TABLES } from '../../constants/tables';
import { ActivatedRoute } from '@angular/router';
import { IChatWithSubject, IChatCreate, IChat } from '../../interfaces/IChat';
import { IHistory, IHistoryChats } from '../../interfaces/IHistory';
import { ISubject } from '../../interfaces/ISubject';
import { DatePipe } from '@angular/common';

interface IMessage {
  sended: boolean;
  message: string;
  created_at?: string;
}

@Component({
  selector: 'app-chat',
  imports: [
    ReactiveFormsModule,
    TableComponent,
    FormsModule,
    DatePipe,
    SkeletonChatComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  public isProcessing = false;
  public message!: FormControl;
  public subjectToSend!: FormControl;
  public chatForm!: FormGroup;
  public messages: IMessage[] = [];
  public chat: IChatWithSubject[] = [];
  public currentName = '';
  private week: string = '';
  private history_id: string = '';
  public subjects: ISubject[] = [];
  public subject: ISubject | null = null;

  @ViewChild('messagesContainer') private messagesContainer: any;
  @ViewChild('messagesContainerChat') private messagesContainerChat: any;

  constructor(
    private readonly openApiService: OpenAiService,
    private readonly authService: AuthService,
    private readonly queryService: QueryService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly downloaderService: DocxDownloaderService,
    private readonly toastService: ToastService,
    private readonly spinnerService: SpinnerService,
    private readonly confirmService: ConfirmService
  ) {
    this.initForm();
    this.activatedRoute.params.subscribe((params) => {
      this.history_id = params['id'] || '';
    });
  }

  async ngOnInit(): Promise<void> {
    this.currentName = await this.authService.getCurrentName();
    const { data } = await this.authService.isLogin();
    const response =
      await this.queryService.getInnerJoinWithWhere<IHistoryChats>({
        table: TABLES.HISTORY,
        query:
          'id, chats:chat(id, prompt, content, history_id, subject: subjects(id, name, grade, code, user_id), created_at), week',
        property: 'id',
        value: this.history_id,
      });
    this.week = response.at(0)?.week || '';
    const chats = response.at(0);
    const messages = (
      chats?.chats.map((item) => ({
        sended: true,
        message: item.prompt,
        created_at: item.created_at,
        id: item.id,
      })) || []
    ).sort(
      (a, b) =>
        new Date(a.created_at).valueOf() - new Date(b.created_at).valueOf()
    );
    this.messages = messages;
    this.subjects = await this.queryService.getAllByUserId<ISubject>(
      TABLES.SUBJECT,
      data.session?.user.id || ''
    );
    const sortedData = (response.at(0)?.chats || []).sort(
      (a, b) =>
        new Date(a.created_at).valueOf() - new Date(b.created_at).valueOf()
    );
    this.chat = sortedData;

    this.scrollToBottom();
  }

  public scrollToBottom() {
    setTimeout(() => {
      const container = this.messagesContainer.nativeElement;
      let top = container.scrollHeight;
      if (this.isProcessing) top = top - 1200;
      container.scrollTo({
        top,
        behavior: 'smooth',
      });

      const containerChat = this.messagesContainerChat.nativeElement;
      containerChat.scrollTo({
        top: containerChat.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  }

  public async sendMessage() {
    try {
      this.isProcessing = true;
      const message: IMessage = {
        message: this.message.value,
        sended: true,
      };
      this.messages.push(message);
      this.scrollToBottom();
      const messageReceived = await this.openApiService.sendRequest(
        this.getPrompt({
          message: message.message,
          grade: this.subjectToSend.value.grade,
          area: this.subjectToSend.value.name,
          code: this.subjectToSend.value.code,
        })
      );

      const data: IAiResponse = JSON.parse(messageReceived);
      data.code = this.subjectToSend.value.code;
      const id =
        this.chat.filter(
          (subject) => subject.subject.code === this.subjectToSend.value.code
        ).length + 1;
      data.plan = id + '';
      data.observations = '';
      data.unit = '1';
      data.resources = [
        'Tablero',
        'Cuaderno',
        'Lapices de colores',
        'Marcadores',
      ].concat(data.resources);

      const newHistory: IChatCreate = {
        prompt: message.message,
        content: JSON.stringify(data),
        history_id: this.history_id,
        subject_id: this.subjectToSend.value.id,
      };

      const resp = await this.queryService.insert(TABLES.CHAT, newHistory);
      const chatGptMessage: IMessage = {
        message: messageReceived,
        sended: false,
      };
      this.messages.push(chatGptMessage);
      this.chatForm.reset();
      await this.ngOnInit();
      this.isProcessing = false;
      this.scrollToBottom();
    } catch (error) {
      this.isProcessing = false;
      this.toastService.show({
        type: TOAST.ERROR,
        message: 'Error al generar la respuesta de chat gpt',
        title: 'ChatGpt',
      });
    }
  }

  public async download() {
    try {
      this.spinnerService.show();
      const chats: any[] = [];
      for (let chat of this.chat) {
        const data = JSON.parse(chat.content);
        const keys = Object.keys(data);
        let obj: any = {};
        for (let key of keys) {
          switch (true) {
            case typeof data[key] === 'string':
              obj[key] = data[key];
              break;

            case Array.isArray(data[key]):
              obj[key] = data[key];
              break;
            default:
              obj = { ...obj, ...data[key] };
              break;
          }
        }
        obj.resources = obj.resources.join(', ');
        obj.teacher = this.currentName;
        chats.push(obj);
      }
      await this.downloaderService.generate(chats, `Semana ${this.week}`);
      this.spinnerService.hide();
    } catch (error) {
      this.toastService.show({
        type: TOAST.ERROR,
        message: 'Error al generar documento word',
        title: 'Internal error',
      });
      this.spinnerService.hide();
    }
  }

  public deleteChat(id: string) {
    this.confirmService.show({
      message: 'Seguro desea eliminar este chat?',
      header: 'Advertencia',
      accept: this.confirmDelete.bind(this),
      reject: () => {},
      data: id,
    });
  }

  public updateChat(id: string) {
    this.confirmService.show({
      message: 'Seguro desea actualizar este chat?',
      header: 'Advertencia',
      accept: this.confirmUpdate.bind(this),
      reject: () => {},
      data: id,
    });
  }

  private async confirmDelete(id: string) {
    await this.queryService.deleteById({
      table: TABLES.CHAT,
      id,
    });
    this.toastService.show({
      type: TOAST.SUCCESS,
      title: 'Exito',
      message: 'Eliminado satisfactoriamente',
    });
    this.chat = this.chat.filter((item) => item.id !== id);
  }

  private async confirmUpdate(id: string) {
    try {
      this.spinnerService.show();
      const c: IAiResponse = JSON.parse(
        this.chat.find((item) => item.id === id)?.content || '{}'
      );
      const chat = await this.queryService.getSingleById<IChat>({
        table: TABLES.CHAT,
        property: 'id',
        value: id,
      });
      const subject = await this.queryService.getSingleById<ISubject>({
        table: TABLES.SUBJECT,
        property: 'id',
        value: chat.subject_id,
      });
      const response = await this.openApiService.sendRequest(
        this.getPrompt({
          code: subject.code,
          area: subject.name,
          grade: subject.grade,
          message: chat.prompt,
        })
      );
      const data: IAiResponse = JSON.parse(response);
      data.code = subject.code;
      data.observations = '';
      data.unit = '1';
      data.resources = [
        'Tablero',
        'Cuaderno',
        'Lapices de colores',
        'Marcadores',
      ].concat(data.resources);

      const newHistory: IChatCreate = {
        prompt: chat.prompt,
        content: JSON.stringify(data),
        history_id: this.history_id,
        subject_id: subject.id,
      };
      await this.queryService.update({
        table: TABLES.CHAT,
        column: 'id',
        data: newHistory,
        value: id,
      });
      const chatWithSubject: IChatWithSubject = {
        content: newHistory.content,
        created_at: chat.created_at || Date.now().toString(),
        history_id: chat.history_id,
        id: chat.id,
        prompt: chat.prompt,
        subject,
      };
      this.chat = this.chat.map((item) =>
        item.id !== id ? item : chatWithSubject
      );
      const sortedData = [...this.chat].sort(
        (a, b) =>
          new Date(a.created_at).valueOf() - new Date(b.created_at).valueOf()
      );
      this.chat = sortedData;
      this.toastService.show({
        type: TOAST.SUCCESS,
        title: 'Exito',
        message: 'Actualizado satisfactoriamente',
      });
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.toastService.show({
        type: TOAST.ERROR,
        title: 'Error',
        message: 'Se ha producido un error al actualizar',
      });
    }
  }

  private initForm(): void {
    this.message = new FormControl('', [Validators.required]);
    this.subjectToSend = new FormControl(null, [Validators.required]);
    this.chatForm = new FormGroup({
      message: this.message,
      subjectToSend: this.subjectToSend,
    });
  }

  private getPrompt(data: {
    message: string;
    grade: string;
    area: string;
    code: string;
  }): string {
    return `Genera una planeación basada en el contenido de message={\"${data.message}\"}, siguiendo el formato de exampleLesson={\"${exampleLesson}\"}. Usa exampleLesson como plantilla para los campos y estructura, pero adapta la información en función del tema indicado en message.message.
        Campos a considerar:
        Grado: ${data.grade}
        Área: ${data.area}
        Código: ${data.code}
        Los campos eje temático, competencias, motivación, observaciones, recursos y actividad deben generarse de manera contextualizada según el tema proporcionado.
        Si el mensaje incluye una fecha específica, utilízala. Si no, usa la fecha actual en el formato: dd de mes de yyyy (por ejemplo, 12 de diciembre de 2024).
        Asegúrate de que:
        La planeación tenga un número único y consecutivo.
        El eje temático coincida exactamente con el tema del mensaje.
        Todos los campos estén completos y relevantes para el tema.
        Devuelve el resultado exclusivamente en español. exampleLesson es para tener un referente y message para generar todo el contenido necesario.

        Ademas ajusta la intensidad de la respuesta dependiendo el Grado: ${data.grade}:
        Pre+jardín- 3 años
        jardín- 4 años
        Transición -5/6años
        1- 6/7 años
        2- 7 años
        3-8-9 años
        4-9/10años
        5-10/11 años`;
  }
}
