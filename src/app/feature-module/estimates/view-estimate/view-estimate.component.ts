import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-estimate',
  templateUrl: './view-estimate.component.html',
  styleUrls: ['./view-estimate.component.scss'],
})
export class ViewEstimateComponent  implements OnInit {
  backendUrl = 'http://localhost:3000';
  reservations: any[] = [];
  menus: any[] = [];
  additionalServices: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadReservations();
    this.loadMenus();
    this.loadAdditionalServices();
  }

  loadReservations() {
    this.http.get<any[]>(`${this.backendUrl}/bookings`).subscribe(
      (data) => (this.reservations = data),
      (error) => console.error('Error fetching reservations:', error)
    );
  }

  loadMenus() {
    this.http.get<any[]>(`${this.backendUrl}/menus`).subscribe(
      (data) => (this.menus = data),
      (error) => console.error('Error fetching menus:', error)
    );
  }

  loadAdditionalServices() {
    this.http.get<any[]>(`${this.backendUrl}/additional-services`).subscribe(
      (data) => (this.additionalServices = data),
      (error) => console.error('Error fetching additional services:', error)
    );
  }

  getMenuName(menuId: number) {
    const menu = this.menus.find((m) => m.menu_id == 1);
    return menu ? menu.menu_name : 'Unknown Menu';
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
}
