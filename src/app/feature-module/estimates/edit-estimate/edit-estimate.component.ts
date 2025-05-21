import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService, routes, ToasterService } from 'src/app/core/core.index';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-edit-estimate',
  templateUrl: './edit-estimate.component.html',
  styleUrls: ['./edit-estimate.component.scss'],
})
export class EditEstimateComponent implements OnInit {
  control = new FormControl();
  allMenuItemsNames: any[] = [];
  allMenuItems: any[] = [];
  filteredOptions!: Observable<string[]>;
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
  isSoundSelected: boolean = false;
  isStageDecoreSelected: boolean = false;
  bookings: any[] = [];
  totalAdditionalPrice: number = 0;
  events: any[] = [];
  preBookingDiscount: any = "Dicount";
  dateSelected: any = '';
  monthSelected: any = '';
  Date: any = [];
  Days: any = [];
  slotSelected: any = [];
  private nextSlotIndex: number = 0;
  monthNumber: any = [];


  async ngOnInit() {
    this.loadHalls();
    this.loadReservations();
    this.loadEvents();

    this.route.queryParams.subscribe(params => {
      let id = params['id'];
      this.data.getReservationById(id).subscribe((res: any) => {
        this.reservationToEdit = res;
        this.loadAdditionalServices();
        this.loadMenuItems(this.reservationToEdit.menu_items_ids);
        this.slotSelected = this.reservationToEdit.SLOT;
        const dateString = this.reservationToEdit.dashboardDate;
        const dateObj = new Date(dateString.replace(" ", "T"));
        this.reservationToEdit.date = dateObj;
        let selectedDate = this.reservationToEdit.date;
        ({ dates: this.Date, days: this.Days, monthNumber: this.monthNumber } = this.getWeekDatesSeparated(selectedDate, 0));
        
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
    let monthNumber: string[] = [];

    for (let i = 0; i < 7; i++) {
      let formattedDate = date.toDateString().split(' ');

      dates.push(formattedDate[2]);
      days.push(`${formattedDate[0]} ${formattedDate[3]}`);
      monthNumber.push(formattedDate[1]);

      date.setDate(date.getDate() + 1);
    }

    this.dateSelected = this.reservationToEdit.date.toDateString();
    this.dateSelected = this.dateSelected.split(' ')[2];
    this.monthSelected = this.reservationToEdit.date.toDateString();
    this.monthSelected = this.monthSelected.split(' ')[1];

    return { dates, days, monthNumber };
  }

  markSlotSelected(slotType: any, day: any, date: any, monthNumber:any, slot: any) {
    const year = day.split(" ")[1];
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
    }
  }

  updateCalendar() {
    let selectedDate = this.reservationToEdit.date;
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

        // if (slotToCompare.hall === booking.SLOT.hall && slotToCompare.date === booking.SLOT.date && slotToCompare.slot === booking.SLOT.slot) {
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
    this.data.getReservations().subscribe((res) => {
      this.bookings = res.data;
    })
  }

  loadAdditionalServices() {
    this.data.getServicesUF().subscribe((data:any) => {
      this.additionalServices = data;
      // if additional_service_id from reservationToEdit.additional_services array matches with any of additional_service_id of this.additionalServices array, then push that service to this.additionalServicesSelected array and set the selected property to true in that service object.
      this.reservationToEdit.additional_services.forEach((service: any) => {
        this.additionalServices.forEach((additionalService: any) => {
          if (service.additional_service_id === additionalService.additional_service_id) {
            additionalService.selected = true;
            additionalService.quantity = service.quantity;
            additionalService.price = service.price;
            additionalService.totalPrice = service.price * service.quantity;
            this.additionalServicesSelected.push(additionalService);

            this.calculateAdditionalPrice();

            if(additionalService.additional_service_name === "Audio System"){
              this.isSoundSelected = true;
            }
            if(additionalService.additional_service_name === "Stage Decor"){
              this.isStageDecoreSelected = true;
            }
          }
        });
      })
  });
  }

  loadMenuItems(menuItemIds: any) {
    this.menuItems = [];
    let selectedIDs = JSON.parse(menuItemIds);
    selectedIDs.forEach((id: any) => {
      this.data.getMenuItemByID(id).subscribe((item:any) => {
        item.selected = true;
        this.menuItems.push(item);
      });
    });

    this.data.getAllMenuItems().subscribe((data: any) => {
      this.allMenuItems = data.data;
      this.allMenuItemsNames = this.allMenuItems.filter((item: any) => {
        return !this.menuItems.some((menuItem: any) => menuItem.menu_item_id === item.menu_item_id);
      });
      this.allMenuItemsNames = this.allMenuItemsNames.map((item: any) => item.item_name);
      
      this.filteredOptions = this.control.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
    });
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
      });    }
  }

