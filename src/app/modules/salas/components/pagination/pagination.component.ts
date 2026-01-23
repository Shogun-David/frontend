import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination-sala',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationSalaComponent {

  @Input() totalPages = 0;
  @Input() currentPage = 0;

  @Output() pageChange = new EventEmitter<number>();

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) {
      return;
    }

    this.pageChange.emit(page);
  }
}
