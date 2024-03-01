import { Routes } from '@angular/router';
import SeparacionComponent from './pedidos/pages/separacion/separacion.component';
import { canMatchAuth, canMatchByRole } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    canMatch: [canMatchAuth],

    children: [
      {
        path: 'customers',
        title: 'Clientes',
        loadComponent: () =>
          import('./customers/pages/customers/customers.component'),
        canMatch: [canMatchByRole],
      },
      {
        path: 'accounts-receivable',
        title: 'Cuentas por Cobrar',
        loadComponent: () =>
          import('./accounts-receivable/accounts-receivable.component'),
        canMatch: [canMatchByRole],
      },
      {
        path: 'documents',
        title: 'Documentos',
        loadComponent: () => import('./documents/pages/documents.component'),
        canMatch: [canMatchByRole],
      },
      {
        path: 'statistics',
        title: 'Estadísticas',
        loadComponent: () => import('./statistics/statistics.component'),
        canMatch: [canMatchByRole],
      },
      {
        path: 'geolocation',
        title: 'Geolocalización',
        loadComponent: () => import('./geolocation/geolocation.component'),
        canMatch: [canMatchByRole],
      },
      {
        path: 'messengers',
        title: 'Mensajería',
        loadComponent: () => import('./messengers/pages/messengers.component'),
        canMatch: [canMatchByRole],
      },
      {
        path: 'messengers-query',
        loadComponent: () =>
          import(
            './messengers/pages/messengers-query/messengers-query.component'
          ),
        canMatch: [canMatchByRole],
      },
      {
        path: 'events-query',
        loadComponent: () =>
          import('./messengers/pages/events-query/events-query.component'),
        canMatch: [canMatchByRole],
      },
      {
        path: 'record-deliveries',
        loadComponent: () =>
          import(
            './messengers/pages/record-deliveries/record-deliveries.component'
          ),
        canMatch: [canMatchByRole],
      },
      {
        path: 'pedidos',
        title: 'Pedidos',
        loadComponent: () => import('./pedidos/pedidos.component'),
        canMatch: [canMatchByRole],
      },
      {
        path: 'emit-document',
        loadComponent: () =>
          import('./documents/pages/emit-document/emit-document.component'),
        canMatch: [canMatchByRole],
      },
      {
        path: 'documents-query',
        loadComponent: () =>
          import('./documents/pages/documents-query/documents-query.component'),
        canMatch: [canMatchByRole],
      },

      {
        path: 'discounts',
        loadComponent: () =>
          import('./statistics/discounts/discounts.component'),
        canMatch: [canMatchByRole],
      },

      {
        path: 'customer-payments',
        loadComponent: () =>
          import(
            './accounts-receivable/pages/customer-payments/customer-payments.component'
          ),
        canMatch: [canMatchByRole],
      },

      {
        path: 'new-customer-payment',
        loadComponent: () =>
          import(
            './accounts-receivable/pages/new-customer-payment/new-customer-payment.component'
          ),
        canMatch: [canMatchByRole],
      },
      {
        path: 'pedidos-query',
        loadComponent: () =>
          import('./pedidos/pages/pedidos-query/pedidos-query.component'),
        canMatch: [canMatchByRole],
      },
      {
        path: 'pedidos-separacion',
        loadComponent: () =>
          import('./pedidos/pages/separacion/separacion.component'),
        canMatch: [canMatchByRole],
        // canDeactivate: [(component: SeparacionComponent) => !component.isExit]
      },
    ],
  },
  {
    path: 'auth',
    // loadComponent: () => import('./dashboard/dashboard.component'),
    children: [
      {
        path: 'side-login',
        loadComponent: () => import('./auth/side-login/side-login.component'),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () => import('./auth/side-login/side-login.component'),
  },
];
