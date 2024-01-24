import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    children: [
      {
        path: 'documents',
        title: 'Documentos',
        loadComponent: () => import('./documents/pages/documents.component'),
      },
      {
        path: 'emit-document',
        loadComponent: () => import('./documents/pages/emit-document/emit-document.component')
      },
      {
        path: 'documents-query',
        loadComponent: () => import('./documents/pages/documents-query/documents-query.component')
      },
      {
        path: 'statistics',
        title: 'Estadísticas',
        loadComponent: () => import('./dashboard/pages/statistics/statistics.component'),
      },
    ]
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
