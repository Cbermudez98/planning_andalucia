import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import('./pages/chat/chat.component').then(c => c.ChatComponent)
  }
];
