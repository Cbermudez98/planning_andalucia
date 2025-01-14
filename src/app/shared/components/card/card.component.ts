import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() name: string = '';
  @Input() code: string = '';
  @Input() grade: string = '';
  @Input() id: string = '';

  constructor(private readonly router: Router) {}

  public goToChat() {
    this.router.navigate(['index/chat', this.id]);
  }
}
