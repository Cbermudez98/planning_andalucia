import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OpenAiService } from './shared/shared';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  providers: [OpenAiService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'planeaciones_andalucia';
}
