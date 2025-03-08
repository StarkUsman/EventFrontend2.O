import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { routes, ToasterService } from 'src/app/core/core.index';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-add-estimates',
  templateUrl: './add-estimates.component.html',
  styleUrls: ['./add-estimates.component.scss'],
})
export class AddEstimatesComponent implements OnInit {
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
    date: '',
    selected_slot: null,
    menus: [],  
    num_of_persons: 0,
    additional_services: [],
    selectedMenu: null, 
    selected_items: [], 
  };
  availableMenus: any[] = []; 
  menuItems: any[] = []; 
  availableSlots: any[] = []; 
  additionalServices: any[] = [];
  additionalServicesSelected: any[] = [];
  bookings: any[] = [];
  totalAdditionalPrice: number = 0;
  events: any[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.loadHalls();
    this.loadMenus();
    this.loadAdditionalServices();
    this.loadReservations();
    this.loadEvents();
  }

  cancelReservation(){
    this.router.navigate(['/reservationList']);
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
    this.http.get<any[]>(`${this.backendUrl}/menus`).subscribe(data => {
      this.availableMenus = data;
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
      this.initDays(this.reservation.date);
      this.stage++;
    } else if (this.stage === 2 && this.isStage2Valid()) {
      this.stage++;
    } else if (this.stage === 3 && this.isStage3Valid()) {
      this.stage++;
      this.reservation.selectedMenu.price = this.reservation.selectedMenu.menu_price * this.reservation.num_of_persons;
      this.loadMenuItems(this.reservation.selectedMenu.menu_item_ids);
      this.reservation.selectedMenu.finalPrice = this.reservation.selectedMenu.price;
      this.reservation.additionalPrice = 0;
      this.reservation.additionalDiscount = 0;
    }
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
    return this.reservation.reservation_name && this.reservation.contact_number && this.reservation.booking_type && this.reservation.date;
  }

  isStage2Valid(): boolean {
    return this.reservation.selected_slot !== null;
  }

  isStage3Valid(): boolean {
    // Ensure that a menu is selected and the number of persons is greater than 0
    return this.reservation.selectedMenu !== null && this.reservation.num_of_persons > 0;
  }

  saveReservation() {
    let booking_name = this.reservation.reservation_name;
    let contact_number = this.reservation.contact_number;
    let alt_contact_number = this.reservation.alt_contact_number;
    let booking_type = this.reservation.booking_type;
    let description = this.reservation.description;
    let date = this.reservation.selected_slot.day;

    const dateObj = new Date(this.reservation.selected_slot.day);
    dateObj.setDate(dateObj.getDate() + 1);
    let slot_day = dateObj.toISOString().split('T')[0];
    let slot_type = this.reservation.selected_slot.type;
    let slot_number = this.reservation.selected_slot.slot;
    let number_of_persons = this.reservation.num_of_persons;
    let add_service_ids = '';
    for (let i = 0; i < this.additionalServicesSelected.length; i++) {
      add_service_ids += this.additionalServicesSelected[i].additional_service_id + ',';
    }
    let menuId = this.reservation.selectedMenu.menu_id;

    let selected_menu_items_ids = '';
    for (let i = 0; i < this.menuItems.length; i++) {
      const item = this.menuItems[i];
      if (item.selected) {
        selected_menu_items_ids += item.menu_item_id + ',';
      }
    }

    let booking = {
      booking_name: booking_name,
      contact_number: contact_number,
      alt_contact_number: alt_contact_number,
      booking_type: booking_type,
      description: description,
      date: date,
      slot_day: slot_day,
      slot_type: slot_type,
      slot_number: slot_number,
      number_of_persons: number_of_persons,
      add_service_ids: add_service_ids,
      menu_id: menuId
      // selected_menu_items_ids: selected_menu_items_ids
    };

    try{
      this.http.post(`${this.backendUrl}/bookings`, booking).subscribe(() => {
        alert('Reservation saved!');
  
        this.router.navigate(['/reservations/reservationList']);
      });
    } catch(error){
      console.log(error);
    }
  }

  selectSlot(slot: any) {
    this.reservation.selected_slot = slot;
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

  updateMenuSelection(item: any) {
    if (item.selected) {
      this.reservation.selected_items.push(item); // Add item to selected items if checked
    } else {
      const index = this.reservation.selected_items.indexOf(item);
      if (index !== -1) {
        this.reservation.selected_items.splice(index, 1); // Remove item from selected items if unchecked
      }
    }
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
    return total;
  }

  updateSelectedServices(service: any) {
    if (service.selected) {
      this.additionalServicesSelected.push(service);
    } else {
      const index = this.additionalServicesSelected.indexOf(service);
      if (index !== -1) {
        this.additionalServicesSelected.splice(index, 1);
      }
    }
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
    this.reservation.selectedMenu.finalPrice = this.reservation.selectedMenu.price - this.reservation.selectedMenu.discount;
  }

  calculateAdditionalServicePrice(){
    this.reservation.additionalPrice = this.totalAdditionalPrice - this.reservation.additionalDiscount;
  }
}
