import { Component } from '@angular/core';
import { routes } from 'src/app/core/core.index';

@Component({
  selector: 'app-tickets-list-open',
  templateUrl: './tickets-list-open.component.html',
  styleUrls: ['./tickets-list-open.component.scss'],
})
export class TicketsListOpenComponent {
  public routes = routes;
  sort = 'sort1';
  isCollapsed = false;
  public Toggledata = false;
  country = 'sort';
  priority = 'priority1';
  status = 'status1';
  myDateValue!: Date;
  Action = 'status';
  public minDate!: Date;
  public maxDate!: Date;

  isCollapsed1 = false;
  isCollapsed2 = false;

  users = [
    { name: 'Barbara Moore', checked: false },
    { name: 'Hendry Evan', checked: false },
    { name: 'Richard Miles', checked: false },
  ];
  users2 = [
    { name: 'Stationary', checked: false },
    { name: 'Medical', checked: false },
    { name: 'Designing', checked: false },
  ];

  toggleCollapse1() {
    this.isCollapsed1 = !this.isCollapsed1;
  }
  toggleCollapse2() {
    this.isCollapsed2 = !this.isCollapsed2;
  }
  public toggleData = false;
  openContent() {
    this.toggleData = !this.toggleData;
  }
}
