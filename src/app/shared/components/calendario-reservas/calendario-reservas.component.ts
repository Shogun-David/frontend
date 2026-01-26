import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-calendario-reservas',
  templateUrl: './calendario-reservas.component.html'
})
export class CalendarioReservasComponent implements OnChanges {

  @Input() eventos: EventInput[] = [];
  @Output() rangoChange = new EventEmitter<{ start: Date; end: Date }>();

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    height: 'auto',

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },

    events: [],

    datesSet: (arg) => {
      this.rangoChange.emit({
        start: arg.start,
        end: arg.end
      });
    },

    eventContent: (arg) => ({
      html: `
        <div style="font-size: 0.85em">
          <strong>${arg.event.title}</strong><br/>
          <span>${arg.event.extendedProps['hora'] || ''}</span>
        </div>
      `
    })
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventos']) {
      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.eventos
      };
    }
  }
}
