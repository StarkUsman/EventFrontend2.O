import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesComponent } from './expenses.component';

const routes: Routes = [
  { path: '', component: ExpensesComponent, children: [ {
        path: 'expenses-list',
        loadChildren: () =>
          import('./expenses-list/expenses-list.module').then((m) => m.ExpensesListModule),
      }, 
      {
        path: 'edit-expenses',
        loadChildren: () =>
          import('./edit-expenses/edit-purchases.module').then(
            (m) => m.EditPurchasesModule
          ),
      },
      {
        path: 'add-expenses',
        loadChildren: () =>
          import('./add-expenses/add-purchases.module').then(
            (m) => m.AddPurchasesModule
          ),
      },
      {
        path: 'expenses-details',
        loadChildren: () =>
          import('./purchases-details/purchases-details.module').then(
            (m) => m.PurchasesDetailsModule
          ),
      }
    ],
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpensesRoutingModule {}
