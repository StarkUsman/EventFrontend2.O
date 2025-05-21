import { forkJoin } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, routes, ToasterService } from 'src/app/core/core.index';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-add-estimates',
  templateUrl: './add-estimates.component.html',
  styleUrls: ['./add-estimates.component.scss'],
})
export class AddEstimatesComponent implements OnInit {
  control = new FormControl();
  allMenuItemsNames: any[] = [];
  allMenuItems: any[] = [];
  filteredOptions!: Observable<string[]>;
  public routes = routes;
  days: string[] = [];
  days_cal: string[] = [];
  startDate: number = 15;
  stage: number = 1;
  halls: any[] = [];
  slotTypes: string[] = [];
  reservation: any = {
    reservation_name: '',
    contact_number: '',
    alt_contact_number: '',
    booking_type: '',
    description: '',
    date: new Date(),
    num_of_persons: 1,
    additional_services: [],
    selectedMenu: null,
    booker_type: 'Other',
    status: null
  };
  availableMenus: any[] = [];
  menuItems: any[] = [];
  availableSlots: any[] = [];
  additionalServices: any[] = [];
  additionalServicesSelected: any[] = [];
  bookings: any[] = [];
  totalAdditionalPrice: number = 0;
  events: any[] = [];
  preBookingDiscount: any = "Dicount";
  // preBookingAdvance: any = "Advance Received";
  dateSelected: any = '';
  monthSelected: any = '';
  Date: any = [];
  Days: any = [];
  monthSelectedOrg: any = '';
  monthNumber: any = [];


  constructor(private data: DataService, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.loadHalls();
    this.loadMenus();
    this.loadAdditionalServices();
    this.loadReservations();
    this.loadEvents();
    // this.initDays(this.reservation.date);
    let selectedDate = this.reservation.date;
    // ({ dates: this.Date, days: this.Days } = this.getWeekDatesSeparated(selectedDate, 0));
    ({ dates: this.Date, days: this.Days, monthNumber: this.monthNumber } = this.getWeekDatesSeparated(selectedDate, 0));
  }

  getWeekDatesSeparated(dateSelected: Date, startDay: number = 0) {
    let date = new Date(dateSelected);
    let day = date.getDay();

    let diff = (day < startDay ? 7 : 0) + day - startDay;
    date.setDate(date.getDate() - diff);

    let dates: string[] = [];
    let days: string[] = [];
    let monthNumber: string[] = [];

    for (let i = 0; i < 7; i++) {
      let formattedDate = date.toDateString().split(' ');

      dates.push(formattedDate[2]);
      days.push(`${formattedDate[0]} ${formattedDate[3]}`);
      monthNumber.push(formattedDate[1]);

      date.setDate(date.getDate() + 1);
    }

    this.dateSelected = this.reservation.date.toDateString();
    this.dateSelected = this.dateSelected.split(' ')[2];
    this.monthSelected = this.reservation.date.toDateString();
    this.monthSelected = this.monthSelected.split(' ')[1];
    this.monthSelectedOrg = structuredClone(this.monthSelected);

    return { dates, days, monthNumber };
  }

  slotSelected: any = [];
  private nextSlotIndex: number = 0;
  markSlotSelected(slotType: any, day: any, date: any, monthNumber:any, slot: any) {

    let year = day.split(" ")[1];

    let formattedDate = date + '_' + monthNumber + '_' + year;
    // this.slotSelected = { hall: slotType, date: formattedDate, slot: slot };
    if(this.nextSlotIndex === 0) {
      this.slotSelected[0] = { hall: slotType, date: formattedDate, slot: slot };
      this.nextSlotIndex++;
    } else {
      this.slotSelected[1] = { hall: slotType, date: formattedDate, slot: slot };
      this.nextSlotIndex = 0;
    }

  }

