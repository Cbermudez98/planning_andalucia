import { IChat } from './IChat';
import { ISubject } from './ISubject';

export interface IHistory {
  id: string;
  subjects: ISubject;
  chat: IChat[]
}
