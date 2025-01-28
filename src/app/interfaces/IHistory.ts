import { IChat, IChatWithSubject } from './IChat';
import { ISubject } from './ISubject';

export interface IHistory {
  id: string;
  user_id: string;
  week: string;
  created_at: string;
}

export interface IHistoryChats {
  id: string;
  chats: IChatWithSubject[];
  week: string;
}
