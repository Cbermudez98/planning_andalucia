import { AfterViewChecked, Component, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OpenAiService, TableComponent } from '../../shared/shared';
import { exampleLesson } from '../../interfaces/IAiResponse';

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
export class ChatComponent implements AfterViewChecked {
  public isProcessing = false;
  public message!: FormControl;
  public chatForm!: FormGroup;
  public messages: IMessage[] = [];
  @ViewChild('messagesContainer') private messagesContainer: any;

  constructor(private readonly openApiService: OpenAiService) {
    this.initForm();
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
        `Dame una planeación basada en el contenido de \"${message.message}\", siguiendo el formato de \"${exampleLesson}\". Usa exampleLesson como plantilla para los campos y la estructura, pero adapta la información de acuerdo con el contenido de message.message. Los campos como el grado, área, eje temático, competencias, motivación, observaciones, recursos y actividad deben ser generados en función del tema que el mensaje indique. Si el mensaje incluye una fecha especificada, utilízala. Si no incluye una fecha, usa la fecha de hoy en el formato dd de mes de yyyy (por ejemplo, 12 de diciembre de 2024). la planilla es siempre un numero, eje tematico es el mismo tema (Todo en espanol)`
      );
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
