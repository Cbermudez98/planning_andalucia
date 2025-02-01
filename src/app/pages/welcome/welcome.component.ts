import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth.service';
import { OpenAiService } from '../../shared/shared';

@Component({
  selector: 'app-welcome',
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent implements OnInit {
  public name = '';
  public message = '';
  public best = '';
  constructor(
    private readonly authService: AuthService,
    private readonly openAiService: OpenAiService
  ) {}

  async ngOnInit() {
    await this.change();
  }

  private async change() {
    this.name = await this.authService.getCurrentName();

    const hora = new Date().getHours();

    if (hora >= 5 && hora < 12) {
      this.message = 'Buenos días';
    } else if (hora >= 12 && hora < 18) {
      this.message = 'Buenas tardes';
    } else {
      this.message = 'Buenas noches';
    }
    this.best = await this.openAiService.sendRequest(
      'Dame un mensaje bonito, que diga que todo ira bien y por esas acciones que hago trabajo y puedo ver a mis seres queridos y a mi bien, agregale emoticones'
    );
  }
}
