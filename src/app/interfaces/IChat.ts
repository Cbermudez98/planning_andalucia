export interface IChat {
  id: string;
  prompt: string;
  content: string;
  history_id: string;
}

export interface IChatCreate extends Omit<IChat, 'id'> {}
