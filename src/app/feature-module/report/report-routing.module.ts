import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report.component';
import { AuthGuardRole } from '../../core/guards/authRole/auth.guard';
import { AuthGuardRoleAdminRes } from '../../core/guards/authRoleAdminRes/auth.guard';
import { AuthGuardRoleAdminStore } from '../../core/guards/authRoleAdminStore/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    children: [
      {
        path: 'expense-report',
        loadChildren: () =>
          import('./expense-report/expense-report.module').then(
            (m) => m.ExpenseReportModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'expense-report-expense',
        loadChildren: () =>
          import('./expense-report-expense/expense-report.module').then(
            (m) => m.ExpenseReportModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'liability-report',
        loadChildren: () =>
          import('./liability-report/sales-report.module').then(
            (m) => m.SalesReportModule
          ),
          canActivate: [AuthGuardRoleAdminStore],
      },
      {
        path: 'receivable-report',
        loadChildren: () =>
          import('./receivable-report/purchase-report.module').then(
            (m) => m.PurchaseReportModule
          ),
          canActivate: [AuthGuardRoleAdminRes],
      },
      {
        path: 'event-expense-report',
        loadChildren: () =>
          import('./event-expense-report/expense-report.module').then(
            (m) => m.ExpenseReportModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'food-expense-report',
        loadChildren: () =>
          import('./food-expense-report/expense-report.module').then(
            (m) => m.ExpenseReportModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'purchase-report',
        loadChildren: () =>
          import('./purchase-report/purchase-report.module').then(
            (m) => m.PurchaseReportModule
          ),
          canActivate: [AuthGuardRoleAdminStore],
      },
      {
        path: 'additional-service-report',
        loadChildren: () =>
          import('./additional-service-report/purchase-report.module').then(
            (m) => m.PurchaseReportModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'inflow-outflow-report',
        loadChildren: () =>
          import('./inflow-outflow-report/purchase-report.module').then(
            (m) => m.PurchaseReportModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'profit-loss-report',
        loadChildren: () =>
          import('./profit-loss-report/purchase-report.module').then(
            (m) => m.PurchaseReportModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'summary-purchase-report',
        loadChildren: () =>
          import('./summary-purchase-report/purchase-report.module').then(
            (m) => m.PurchaseReportModule
          ),
          canActivate: [AuthGuardRoleAdminStore],
      },
      {
        path: 'purchase-return-report',
        loadChildren: () =>
          import('./purchase-return-report/purchase-return-report.module').then(
            (m) => m.PurchaseReturnReportModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'sales-report',
        loadChildren: () =>
          import('./sales-report/sales-report.module').then(
            (m) => m.SalesReportModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'sales-return-report',
        loadChildren: () =>
          import('./sales-return-report/sales-return-report.module').then(
            (m) => m.SalesReturnReportModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'quotation-report',
        loadChildren: () =>
          import('./quotation-report/quotation-report.module').then(
            (m) => m.QuotationReportModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'payment-report',
        loadChildren: () =>
          import('./payment-report/payment-report.module').then(
            (m) => m.PaymentReportModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'stock-report',
        loadChildren: () =>
          import('./stock-report/stock-report.module').then(
            (m) => m.StockReportModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'low-stock-report',
        loadChildren: () =>
          import('./low-stock-report/low-stock-report.module').then(
            (m) => m.LowStockReportModule
          ),
          canActivate: [AuthGuardRoleAdminStore],
      },
      {
        path: 'income-report',
        loadChildren: () =>
          import('./income-report/income-report.module').then(
            (m) => m.IncomeReportModule
          ),
          canActivate: [AuthGuardRoleAdminRes],
      },
      {
        path: 'tax-purchase',
        loadChildren: () =>
          import('./tax-purchase/tax-purchase.module').then(
            (m) => m.TaxPurchaseModule
          ),
          canActivate: [AuthGuardRole],
      },

      {
        path: 'profit-loss-list',
        loadChildren: () =>
          import('./profit-loss-list/profit-loss-list.module').then(
            (m) => m.ProfitLossListModule
          ),
          canActivate: [AuthGuardRole],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
