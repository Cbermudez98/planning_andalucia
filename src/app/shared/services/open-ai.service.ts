import { Injectable } from '@angular/core';
import OpenAI from 'openai';
import { environment } from '../../../environments/environment.development';
import { exampleLesson } from '../../interfaces/IAiResponse';

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

  public getPrompt(data: {
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