  isSlotSelected(slotType: any, day: any, date: any, monthNumber:any, slot: any) {

    const year = day.split(" ")[1];
    let formattedDate = date + '_' + monthNumber + '_' + year;

    // return this.slotSelected && this.slotSelected.hall === slotType && this.slotSelected.date === formattedDate && this.slotSelected.slot === slot;
    for (let i = 0; i < this.slotSelected.length; i++) {
      return this.slotSelected.some((s:any) =>
        s &&
        s.hall === slotType &&
        s.date === formattedDate &&
        s.slot === slot
      );
      // return this.slotSelected[i] && this.slotSelected[i].hall === slotType && this.slotSelected[i].date === formattedDate && this.slotSelected[i].slot === slot;
    }
  }

  updateCalendar() {
    // this.initDays(this.reservation.date);
    let selectedDate = this.reservation.date;
    // ({ dates: this.Date, days: this.Days } = this.getWeekDatesSeparated(selectedDate, 0));
    ({ dates: this.Date, days: this.Days, monthNumber: this.monthNumber } = this.getWeekDatesSeparated(selectedDate, 0));
  }

  isSlotBooked(slotType: any, day: any, date: any, monthNumber:any, slot: any) {

    const year = day.split(" ")[1];
    let formattedDate = date + '_' + monthNumber + '_' + year;

    let slotToCompare = { hall: slotType, date: formattedDate, slot: slot };

    if (this.bookings) {
      for (let i = 0; i < this.bookings.length; i++) {
        const booking = this.bookings[i];

        // if (slotToCompare.hall === booking.SLOT[0].hall && slotToCompare.date === booking.SLOT[0].date && slotToCompare.slot === booking.SLOT[0].slot) {
        //   return true;
        // }
        for (let j = 0; j < booking.SLOT.length; j++) {
          if (slotToCompare.hall === booking.SLOT[j].hall && slotToCompare.date === booking.SLOT[j].date && slotToCompare.slot === booking.SLOT[j].slot) {
            return true;
          }
        }
      }
    }
    return false;
  }

  isSlotDrafted(slotType: any, day: any, date: any, monthNumber:any, slot: any) {

    const year = day.split(" ")[1];
    let formattedDate = date + '_' + monthNumber + '_' + year;

    let slotToCompare = { hall: slotType, date: formattedDate, slot: slot };

    if (this.bookings) {
      for (let i = 0; i < this.bookings.length; i++) {
        const booking = this.bookings[i];

        // if (slotToCompare.hall === booking.SLOT.hall && slotToCompare.date === booking.SLOT.date && slotToCompare.slot === booking.SLOT.slot && booking.status === 'DRAFTED') {
        //   return true;
        // }
        for (let j = 0; j < booking.SLOT.length; j++) {
          if (slotToCompare.hall === booking.SLOT[j].hall && slotToCompare.date === booking.SLOT[j].date && slotToCompare.slot === booking.SLOT[j].slot && booking.status === 'DRAFTED') {
            return true;
          }
        }
      }
    }
    return false;
  }

  loadReservations() {
    // Fetch reservations from API (replace with your real endpoint)
    this.data.getReservationsUF().subscribe((data: any) => {
      this.bookings = data;
    });
  }

  loadMenus() {
    // Fetch menus from API (replace with your real endpoint)
    this.data.getMenus().subscribe((data: any) => {
      this.availableMenus = data.data;
    });
  }

  loadAdditionalServices() {
    this.data.getServicesUF().subscribe((data:any) => {
      this.additionalServices = data;
    });
  }

  loadMenuItems(menuItemIds: number[]) {
    this.menuItems = []; // Reset the menu items before loading
    // menuItemIds.forEach((id) => {
    //   this.data.getMenuItemByID(id).subscribe((item:any) => {
    //     item.selected = true;
    //     this.menuItems.push(item);
    //   });
    // });

    const requests = menuItemIds.map((id) =>
      this.data.getMenuItemByID(id)
    );

    forkJoin(requests).subscribe((items: any[]) => {
      // Add `selected = true` and preserve order
      this.menuItems = items.map(item => {
        item.selected = true;
        return item;
      });
    });

    this.data.getAllMenuItems().subscribe((data: any) => {
      this.allMenuItems = data.data;

      this.allMenuItemsNames = this.allMenuItems.filter((item: any) => {
        return !this.menuItems.some((menuItem: any) => menuItem.menu_item_id === item.menu_item_id);
      });
      this.allMenuItemsNames = this.allMenuItemsNames.map((item: any) => item.item_name);
    });

    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allMenuItemsNames.filter((option: any) => option.toLowerCase().includes(filterValue));
  }

