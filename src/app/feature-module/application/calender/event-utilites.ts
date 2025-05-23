import { EventInput } from '@fullcalendar/core';

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: 'Test Event 1',
    start: TODAY_STR,
    color: '#ff9f40',
    backgroundColor: '#ff9f40',
    textColor: '#fff',
  },
  {
    id: createEventId(),
    title: 'Test Event 2',
    start: TODAY_STR + 'T00:00:00',
    end: TODAY_STR + 'T03:00:00'
  },
  {
    id: createEventId(),
    title: 'Test Event 3',
    start: TODAY_STR + 'T12:00:00',
    end: TODAY_STR + 'T15:00:00'
  },
  {
    id: createEventId(),
    title: 'All-day',
    start: '2022-12-23',
    backgroundColor:'#9368e9',
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: '2022-12-23' + 'T00:00:00',
    end: '2022-12-23' + 'T03:00:00'
  },
];

export function createEventId() {
  return String(eventGuid++);
}
