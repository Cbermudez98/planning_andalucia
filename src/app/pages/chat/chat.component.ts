import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DocxDownloaderService,
  OpenAiService,
  QueryService,
  TableComponent,
} from '../../shared/shared';
import { exampleLesson, IAiResponse } from '../../interfaces/IAiResponse';
import { AuthService } from '../../shared/services/auth/auth.service';
import { TABLES } from '../../constants/tables';
import { ActivatedRoute } from '@angular/router';
import { IChatWithSubject, IChatCreate } from '../../interfaces/IChat';
import { IHistory, IHistoryChats } from '../../interfaces/IHistory';
import { ISubject } from '../../interfaces/ISubject';

interface IMessage {
  sended: boolean;
  message: string;
}

@Component({
  selector: 'app-chat',
  imports: [ReactiveFormsModule, TableComponent, FormsModule],
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
    private readonly downloaderService: DocxDownloaderService
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
          'id, chats:chat(id, prompt, content, history_id, subject: subjects(id, name, grade, code, user_id))',
        property: 'id',
        value: this.history_id,
      });
    const chats = response.at(0);
    this.messages =
      chats?.chats.map((item) => ({
        sended: true,
        message: item.prompt,
      })) || [];
    this.subjects = await this.queryService.getAllByUserId<ISubject>(
      TABLES.SUBJECT,
      data.session?.user.id || ''
    );
    this.chat = response.at(0)?.chats || [];
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      const container = this.messagesContainer.nativeElement;
      container.scrollTo({
        top: container.scrollHeight,
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
      // `Dame una planeación basada en el contenido de \"${message.message}\", siguiendo el formato de \"${exampleLesson}\". Usa exampleLesson como plantilla para los campos y la estructura, pero adapta la información de acuerdo con el contenido de message.message. Los campos como el grado=${this.subjectToSend.value.grade}, área=${this.subjectToSend.value.name}, codigo=${this.subjectToSend.value.code} tienen estos valores y los campos como eje temático, competencias, motivación, observaciones, recursos y actividad deben ser generados en función del tema que el mensaje indique. Si el mensaje incluye una fecha especificada, utilízala. Si no incluye una fecha, usa la fecha de hoy en el formato dd de mes de yyyy (por ejemplo, 12 de diciembre de 2024). la planilla es siempre un numero, eje tematico es el mismo tema (Todo en espanol)`
      const messageReceived = await this.openApiService.sendRequest(
        `Genera una planeación basada en el contenido de message={\"${message.message}\"}, siguiendo el formato de exampleLesson={\"${exampleLesson}\"}. Usa exampleLesson como plantilla para los campos y estructura, pero adapta la información en función del tema indicado en message.message.
        Campos a considerar:
        Grado: ${this.subjectToSend.value.grade}
        Área: ${this.subjectToSend.value.name}
        Código: ${this.subjectToSend.value.code}
        Los campos eje temático, competencias, motivación, observaciones, recursos y actividad deben generarse de manera contextualizada según el tema proporcionado.
        Si el mensaje incluye una fecha específica, utilízala. Si no, usa la fecha actual en el formato: dd de mes de yyyy (por ejemplo, 12 de diciembre de 2024).
        Asegúrate de que:
        La planeación tenga un número único y consecutivo.
        El eje temático coincida exactamente con el tema del mensaje.
        Todos los campos estén completos y relevantes para el tema.
        Devuelve el resultado exclusivamente en español. exampleLesson es para tener un referente y message para generar todo el contenido necesario`
      );

      const newHistory: IChatCreate = {
        prompt: message.message,
        content: messageReceived,
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
    }
  }

  public async download() {
    try {
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
        chats.push(obj);
      }
      console.log(chats);
      await this.downloaderService.generate(chats);
    } catch (error) {
      console.log('🚀  ~ ChatComponent ~ download ~ error:', error);
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
}