  onMenuItemSelect(item: any) {
    const selectedItem = this.allMenuItems.find((menuItem: any) => menuItem.item_name === item);
    if (selectedItem) {
      selectedItem.selected = true;
      this.menuItems.push(selectedItem);
      this.allMenuItemsNames = this.allMenuItemsNames.filter((name: any) => name !== item);
      setTimeout(() => {
        this.control.setValue('');
      });
    }
  }

  loadHalls() {
    // Fetch halls from API (replace with your real endpoint)
    this.data.getHalls().subscribe((data:any) => {
      this.halls = data;
      this.slotTypes = this.halls.map(hall => hall.hall_name);
    });
  }

  loadEvents() {
    // Fetch events from API (replace with your real endpoint)
    this.data.getBookingEvents().subscribe((data:any) => {
      this.events = data;
    });
  }

  nextStage() {
    if (this.stage === 1 && this.isStage1Valid()) {
      this.stage++;
    } else if (this.stage === 2 && this.isStage2Valid()) {
      this.stage++;
    } else if (this.stage === 3 && this.isStage3Valid()) {
      this.stage++;
      this.reservation.selectedMenu.price = this.reservation.selectedMenu.menu_price;
      this.loadMenuItems(this.reservation.selectedMenu.menu_item_ids);
      this.reservation.selectedMenu.finalPrice = this.reservation.selectedMenu.price * this.reservation.num_of_persons;
      this.reservation.additionalPrice = 0;
      this.reservation.discount = 0
      // this.reservation.advance = 0;
    }
  }

  updateMenuPriceTotal(price: number) {
    this.reservation.selectedMenu.price = price;
    this.reservation.selectedMenu.finalPrice = price * this.reservation.num_of_persons;
  }

  goToStage(stage: number) {
    this.stage = stage;
  }

  isStageDisabled(stage: number): boolean {
    if (stage === 2) {
      return !this.isStage1Valid();
    } else if (stage === 3) {
      return !this.isStage2Valid();
    } else if (stage === 4) {
      return !this.isStage3Valid();
    }
    return false;
  }

  prevStage() {
    if (this.stage > 1) {
      this.stage--;
    }
  }

  isStage1Valid(): boolean {
    return this.slotSelected !== null;
  }

  isStage2Valid(): boolean {
    return this.reservation.reservation_name && this.reservation.contact_number && this.reservation.booking_type
  }

  isStage3Valid(): boolean {
    // Ensure that a menu is selected and the number of persons is greater than 0
    return this.reservation.selectedMenu !== null && this.reservation.num_of_persons > 0;
  }

  saveReservation() {
    this.reservation.user = JSON.parse(localStorage.getItem('user') || '{}'),
    this.reservation.date = new Date();
    this.reservation.add_service_ids = this.additionalServicesSelected.map(service => service.additional_service_id);
    this.reservation.menu_items_ids = this.menuItems.filter(item => item.selected).map(item => item.menu_item_id);
    this.reservation.total_menu_price = this.reservation.selectedMenu.finalPrice;
    this.reservation.grandTotal = this.reservation.selectedMenu.finalPrice + this.reservation.additionalPrice;
    this.reservation.total_price = this.getGrandTotal();
    this.reservation.SLOT = this.slotSelected;
    this.reservation.status = 'OPEN'
    this.reservation.total_remaining = parseFloat(this.reservation.grandTotal) - parseFloat(this.reservation.discount)

    this.data.addReservation(this.reservation).subscribe((res: any) => {
      this.router.navigate(['/reservations/reservationList']);
    });
  }

