import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report.component';

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
      },
      {
        path: 'expense-report-expense',
        loadChildren: () =>
          import('./expense-report-expense/expense-report.module').then(
            (m) => m.ExpenseReportModule
          ),
      },
      {
        path: 'liability-report',
        loadChildren: () =>
          import('./liability-report/sales-report.module').then(
            (m) => m.SalesReportModule
          ),
      },
      {
        path: 'receivable-report',
        loadChildren: () =>
          import('./receivable-report/purchase-report.module').then(
            (m) => m.PurchaseReportModule
          ),
      },
      {
        path: 'event-expense-report',
        loadChildren: () =>
          import('./event-expense-report/expense-report.module').then(
            (m) => m.ExpenseReportModule
          ),
      },
      {
        path: 'food-expense-report',
        loadChildren: () =>
          import('./food-expense-report/expense-report.module').then(
            (m) => m.ExpenseReportModule
          ),
      },
      {
        path: 'purchase-report',
        loadChildren: () =>
          import('./purchase-report/purchase-report.module').then(
            (m) => m.PurchaseReportModule
          ),
      },
      {
        path: 'additional-service-report',
        loadChildren: () =>
          import('./additional-service-report/purchase-report.module').then(
            (m) => m.PurchaseReportModule
          ),
      },
      {
        path: 'inflow-outflow-report',
        loadChildren: () =>
          import('./inflow-outflow-report/purchase-report.module').then(
            (m) => m.PurchaseReportModule
          ),
      },
      {
        path: 'profit-loss-report',
        loadChildren: () =>
          import('./profit-loss-report/purchase-report.module').then(
            (m) => m.PurchaseReportModule
          ),
      },
      {
        path: 'summary-purchase-report',
        loadChildren: () =>
          import('./summary-purchase-report/purchase-report.module').then(
            (m) => m.PurchaseReportModule
          ),
      },
      {
        path: 'purchase-return-report',
        loadChildren: () =>
          import('./purchase-return-report/purchase-return-report.module').then(
            (m) => m.PurchaseReturnReportModule
          ),
      },
      {
        path: 'sales-report',
        loadChildren: () =>
          import('./sales-report/sales-report.module').then(
            (m) => m.SalesReportModule
          ),
      },
      {
        path: 'sales-return-report',
        loadChildren: () =>
          import('./sales-return-report/sales-return-report.module').then(
            (m) => m.SalesReturnReportModule
          ),
      },
      {
        path: 'quotation-report',
        loadChildren: () =>
          import('./quotation-report/quotation-report.module').then(
            (m) => m.QuotationReportModule
          ),
      },
      {
        path: 'payment-report',
        loadChildren: () =>
          import('./payment-report/payment-report.module').then(
            (m) => m.PaymentReportModule
          ),
      },
      {
        path: 'stock-report',
        loadChildren: () =>
          import('./stock-report/stock-report.module').then(
            (m) => m.StockReportModule
          ),
      },
      {
        path: 'low-stock-report',
        loadChildren: () =>
          import('./low-stock-report/low-stock-report.module').then(
            (m) => m.LowStockReportModule
          ),
      },
      {
        path: 'income-report',
        loadChildren: () =>
          import('./income-report/income-report.module').then(
            (m) => m.IncomeReportModule
          ),
      },
      {
        path: 'tax-purchase',
        loadChildren: () =>
          import('./tax-purchase/tax-purchase.module').then(
            (m) => m.TaxPurchaseModule
          ),
      },

      {
        path: 'profit-loss-list',
        loadChildren: () =>
          import('./profit-loss-list/profit-loss-list.module').then(
            (m) => m.ProfitLossListModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
