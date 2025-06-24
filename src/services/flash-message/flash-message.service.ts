import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';

export interface FlashMessage {
  message: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class FlashMessageService {
  private flashMessageSubject = new BehaviorSubject<FlashMessage | null>(null);
  flashMessage$ = this.flashMessageSubject.asObservable();

  show(message: string, type: 'success' | 'error') {
    this.flashMessageSubject.next({ message, type });

    // Auto-dismiss after 5 seconds
    timer(5000).subscribe(() => {
      this.flashMessageSubject.next(null);
    });
  }
}