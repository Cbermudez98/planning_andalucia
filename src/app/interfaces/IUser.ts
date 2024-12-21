export enum ROLE {
  ADMIN = 'admin',
  USER = 'user',
}

export type RoleType = ROLE.ADMIN | ROLE.USER;

export interface IUser {
  email: string;
  password: string;
  role: RoleType;
}

export interface IUserMetadata {
  name: string;
  last_name: string;
}

export interface IUserLogin extends Omit<IUser, 'role'> {}
