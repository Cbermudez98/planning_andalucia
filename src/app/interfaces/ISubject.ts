export interface ISubject {
  id: string;
  name: string;
  grade: string;
  code: string;
  user_id: string;
}

export interface ISubjectCreate extends Omit<ISubject, 'id'> {}
