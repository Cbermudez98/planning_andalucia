import { Injectable } from '@angular/core';
import OpenAI from 'openai';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OpenAiService {
  private readonly _openAi = new OpenAI({
    apiKey: environment.OPEN_AI.API_KEY,
    organization: environment.OPEN_AI.ORGANIZATION,
    project: environment.OPEN_AI.PROJECT,
    dangerouslyAllowBrowser: true,
  });

  constructor() {}

  async sendRequest(content: string) {
    try {
      console.log(environment);
      const stream = await this._openAi.chat.completions.create({
        model: environment.OPEN_AI.MODEL,
        messages: [
          {
            role: environment.OPEN_AI.ROLE,
            content,
          },
        ],
        stream: true,
      });
      let message = '';
      for await (const chunk of stream) {
        message += chunk.choices[0]?.delta?.content || '';
      }
      return message;
    } catch (error) {
      console.log('🚀  ~ OpenAiService ~ sendRequest ~ error:', error);
      throw error;
    }
  }
}
