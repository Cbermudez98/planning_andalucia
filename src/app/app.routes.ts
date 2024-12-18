import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'chat',
    loadComponent: () =>
      import('./pages/chat/chat.component').then((c) => c.ChatComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