  isSlotDisabled(slot: any): boolean {
    let formattedSlotDay = new Date(slot.day).toISOString().split('T')[0];
    let date = new Date(formattedSlotDay);
    date.setDate(date.getDate() + 1);
    let newFormattedDate = date.toISOString().split('T')[0];

    for (let i = 0; i < this.bookings.length; i++) {
      const booking = this.bookings[i];

      if (newFormattedDate === booking.slot_day && slot.type === booking.slot_type && slot.slot === booking.slot_number) {
        return true;
      }
    }

    return false;
  }

  selectMenu(menu: any) {
    this.reservation.selectedMenu = menu; // Store selected menu
    // Trigger menu item load based on selected menu
    this.loadMenuItems(menu.menu_item_ids);
  }

  removeMenuItem(item: any) {
    item.selected = false;
    this.menuItems = this.menuItems.filter((menuItem: any) => menuItem.menu_item_id !== item.menu_item_id);
    this.allMenuItemsNames.push(item.item_name);
    setTimeout(() => {
      this.control.setValue('');
    });
  }

  addMenuItem(item: any) {
    item.selected = true;
  }

  updateAdditionalServices(service: any) {
    if (service.selected) {
      this.reservation.additional_services.push(service);
    } else {
      const index = this.reservation.additional_services.findIndex((s: { additional_service_id: number }) => s.additional_service_id === service.additional_service_id);
      if (index !== -1) {
        this.reservation.additional_services.splice(index, 1);
      }
    }
    this.updateSelectedServices(service);
  }

  toggleAdditionalService(service: any) {
    service.selected = !service.selected;
    this.updateAdditionalServices(service);
  }

  checkService(): boolean {
    // if any of the additional services is selected, return true
    for (let i = 0; i < this.additionalServices.length; i++) {
      if (this.additionalServices[i].selected) {
        return true;
      }
    }
    return false;
  }

  getGrandTotal(): number {
    let total = this.reservation.selectedMenu.finalPrice + this.reservation.additionalPrice;
    if (this.reservation.discount > 0) {
      total -= this.reservation.discount;
    }
    // if (this.reservation.advance > 0) {
    //   total -= this.reservation.advance;
    // }

    return total;
  }

  updateSelectedServices(service: any) {
    if (service.selected) {
      service.quantity = 1;
      service.totalPrice = service.price;
      this.additionalServicesSelected.push(service);
    } else {
      const index = this.additionalServicesSelected.indexOf(service);
      if (index !== -1) {
        this.additionalServicesSelected.splice(index, 1);
      }
    }
    this.calculateAdditionalPrice();
  }

  calculateAdditionalPrice() {
    this.totalAdditionalPrice = 0;
    for (let i = 0; i < this.additionalServicesSelected.length; i++) {
      this.totalAdditionalPrice += this.additionalServicesSelected[i].totalPrice;
    }
    this.calculateAdditionalServicePrice();
  }

  updateTotal(service: any) {
    service.totalPrice = (service.price || 0) * (service.quantity || 0);
    this.calculateAdditionalPrice();
  }

  addService() {
    this.additionalServices.push({ itemName: 'New Item', price: 0, quantity: 1, totalPrice: 0 });
  }

  removeService(index: number) {
    this.additionalServices.splice(index, 1);
  }

  calculateMenuPrice() {
    this.reservation.selectedMenu.finalPrice = this.reservation.selectedMenu.price;
  }

  calculateAdditionalServicePrice() {
    this.reservation.additionalPrice = this.totalAdditionalPrice;
  }

  saveDraft() {
    this.reservation.user = JSON.parse(localStorage.getItem('user') || '{}'),
      this.reservation.status = 'DRAFTED';
    this.reservation.SLOT = this.slotSelected;

    this.data.addReservation(this.reservation).subscribe((res: any) => {
      this.router.navigate(['/reservations/reservationList']);
    });
  }
}
