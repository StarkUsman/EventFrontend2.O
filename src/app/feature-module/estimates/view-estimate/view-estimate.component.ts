import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { routes, ToasterService, DataService } from 'src/app/core/core.index';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
@Component({
  selector: 'app-view-estimate',
  templateUrl: './view-estimate.component.html',
  styleUrls: ['./view-estimate.component.scss'],
})
export class ViewEstimateComponent  implements OnInit {
  control = new FormControl();
  public routes = routes;
  backendUrl = 'http://localhost:3000';
  reservations: any[] = [];
  menus: any[] = [];
  additionalServices: any[] = [];
  filteredOptions!: Observable<string[]>;
  accounts: any = [];
  allAccounts: any = [];
  unfilteredData: any = [];

  constructor(private data: DataService, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadReservations();
    this.loadMenus();
    this.loadAdditionalServices();
    this.data.getAssetAccounts().subscribe((res: any) => {
      this.allAccounts = res.data;
      for (let i = 0; i < res.data.length; i++) {
        this.accounts.push(res.data[i].name);
      }

      this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
      );
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.accounts.filter((option: any) => option.toLowerCase().includes(filterValue));
  }

  loadReservations() {
    this.http.get<any[]>(`${this.backendUrl}/bookings`).subscribe(
      (data) => {
        this.reservations = data;
        this.unfilteredData = structuredClone(this.reservations);
      },
      (error) => console.error('Error fetching reservations:', error)
    );
  }

  loadMenus() {
    this.http.get<{ data: any[] }>(`${this.backendUrl}/menus`).subscribe(
      (data) => (this.menus = data.data),
      (error) => console.error('Error fetching menus:', error)
    );
  }

  loadAdditionalServices() {
    this.http.get<any[]>(`${this.backendUrl}/additional-services`).subscribe(
      (data) => (this.additionalServices = data),
      (error) => console.error('Error fetching additional services:', error)
    );
  }

  selectAccount(account: any) {
    this.reservationToAddPayment.account = this.allAccounts.find((acc: any) => acc.name === account);
  }

  getAdditionalServices(serviceIds: string) {
    if (!serviceIds) return 'None';
    const ids = serviceIds.split(',').map(id => parseInt(id.trim(), 10));
    return this.additionalServices
      .filter(service => ids.includes(service.additional_service_id))
      .map(service => service.additional_service_name)
      .join(', ');
  }

  addReservation() {
    this.router.navigate(['/reservations/add-reservation']);
  }

  deleteReservation(bookingId: number) {
    if (confirm('Are you sure you want to delete this reservation?')) {
      this.http.delete(`${this.backendUrl}/bookings/${bookingId}`).subscribe(
        () => {
          alert('Reservation deleted successfully!');
          this.loadReservations();
        },
        (error) => console.error('Error deleting reservation:', error)
      );
    }
  }

  reservationToAddPayment: any = {};
  setReservationToAddPayment(reservation: any){
    this.reservationToAddPayment = reservation;
    this.reservationToAddPayment.status = this.reservationToAddPayment.status ? this.reservationToAddPayment.status : 'Pending';
  }

  addAmount(){
    let requestBody = {
      id: this.reservationToAddPayment.booking_id,
      paymentToAdd: this.reservationToAddPayment.paymentToAdd,
      account_id: this.reservationToAddPayment.account.id,
    }

    this.data.addReservationPayment(requestBody).subscribe((res: any) => {
      this.loadReservations();
      this.reservationToAddPayment = {};
    });
  }

  queryString: string = '';
  async searchCustomers(){
    this.reservations = structuredClone(this.unfilteredData);
    this.reservations = this.reservations.filter((reservation) => {
      return (
        reservation.reservation_name.toLowerCase().includes(this.queryString.toLowerCase()) ||
        reservation.contact_number.toLowerCase().includes(this.queryString.toLowerCase()) ||
        reservation.alt_contact_number?.toLowerCase().includes(this.queryString.toLowerCase()) ||
        reservation.description?.toLowerCase().includes(this.queryString.toLowerCase()) ||
        reservation.SLOT.hall.toLowerCase().includes(this.queryString.toLowerCase()) ||
        reservation.status?.toLowerCase().includes(this.queryString.toLowerCase())
      );
    });
  }
}
