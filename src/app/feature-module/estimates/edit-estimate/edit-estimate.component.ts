import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService, routes, ToasterService } from 'src/app/core/core.index';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-estimate',
  templateUrl: './edit-estimate.component.html',
  styleUrls: ['./edit-estimate.component.scss'],
})
export class EditEstimateComponent implements OnInit {
  lstEstimates!: string[];
  public editEstimateForm!: FormGroup;
  public routes = routes;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToasterService,
    private http: HttpClient,
    private router: Router,
    private data: DataService
  ) { }

  backendUrl: string = 'http://localhost:3000';
  days: string[] = [];
  days_cal: string[] = [];
  month: string[] = [];
  year: string = "";
  startDate: number = 15;
  stage: number = 1;
  halls: any[] = [];
  slotTypes: string[] = [];
  reservationToEdit: any = {};
  availableMenus: any[] = [];
  menuItems: any[] = [];
  availableSlots: any[] = [];
  additionalServices: any[] = [];
  additionalServicesSelected: any[] = [];
  bookings: any[] = [];
  totalAdditionalPrice: number = 0;
  events: any[] = [];
  preBookingDiscount: any = "Dicount";
  dateSelected: any = '';
  monthSelected: any = '';
  Date: any = [];
  Days: any = [];
  slotSelected: any = null;

  async ngOnInit() {
    this.loadHalls();
    this.loadAdditionalServices();
    this.loadReservations();
    this.loadEvents();

    this.route.queryParams.subscribe(params => {
      let id = params['id'];
      this.data.getReservationById(id).subscribe((res: any) => {
        this.reservationToEdit = res;
        this.slotSelected = this.reservationToEdit.SLOT;
        const dateString = this.reservationToEdit.dashboardDate;
        const dateObj = new Date(dateString.replace(" ", "T"));
        this.reservationToEdit.date = dateObj;
        this.initDays(this.reservationToEdit.date);
        let selectedDate = this.reservationToEdit.date;
        ({ dates: this.Date, days: this.Days } = this.getWeekDatesSeparated(selectedDate, 0));

        if (typeof this.reservationToEdit.selectedMenu === "string") {
          this.reservationToEdit.selectedMenu = JSON.parse(this.reservationToEdit.selectedMenu);
        }

        this.data.getMenus().subscribe((res: any) => {
          this.availableMenus = res.data;
        })
      });
    });

  }

  getWeekDatesSeparated(dateSelected: Date, startDay: number = 0) {
    let date = new Date(dateSelected);
    let day = date.getDay();

    let diff = (day < startDay ? 7 : 0) + day - startDay;
    date.setDate(date.getDate() - diff);

    let dates: string[] = [];
    let days: string[] = [];

    for (let i = 0; i < 7; i++) {
      let formattedDate = date.toDateString().split(' ');

      dates.push(formattedDate[2]);
      days.push(`${formattedDate[0]} ${formattedDate[3]}`);

      date.setDate(date.getDate() + 1);
    }

    this.dateSelected = this.reservationToEdit.date.toDateString();
    this.dateSelected = this.dateSelected.split(' ')[2];
    this.monthSelected = this.reservationToEdit.date.toDateString();
    this.monthSelected = this.monthSelected.split(' ')[1];

    return { dates, days };
  }

  markSlotSelected(slotType: any, day: any, date: any, slot: any) {
    const year = day.split(" ")[1];
    let formattedDate = date + '_' + this.monthSelected + '_' + year;
    this.slotSelected = { hall: slotType, date: formattedDate, slot: slot };
  }

  isSlotSelected(slotType: any, day: any, date: any, slot: any) {

    const year = day.split(" ")[1];
    let formattedDate = date + '_' + this.monthSelected + '_' + year;

    return this.slotSelected && this.slotSelected.hall === slotType && this.slotSelected.date === formattedDate && this.slotSelected.slot === slot;
  }

  updateCalendar() {
    this.initDays(this.reservationToEdit.date);
    let selectedDate = this.reservationToEdit.date;
    ({ dates: this.Date, days: this.Days } = this.getWeekDatesSeparated(selectedDate, 0));
  }

  isSlotBooked(slotType: any, day: any, date: any, slot: any) {

    const year = day.split(" ")[1];
    let formattedDate = date + '_' + this.monthSelected + '_' + year;

    let slotToCompare = { hall: slotType, date: formattedDate, slot: slot };

    if (this.bookings) {
      for (let i = 0; i < this.bookings.length; i++) {
        const booking = this.bookings[i];

        if (slotToCompare.hall === booking.SLOT.hall && slotToCompare.date === booking.SLOT.date && slotToCompare.slot === booking.SLOT.slot) {
          return true;
        }
      }
    }
    return false;
  }

  isSlotDrafted(slotType: any, day: any, date: any, slot: any) {

    const year = day.split(" ")[1];
    let formattedDate = date + '_' + this.monthSelected + '_' + year;

    let slotToCompare = { hall: slotType, date: formattedDate, slot: slot };

    if (this.bookings) {
      for (let i = 0; i < this.bookings.length; i++) {
        const booking = this.bookings[i];

        if (slotToCompare.hall === booking.SLOT.hall && slotToCompare.date === booking.SLOT.date && slotToCompare.slot === booking.SLOT.slot && booking.status === 'DRAFTED') {
          return true;
        }
      }
    }
    return false;
  }

  initDays(date: any) {
    if (!date) {
      console.error("Invalid date passed to initDays:", date);
      return;
    }

    // Convert string to Date if necessary
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    if (isNaN(date.getTime())) {
      console.error("Invalid date format:", date);
      return;
    }

    this.days = [];
    let tempDate = new Date(date.getTime() - 3 * 24 * 60 * 60 * 1000);

    for (let i = 0; i < 7; i++) {
      const day = new Date(tempDate.getTime());
      day.setDate(tempDate.getDate() + i);
      this.days.push(day.toDateString());
    }

    this.days_cal = this.days.map(date => date.split(' ')[2]);
    this.month = this.days.map(date => date.split(' ')[1]);
    this.year = this.days.map(date => date.split(' ')[3])[0];
  }

  loadReservations() {
    this.data.getReservations().subscribe((res) => {
      this.bookings = res.data;
    })
  }

  loadAdditionalServices() {
    this.http.get<any[]>(`${this.backendUrl}/additional-services`).subscribe(data => {
      this.additionalServices = data;
    });
  }

  loadMenuItems(menuItemIds: number[]) {
    this.menuItems = [];
    menuItemIds.forEach((id) => {
      this.http.get<any>(`${this.backendUrl}/menu-items/${id}`).subscribe(item => {
        item.selected = true;
        this.menuItems.push(item);
      });
    });
  }

  loadHalls() {
    this.http.get<any[]>(`${this.backendUrl}/halls`).subscribe(data => {
      this.halls = data;
      this.slotTypes = this.halls.map(hall => hall.hall_name);
    });
  }

  loadEvents() {
    // Fetch events from API (replace with your real endpoint)
    this.http.get<any[]>(`${this.backendUrl}/events`).subscribe(data => {
      this.events = data;
    });
  }

  nextStage() {
    if (this.stage === 1 && this.isStage1Valid()) {
      this.stage++;
    } else if (this.stage === 2 && this.isStage2Valid()) {
      this.stage++;
    } else if (this.stage === 3 && this.isStage3Valid()) {
      this.loadMenuItems(this.reservationToEdit.selectedMenu.menu_item_ids);
      this.reservationToEdit.selectedMenu.finalPrice = this.reservationToEdit.selectedMenu.menu_price * this.reservationToEdit.number_of_persons;
      this.reservationToEdit.additionalPrice = 0;
      this.reservationToEdit.additionalDiscount = 0;
      this.stage++;
    }
  }

  updateMenuPriceTotal(price: number) {
    this.reservationToEdit.selectedMenu.menu_price = price;
    this.reservationToEdit.selectedMenu.finalPrice = price * this.reservationToEdit.number_of_persons;
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
    return this.reservationToEdit.reservation_name && this.reservationToEdit.contact_number && this.reservationToEdit.booking_type;
  }

  isStage3Valid(): boolean {
    return this.reservationToEdit.menu_id !== null && this.reservationToEdit.number_of_persons > 0;
  }

  saveReservation() {
    if (this.reservationToEdit.status === "DRAFTED"){
      this.reservationToEdit.status = "PENDING";
    }
    this.reservationToEdit.date = new Date(); 
    this.reservationToEdit.add_service_ids = this.additionalServicesSelected.map(service => service.additional_service_id);
    this.reservationToEdit.menu_items_ids = this.menuItems.filter(item => item.selected).map(item => item.menu_item_id);
    this.reservationToEdit.total_menu_price = this.reservationToEdit.selectedMenu.finalPrice;
    this.reservationToEdit.grandTotal = this.reservationToEdit.selectedMenu.finalPrice + this.reservationToEdit.additionalPrice;
    this.reservationToEdit.total_price = this.getGrandTotal();
    this.reservationToEdit.SLOT = this.slotSelected;
    this.reservationToEdit.total_remaining = parseFloat(this.reservationToEdit.grandTotal) - parseFloat(this.reservationToEdit.discount);
    
    this.data.updateReservation(this.reservationToEdit).subscribe((res: any) => {
      this.router.navigate([routes.reservationList]);
    });
  }

  selectSlot(slot: any) {
    this.reservationToEdit.selected_slot = slot;
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
    this.reservationToEdit.menu_id = menu.menu_id;
    this.reservationToEdit.selectedMenu = menu;
    this.loadMenuItems(menu.menu_item_ids);
  }

  updateMenuSelection(item: any) {
    if (item.selected) {
      this.reservationToEdit.selected_items.push(item); // Add item to selected items if checked
    } else {
      const index = this.reservationToEdit.selected_items.indexOf(item);
      if (index !== -1) {
        this.reservationToEdit.selected_items.splice(index, 1); // Remove item from selected items if unchecked
      }
    }
  }

  removeMenuItem(item: any) {
    item.selected = false;
  }

  addMenuItem(item: any) {
    item.selected = true;
  }

  toggleAdditionalService(service: any) {
    service.selected = !service.selected;
    this.updateSelectedServices(service);
  }

  checkService(): boolean {
    for (let i = 0; i < this.additionalServices.length; i++) {
      if (this.additionalServices[i].selected) {
        return true;
      }
    }
    return false;
  }

  getGrandTotal(): number {
    let total = this.reservationToEdit.selectedMenu.finalPrice + this.reservationToEdit.additionalPrice;
    if (this.reservationToEdit.discount > 0) {
      total -= this.reservationToEdit.discount;
    }

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
    this.reservationToEdit.selectedMenu.finalPrice = this.reservationToEdit.selectedMenu.menu_price;
  }

  calculateAdditionalServicePrice() {
    this.reservationToEdit.additionalPrice = this.totalAdditionalPrice;
  }
}
