import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OpenAiService } from '../../shared/shared';
import { exampleLesson } from '../../interfaces/IAiResponse';

interface IMessage {
  sended: boolean;
  message: string;
}

@Component({
  selector: 'app-chat',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  public isProcessing = false;
  public message!: FormControl;
  public chatForm!: FormGroup;
  public messages: IMessage[] = [];

  constructor(private readonly openApiService: OpenAiService) {
    this.initForm();
  }

  public async sendMessage() {
    try {
      this.isProcessing = true;
      const message: IMessage = {
        message: this.message.value,
        sended: true,
      };
      this.messages.push(message);
      const messageReceived = await this.openApiService.sendRequest(
        `Dame una planeacion con "${message.message}" con este formato ${exampleLesson}`
      );
      const chatGptMessage: IMessage = {
        message: messageReceived,
        sended: false,
      };
      this.messages.push(chatGptMessage);
      this.chatForm.reset();
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
