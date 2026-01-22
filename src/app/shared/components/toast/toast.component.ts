import { Component } from '@angular/core';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html'
})
export class ToastComponent {

  constructor(public notification: NotificationService) {}
}
