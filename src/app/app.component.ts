import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';

import { OpenAiService, SpinnerService } from './shared/shared';
import { CommonModule } from '@angular/common';
import { AuthService } from './shared/services/auth/auth.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerModule, CommonModule, ConfirmDialogModule, ToastModule],
  providers: [OpenAiService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  title = 'planeaciones_andalucia';

  constructor(
    private readonly authService: AuthService,
    private router: Router,
    private readonly spinnerService: SpinnerService
  ) {
    this.authService.onAuthStatChange();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.spinnerService.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.spinnerService.hide();
      }
    });
  }
}
