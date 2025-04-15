import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, routes, ToasterService } from 'src/app/core/core.index';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-add-estimates',
  templateUrl: './add-estimates.component.html',
  styleUrls: ['./add-estimates.component.scss'],
})
export class AddEstimatesComponent implements OnInit {
  public routes = routes;
  backendUrl: string = 'http://localhost:3000';
  days: string[] = [];
  days_cal: string[] = [];
  month: string[] = [];
  year: string = "";
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


  constructor(private data: DataService, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.loadHalls();
    this.loadMenus();
    this.loadAdditionalServices();
    this.loadReservations();
    this.loadEvents();
    this.initDays(this.reservation.date);
    let selectedDate = this.reservation.date;
    ({ dates: this.Date, days: this.Days } = this.getWeekDatesSeparated(selectedDate, 0));
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

    this.dateSelected = this.reservation.date.toDateString();
    this.dateSelected = this.dateSelected.split(' ')[2];
    this.monthSelected = this.reservation.date.toDateString();
    this.monthSelected = this.monthSelected.split(' ')[1];

    return { dates, days };
  }

  slotSelected: any = null;

  markSlotSelected(slotType: any, day: any, date: any, slot: any) {
    const year = day.split(" ")[1];
    let formattedDate = date + '_' + this.monthSelected + '_' + year;
    this.slotSelected = {hall: slotType, date: formattedDate, slot: slot};
  }

  isSlotSelected(slotType: any, day: any, date: any, slot: any) {

    const year = day.split(" ")[1];
    let formattedDate = date + '_' + this.monthSelected + '_' + year;

    return this.slotSelected && this.slotSelected.hall === slotType && this.slotSelected.date === formattedDate && this.slotSelected.slot === slot;
  }

  updateCalendar() {
    this.initDays(this.reservation.date);
    let selectedDate = this.reservation.date;
    ({ dates: this.Date, days: this.Days } = this.getWeekDatesSeparated(selectedDate, 0));
  }

  isSlotBooked(slotType: any, day: any, date: any, slot: any) {

    const year = day.split(" ")[1];
    let formattedDate = date + '_' + this.monthSelected + '_' + year;

    let slotToCompare = {hall: slotType, date: formattedDate, slot: slot};

    if(this.bookings){
      for (let i = 0; i < this.bookings.length; i++) {
        const booking = this.bookings[i];

        if(slotToCompare.hall === booking.SLOT.hall && slotToCompare.date === booking.SLOT.date && slotToCompare.slot === booking.SLOT.slot){
          return true;
        }
      }
    }
    return false;
  }

  isSlotDrafted(slotType: any, day: any, date: any, slot: any) {

    const year = day.split(" ")[1];
    let formattedDate = date + '_' + this.monthSelected + '_' + year;

    let slotToCompare = {hall: slotType, date: formattedDate, slot: slot};

    if(this.bookings){
      for (let i = 0; i < this.bookings.length; i++) {
        const booking = this.bookings[i];

        if(slotToCompare.hall === booking.SLOT.hall && slotToCompare.date === booking.SLOT.date && slotToCompare.slot === booking.SLOT.slot && booking.status === 'DRAFTED'){
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
    
    console.log(this.days_cal);
    console.log(this.month);
  }

  loadReservations() {
    // Fetch reservations from API (replace with your real endpoint)
    this.http.get<any[]>(`${this.backendUrl}/bookings`).subscribe(data => {
      this.bookings = data;
    });
  }

  loadMenus() {
    // Fetch menus from API (replace with your real endpoint)
    this.http.get<any[]>(`${this.backendUrl}/menus`).subscribe((data: any) => {
      this.availableMenus = data.data;
    });
  }

  loadAdditionalServices() {
    this.http.get<any[]>(`${this.backendUrl}/additional-services`).subscribe(data => {
      this.additionalServices = data;
    });
  }

  loadMenuItems(menuItemIds: number[]) {
    this.menuItems = []; // Reset the menu items before loading
    menuItemIds.forEach((id) => {
      this.http.get<any>(`${this.backendUrl}/menu-items/${id}`).subscribe(item => {
        item.selected = true;
        this.menuItems.push(item);
      });
    });
  }

  loadHalls() {
    // Fetch halls from API (replace with your real endpoint)
    this.http.get<any[]>(`${this.backendUrl}/halls`).subscribe(data => {
      this.halls = data;
      // console.log('Halls:', this.halls);
      this.slotTypes = this.halls.map(hall => hall.hall_name);
      console.log('Slot Types:', this.slotTypes);
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
    this.reservation.date = new Date(); 
    this.reservation.add_service_ids = this.additionalServicesSelected.map(service => service.additional_service_id);
    this.reservation.menu_items_ids = this.menuItems.filter(item => item.selected).map(item => item.menu_item_id);
    this.reservation.total_menu_price = this.reservation.selectedMenu.finalPrice;
    this.reservation.grandTotal = this.reservation.selectedMenu.finalPrice + this.reservation.additionalPrice;
    this.reservation.total_price = this.getGrandTotal();
    this.reservation.SLOT = this.slotSelected;
    this.reservation.status = 'PENDING'
    this.reservation.total_remaining = parseFloat(this.reservation.grandTotal) - parseFloat(this.reservation.discount)
    
    this.data.addReservation(this.reservation).subscribe((res: any) => {
      console.log('Reservation saved:', res);
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
  }

  addMenuItem(item: any) {
    item.selected = true;
  }

  updateAdditionalServices(service: any) {
    console.log('Service:', service);
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

  calculateMenuPrice(){
    this.reservation.selectedMenu.finalPrice = this.reservation.selectedMenu.price;
  }

  calculateAdditionalServicePrice(){
    this.reservation.additionalPrice = this.totalAdditionalPrice;
  }

  saveDraft(){
    this.reservation.status = 'DRAFTED';
    this.reservation.SLOT = this.slotSelected;
    console.log("=========================================");
    console.log(this.reservation);
    console.log("=========================================");
    try{
      this.http.post(`${this.backendUrl}/bookings`, this.reservation).subscribe(() => {
        alert('Reservation saved!');
  
        this.router.navigate(['/reservations/reservationList']);
      });
    } catch(error){
      console.log(error);
    }
  }
}