  loadHalls() {
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
      this.reservationToEdit.selectedMenu.menu_price = this.reservationToEdit.selectedMenu.price ? this.reservationToEdit.selectedMenu.price : this.reservationToEdit.selectedMenu.menu_price;
      this.reservationToEdit.selectedMenu.finalPrice = this.reservationToEdit.selectedMenu.menu_price * this.reservationToEdit.number_of_persons;
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

  deleteServiceLedgers(){
    if(this.isSoundSelected){
      this.data.getVendorByName("SOUND").subscribe((res: any) =>{
        let vendorId = res.vendor_id;
        let name = "RES:" + this.reservationToEdit.reservation_name;
        let purch_id = this.reservationToEdit.booking_id;
        this.data.getSpecificLedger(vendorId,name,purch_id).subscribe((res: any) => {
          this.data.deleteLedgerById(res.id).subscribe((res: any) =>{});
        });
      });
    }

    if(this.isStageDecoreSelected){
      this.data.getVendorByName("STAGE DECORE").subscribe((res: any) =>{
        let vendorId = res.vendor_id;
        let name = "RES:" + this.reservationToEdit.reservation_name;
        let purch_id = this.reservationToEdit.booking_id;
        this.data.getSpecificLedger(vendorId,name,purch_id).subscribe((res: any) => {
          this.data.deleteLedgerById(res.id).subscribe((res: any) =>{});
        });
      });
    }

    this.addServiceLedger();
  }

  addServiceLedger(){
    this.additionalServicesSelected.forEach((service:any) => {
      if (service.additional_service_name === "Audio System"){
        this.data.getVendorByName("SOUND").subscribe((res: any) =>{
          let ledger = {
            name: "RES:"+this.reservationToEdit.reservation_name,
            purch_id: this.reservationToEdit.booking_id,
            vendor_id: res.vendor_id,
            amountDebit: service.totalPrice,
            amountCredit: 0,
          };
          this.data.addLedger(ledger).subscribe((res) => { });
        });
      }      
      if (service.additional_service_name === "Stage Decor"){
        this.data.getVendorByName("STAGE DECORE").subscribe((res: any) =>{
          let ledger = {
            name: "RES:"+this.reservationToEdit.reservation_name,
            purch_id: this.reservationToEdit.booking_id,
            vendor_id: res.vendor_id,
            amountDebit: service.totalPrice,
            amountCredit: 0,
          };
          this.data.addLedger(ledger).subscribe((res) => { });
        });
      }      
    });
  }
  
  saveReservation() {
    this.deleteServiceLedgers();
    if (this.reservationToEdit.status === "DRAFTED"){
      this.reservationToEdit.status = "OPEN";
    }
    this.reservationToEdit.date = new Date(); 
    this.reservationToEdit.add_service_ids = this.additionalServicesSelected.map(service => service.additional_service_id);
    this.reservationToEdit.menu_items_ids = this.menuItems.filter(item => item.selected).map(item => item.menu_item_id);
    this.reservationToEdit.total_menu_price = this.reservationToEdit.selectedMenu.finalPrice;
    this.reservationToEdit.grandTotal = this.reservationToEdit.selectedMenu.finalPrice + this.reservationToEdit.additionalPrice;
    this.reservationToEdit.total_price = this.getGrandTotal();
    this.reservationToEdit.SLOT = this.slotSelected;
    this.reservationToEdit.total_remaining = parseFloat(this.reservationToEdit.grandTotal) - parseFloat(this.reservationToEdit.discount) - parseFloat(this.reservationToEdit.payment_received);
    this.reservationToEdit.additional_services = this.additionalServicesSelected;
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
    // this.loadMenuItems(menu.menu_item_ids);
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
    this.menuItems = this.menuItems.filter((menuItem: any) => menuItem.menu_item_id !== item.menu_item_id);
    this.allMenuItemsNames.push(item.item_name);
    setTimeout(() => {
      this.control.setValue('');
    });
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
