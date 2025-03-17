import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersComponent } from './customers.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: '',
    component: CustomersComponent,
    children: [
      {
        path: 'list',
        loadChildren: () =>
          import('./list/list.module').then((m) => m.ListModule),
      },
      // {
      //   path: 'add',
      //   loadChildren: () =>
      //     import('./add-customer/add-customer.module').then(
      //       (m) => m.AddCustomerModule
      //     ),
      // },
      // {
      //   path: 'edit',
      //   loadChildren: () =>
      //     import('./edit-customer/edit-customer.module').then(
      //       (m) => m.EditCustomerModule
      //     ),
      // },
      // {
      //   path: 'active-customers',
      //   loadChildren: () =>
      //     import('./active-customers/active-customers.module').then(
      //       (m) => m.ActiveCustomersModule
      //     ),
      // },
      // {
      //   path: 'deactive-customers',
      //   loadChildren: () =>
      //     import('./deactive-customers/deactive-customers.module').then(
      //       (m) => m.DeactiveCustomersModule
      //     ),
      // },
      {
        path: 'ledger',
        loadChildren: () =>
          import('./ledger/ledger.module').then((m) => m.LedgerModule),
      },
      {
        path: 'category',
        loadChildren: () =>
          import('./category/category.module').then((m) => m.CategoryModule),
      },
      {
        path: 'subcategory',
        loadChildren: () =>
          import('./units/units.module').then((m) => m.UnitsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule {}
