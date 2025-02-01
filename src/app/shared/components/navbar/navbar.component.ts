import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

interface IRoute {
  name: string;
  link: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  public routes: IRoute[] = [
    {
      name: 'Home',
      link: '/index',
    },
    {
      name: 'Configuraciones',
      link: '/index/configuration',
    },
    {
      name: 'Chats',
      link: '/index/history',
    },
  ];

  constructor(private readonly authService: AuthService) {}

  public async logOut() {
    this.authService.logOut();
  }
}
