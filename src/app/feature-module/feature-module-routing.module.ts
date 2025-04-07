import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/core.index';
import { AuthGuardRole } from '../core/guards/authRole/auth.guard';
import { LoggedInGuard } from '../core/guards/loggedIn/logged-in.guard';
import { FeatureModuleComponent } from './feature-module.component';
import { AuthGuardRoleAdmin } from '../core/guards/authRoleAdminOnly/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FeatureModuleComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [AuthGuardRole],
      },
      {
        path: 'customer',
        loadChildren: () =>
          import('./customers/customers.module').then((m) => m.CustomersModule),
        canActivate: [AuthGuardRole],
      },
      {
        path: 'base-ui',
        loadChildren: () =>
          import('./ui-interface/base-ui/base-ui.module').then(
            (m) => m.BaseUIModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'elements',
        loadChildren: () =>
          import('./ui-interface/elements/elements.module').then(
            (m) => m.ElementsModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./ui-interface/tables/tables.module').then(
            (m) => m.TablesModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'icon',
        loadChildren: () =>
          import('./ui-interface/icon/icon.module').then((m) => m.IconModule),
        canActivate: [AuthGuardRole],
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./ui-interface/forms/forms.module').then(
            (m) => m.FormsModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'chart',
        loadChildren: () =>
          import('./ui-interface/charts/charts.module').then(
            (m) => m.ChartsModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'blank-page',
        loadChildren: () =>
          import('./blank-page/blank-page.module').then(
            (m) => m.BlankPageModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'google-maps',
        loadChildren: () =>
          import('./google-maps/google-maps.module').then(
            (m) => m.GoogleMapsModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
        canActivate: [AuthGuardRole],
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./users-list/users-list.module').then(
            (m) => m.UsersListModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'application',
        loadChildren: () =>
          import('./application/application.module').then(
            (m) => m.ApplicationModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./setting/setting.module').then((m) => m.SettingModule),
        canActivate: [AuthGuardRole],
      },
      {
        path: 'blog',
        loadChildren: () =>
          import('./blog/blog.module').then((m) => m.BlogModule),
        canActivate: [AuthGuardRole],
      },
      {
        path: 'expenses',
        loadChildren: () =>
          import('./expenses/expenses.module').then((m) => m.ExpensesModule),
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('./payments/payments.module').then((m) => m.PaymentsModule),
        canActivate: [AuthGuardRole],
      },
      {
        path: 'items',
        loadChildren: () =>
          import('./items/items.module').then((m) => m.ItemsModule),
        canActivate: [AuthGuardRole],
      },
      {
        path: 'reservations',
        loadChildren: () =>
          import('./estimates/estimates.module').then((m) => m.EstimatesModule),
        canActivate: [AuthGuardRoleAdmin],
      },
      {
        path: 'invoices',
        loadChildren: () =>
          import('./invoices/invoices.module').then((m) => m.InvoicesModule),
        canActivate: [AuthGuardRole],
      },
      {
        path: 'vendors',
        loadChildren: () =>
          import('./vendors/vendors.module').then((m) => m.VendorsModule),
      },
      {
        path: 'inventory',
        loadChildren: () =>
          import('./inventory/inventory.module').then((m) => m.InventoryModule),
      },

      {
        path: 'delivery-challans',
        loadChildren: () =>
          import('./delivery-challans/delivery-challans.module').then(
            (m) => m.DeliveryChallansModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'membership',
        loadChildren: () =>
          import('./membership/membership.module').then(
            (m) => m.MembershipModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'services',
        loadChildren: () =>
          import('./location/location.module').then((m) => m.LocationModule),
        canActivate: [AuthGuardRole],
      },
      {
        path: 'product-service',
        loadChildren: () =>
          import('./products-service/products-service.module').then(
            (m) => m.ProductsServiceModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'manageusers',
        loadChildren: () =>
          import('./manageusers/manageusers.module').then(
            (m) => m.ManageusersModule
          ),
          canActivate: [AuthGuardRole],
      },

      {
        path: 'purchase-return',
        loadChildren: () =>
          import('./purchase-orders/purchase-orders.module').then(
            (m) => m.PurchaseOrdersModule
          ),
      },
      {
        path: 'add-purchase-return',
        loadChildren: () =>
          import('./add-purchases/add-purchases.module').then(
            (m) => m.AddPurchasesModule
          ),
      },
      {
        path: 'debit-notes',
        loadChildren: () =>
          import('./debit-notes/debit-notes.module').then(
            (m) => m.DebitNotesModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'roles-permission',
        loadChildren: () =>
          import('./roles-permission/roles-permission.module').then(
            (m) => m.RolesPermissionModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'delete-account-request',
        loadChildren: () =>
          import('./delete-account-request/delete-account-request.module').then(
            (m) => m.DeleteAccountRequestModule
          ),
          canActivate: [AuthGuardRole],
      },

      {
        path: 'recurring-pages',
        loadChildren: () =>
          import('./recurring-pages/recurring-pages.module').then(
            (m) => m.RecurringPagesModule
          ),
          canActivate: [AuthGuardRole],
      },

      {
        path: 'contact-messages',
        loadChildren: () =>
          import('./contact-messages/contact-messages.module').then(
            (m) => m.ContactMessagesModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'ticket-pages',
        loadChildren: () =>
          import('./ticket-pages/ticket-pages.module').then(
            (m) => m.TicketPagesModule
          ),
          canActivate: [AuthGuardRole],
      },

      {
        path: 'pages',
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
        canActivate: [AuthGuardRole],
      },

      {
        path: 'credit-note-pages',
        loadChildren: () =>
          import('./credit-note-pages/credit-note-pages.module').then(
            (m) => m.CreditNotePagesModule
          ),
          canActivate: [AuthGuardRole],
      },

      {
        path: 'faq',
        loadChildren: () => import('./faq/faq.module').then((m) => m.FaqModule),
        canActivate: [AuthGuardRole],
      },
      {
        path: 'testimonial-page',
        loadChildren: () =>
          import('./testimonial-page/testimonial-page.module').then(
            (m) => m.TestimonialPageModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'customerdetailspage',
        loadChildren: () =>
          import('./customerdetailspage/customerdetailspage.module').then(
            (m) => m.CustomerdetailspageModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'purchasepage',
        loadChildren: () =>
          import('./purchasepage/purchasepage.module').then(
            (m) => m.PurchasepageModule
          ),
      },
      {
        path: 'quotationspage',
        loadChildren: () =>
          import('./quotationspage/quotationspage.module').then(
            (m) => m.QuotationspageModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'payment-summary',
        loadChildren: () =>
          import('./payment-summary/payment-summary.module').then(
            (m) => m.PaymentSummaryModule
          ),
          canActivate: [AuthGuardRole],
      },

      {
        path: 'permission',
        loadChildren: () =>
          import('./permission/permission.module').then(
            (m) => m.PermissionModule
          ),
          canActivate: [AuthGuardRole],
      },

      {
        path: 'edit-faq',
        loadChildren: () =>
          import('./edit-faq/edit-faq.module').then((m) => m.EditFaqModule),
        canActivate: [AuthGuardRole],
      },
      {
        path: 'contact-details',
        loadChildren: () =>
          import('./contact-details/contact-details.module').then(
            (m) => m.ContactDetailsModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'signature-list',
        loadChildren: () =>
          import('./signature-list/signature-list.module').then(
            (m) => m.SignatureListModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'pay-online',
        loadChildren: () =>
          import('./pay-online/pay-online.module').then(
            (m) => m.PayOnlineModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./notifications/notifications.module').then(
            (m) => m.NotificationsModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'mail-pay-invoice',
        loadChildren: () =>
          import('./mail-pay-invoice/mail-pay-invoice.module').then(
            (m) => m.MailPayInvoiceModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'super-admin',
        loadChildren: () =>
          import('./super-admin/super-admin.module').then(
            (m) => m.SuperAdminModule
          ),
          canActivate: [AuthGuardRole],
      },
      {
        path: 'report',
        loadChildren: () =>
          import('./report/report.module').then((m) => m.ReportModule),
        canActivate: [AuthGuardRole],
      },
    ],
  },
  {
    path: '',
    canActivate: [LoggedInGuard],
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('../shared/error/error.module').then((m) => m.ErrorModule),
  },
  {
    path: 'admin-register',
    loadChildren: () =>
      import('./authentication/admin-register/admin-register.module').then(
        (m) => m.AdminRegisterModule
      ),
  },

  {
    path: '**',
    redirectTo: 'error/404',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureModuleRoutingModule {}
