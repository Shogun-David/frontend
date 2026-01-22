import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private messages$ = new BehaviorSubject<ToastMessage[]>([]);
  private counter = 0;

  get toasts() {
    return this.messages$.asObservable();
  }

  success(text: string) {
    this.add('success', text);
  }

  error(text: string) {
    this.add('error', text);
  }

  info(text: string) {
    this.add('info', text);
  }

  warning(text: string) {
    this.add('warning', text);
  }

  private add(type: ToastType, text: string) {
    const toast: ToastMessage = {
      id: ++this.counter,
      type,
      text
    };

    this.messages$.next([...this.messages$.value, toast]);

    setTimeout(() => this.remove(toast.id), 4000);
  }

  remove(id: number) {
    this.messages$.next(
      this.messages$.value.filter(t => t.id !== id)
    );
  }
}
