import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './shared/shared';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((c) => c.LoginComponent),

    canActivate: [loginGuard],
  },
  {
    path: 'index',
    loadComponent: () =>
      import('./pages/index/index.component').then((c) => c.IndexComponent),
    children: [
      {
        path: 'welcome',
        loadComponent: () =>
          import('./pages/welcome/welcome.component').then(
            (c) => c.WelcomeComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'chat/:id',
        loadComponent: () =>
          import('./pages/chat/chat.component').then((c) => c.ChatComponent),
        canActivate: [authGuard],
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./pages/history/history.component').then(
            (c) => c.HistoryComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'configuration',
        loadComponent: () =>
          import('./pages/config/config.component').then(
            (c) => c.ConfigComponent
          ),
      },
    ],
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
