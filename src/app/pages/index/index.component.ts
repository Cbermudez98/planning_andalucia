import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/shared';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-index',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent implements OnInit {
  public name = '';
  constructor(private readonly authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    this.name = await this.authService.getCurrentName();
  }
}
