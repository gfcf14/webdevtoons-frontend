import { Component } from '@angular/core';
import { FlashMessage, FlashMessageService } from '../../services/flash-message/flash-message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flash-message',
  imports: [CommonModule],
  templateUrl: './flash-message.component.html',
  styleUrl: './flash-message.component.scss'
})
export class FlashMessageComponent {
  flashMessage: FlashMessage | null = null;

   constructor(private flashService: FlashMessageService) {
    this.flashService.flashMessage$.subscribe(msg => {
      this.flashMessage = msg;
    });
  }

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
