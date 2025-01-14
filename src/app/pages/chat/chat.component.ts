import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  OpenAiService,
  QueryService,
  TableComponent,
} from '../../shared/shared';
import { exampleLesson } from '../../interfaces/IAiResponse';
import { AuthService } from '../../shared/services/auth/auth.service';
import { TABLES } from '../../constants/tables';
import { ActivatedRoute } from '@angular/router';
import { IChat, IChatCreate } from '../../interfaces/IChat';
import { IHistory } from '../../interfaces/IHistory';
import { ISubject } from '../../interfaces/ISubject';

interface IMessage {
  sended: boolean;
  message: string;
  timestamp: number;
}

@Component({
  selector: 'app-chat',
  imports: [ReactiveFormsModule, TableComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements AfterViewChecked, OnInit {
  public isProcessing = false;
  public message!: FormControl;
  public chatForm!: FormGroup;
  public messages: IMessage[] = [];
  public chat: IChat[] = [];
  public currentName = '';
  private history_id: string = '';
  private subjects!: ISubject | undefined;
  @ViewChild('messagesContainer') private messagesContainer: any;

  constructor(
    private readonly openApiService: OpenAiService,
    private readonly authService: AuthService,
    private readonly queryService: QueryService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.initForm();
    this.activatedRoute.params.subscribe((params) => {
      this.history_id = params['id'] || '';
    });
  }

  async ngOnInit(): Promise<void> {
    this.currentName = await this.authService.getCurrentName();
    const response = await this.queryService.getInnerJoinWithWhere<IHistory>({
      table: TABLES.HISTORY,
      query:
        'id, subjects(id, name, grade, code), chat (prompt, content, history_id, id)',
      property: 'id',
      value: this.history_id,
    });
    console.log(response);
    this.subjects = response.at(0)?.subjects;
    this.chat = response.at(0)?.chat || [];
  }

  ngAfterViewChecked() {
    // Desplazar al fondo cuando se actualiza el contenedor de mensajes
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch (err) {}
  }

  public async sendMessage() {
    try {
      this.isProcessing = true;
      const message: IMessage = {
        message: this.message.value,
        sended: true,
        timestamp: Date.now(),
      };
      this.messages.push(message);
      this.chatForm.reset();
      const messageReceived = await this.openApiService.sendRequest(
        `Dame una planeación basada en el contenido de \"${message.message}\", siguiendo el formato de \"${exampleLesson}\". Usa exampleLesson como plantilla para los campos y la estructura, pero adapta la información de acuerdo con el contenido de message.message. Los campos como el grado=${this.subjects?.grade}, área=${this.subjects?.name}, codigo=${this.subjects?.code} tienen estos valores y los campos como eje temático, competencias, motivación, observaciones, recursos y actividad deben ser generados en función del tema que el mensaje indique. Si el mensaje incluye una fecha especificada, utilízala. Si no incluye una fecha, usa la fecha de hoy en el formato dd de mes de yyyy (por ejemplo, 12 de diciembre de 2024). la planilla es siempre un numero, eje tematico es el mismo tema (Todo en espanol)`
      );

      const newHistory: IChatCreate = {
        prompt: message.message,
        content: JSON.stringify(messageReceived),
        history_id: this.history_id,
      };

      await this.queryService.insert(TABLES.CHAT, newHistory);
      const chatGptMessage: IMessage = {
        message: messageReceived,
        sended: false,
        timestamp: Date.now(),
      };
      this.messages.push(chatGptMessage);
      this.isProcessing = false;
    } catch (error) {
      console.log(error);
      this.isProcessing = false;
    }
  }

  private initForm(): void {
    this.message = new FormControl('', [Validators.required]);
    this.chatForm = new FormGroup({
      message: this.message,
    });
  }
}
