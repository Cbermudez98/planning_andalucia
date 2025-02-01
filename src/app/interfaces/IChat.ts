import { ISubject } from "./ISubject";

export interface IChat {
  id: string;
  prompt: string;
  content: string;
  history_id: string;
  subject_id: string;
  created_at?: string;
}

export interface IChatCreate extends Omit<IChat, 'id'> {}

export interface IChatWithSubject extends Omit<IChat, 'subject_id'> {
  subject: ISubject;
  created_at: string;
}
