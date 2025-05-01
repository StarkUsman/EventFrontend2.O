import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS } from './event-utilites';
import { DataService, routes } from 'src/app/core/core.index';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalenderComponent  {
   
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: 2,
    eventsSet: this.handleEvents.bind(this)
  };
  currentEvents: EventApi[] = [];
  constructor(
    private changeDetector: ChangeDetectorRef,
    private data: DataService
  ) {
    this.data.getEvents().subscribe((res: any) => {
      const mappedEvents = res.data.map((event: any) => {
        let backgroundColor = '#3788d8'; // default blue
        let borderColor = '#3788d8';
        let textColor = '#fff';
  
        if (event.status === 'OPEN') {
          backgroundColor = '#3788d8'; // blue
          borderColor = '#3788d8';
          textColor = '#fff';
        } else if (event.status === 'DRAFTED') {
          backgroundColor = '#ffb300'; // yellow
          borderColor = '#ffb300';
          textColor = '#fff';
        } else if (event.status === 'FULLFILLED') {
          backgroundColor = '#4caf50'; // green
          borderColor = '#4caf50';
          textColor = '#fff';
        }
  
        return {
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          backgroundColor,
          borderColor,
          textColor,
        };
      });
  
      this.calendarOptions = {
        ...this.calendarOptions,
        events: mappedEvents,
      };
      this.changeDetector.detectChanges();
      console.log('Events:', this.calendarOptions.events);
    });
  }
  
  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }
 
}

