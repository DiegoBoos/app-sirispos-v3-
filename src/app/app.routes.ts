import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    children: [
      {
        path: 'customers',
        title: 'Clientes',
        loadComponent: () =>
          import('./customers/pages/customers/customers.component'),
      },
      {
        path: 'accounts-receivable',
        title: 'Cuentas por Cobrar',
        loadComponent: () =>
          import('./accounts-receivable/accounts-receivable.component'),
      },
      {
        path: 'documents',
        title: 'Documentos',
        loadComponent: () => import('./documents/pages/documents.component'),
      },
      {
        path: 'statistics',
        title: 'Estadísticas',
        loadComponent: () =>
          import('./statistics/statistics.component'),
      },
      {
        path: 'geolocation',
        title: 'Geolocalización',
        loadComponent: () =>
          import('./geolocation/geolocation.component'),
      },
      {
        path: 'messengers',
        title: 'Mensajería',
        loadComponent: () =>
          import('./messengers/pages/messengers.component'),
      },
      {
        path: 'messengers-query',
        loadComponent: () =>
          import('./messengers/pages/messengers-query/messengers-query.component'),
      },
      {
        path: 'events-query',
        loadComponent: () =>
          import('./messengers/pages/events-query/events-query.component'),
      },
      {
        path: 'record-deliveries',
        loadComponent: () =>
          import('./messengers/pages/record-deliveries/record-deliveries.component'),
      },
      {
        path: 'pedidos',
        title: 'Pedidos',
        loadComponent: () =>
          import('./pedidos/pedidos.component'),
      },
      {
        path: 'emit-document',
        loadComponent: () =>
          import('./documents/pages/emit-document/emit-document.component'),
      },
      {
        path: 'documents-query',
        loadComponent: () =>
          import('./documents/pages/documents-query/documents-query.component'),
      },
      
      {
        path: 'discounts',
        loadComponent: () =>
          import('./statistics/discounts/discounts.component'),
      },
      
      {
        path: 'customer-payments',
        loadComponent: () =>
          import('./accounts-receivable/pages/customer-payments/customer-payments.component'),
      },
      
      {
        path: 'new-customer-payment',
       
        loadComponent: () =>
          import('./accounts-receivable/pages/new-customer-payment/new-customer-payment.component'),
      },
      {
        path: 'pedidos-query',
        loadComponent: () =>
          import('./pedidos/pages/pedidos-query/pedidos-query.component'),
      },
      {
        path: 'pedidos-separacion',
        loadComponent: () =>
          import('./pedidos/pages/separacion/separacion.component'),
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
];
