import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentsComponent } from './payments.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentsComponent,
    children: [
      {
        path: 'transaction-list',
        loadChildren: () =>
          import('./transactions/purchases.module').then((m) => m.PurchasesModule),
      },
      {
        path: 'add-transaction',
        loadChildren: () =>
          import('./add-transection/add-purchases.module').then((m) => m.AddPurchasesModule),
      },
      {
        path: 'edit-transaction',
        loadChildren: () =>
          import('./edit-transection/add-purchases.module').then((m) => m.AddPurchasesModule),
      },
      {
        path: 'transaction-details',
        loadChildren: () =>
          import('./transaction-details/purchases-details.module').then((m) => m.PurchasesDetailsModule),
      },
      {
        path: 'voucher-List',
        loadChildren: () =>
          import('./units/units.module').then((m) => m.UnitsModule),
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsRoutingModule { }
