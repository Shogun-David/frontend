import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmar-modal',
  templateUrl: './confirmar-modal.component.html',
  styleUrls: ['./confirmar-modal.component.css']
})
export class ConfirmModalComponent {

  @Input() title = 'Confirmación';
  @Input() message = '¿Está seguro de realizar esta acción?';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Input() confirmButtonClass = 'btn-danger';

  constructor(public activeModal: NgbActiveModal) {}

  confirmar(): void {
    this.activeModal.close(true);
  }

  cancelar(): void {
    this.activeModal.dismiss(false);
  }
}