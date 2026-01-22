import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendario-reservas',
  templateUrl: './calendario-reservas.component.html',
  styleUrls: ['./calendario-reservas.component.css']
})
export class CalendarioReservasComponent implements OnChanges {

  @Input() eventos: EventInput[] = [];

  calendarOptions!: CalendarOptions;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventos']) {
      this.configurarCalendario();
    }
  }

  private configurarCalendario(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: this.eventos,
      height: 'auto'
    };
  }
}
