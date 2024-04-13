import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { routes } from '../../app.routes';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidemenu.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidemenuComponent implements OnInit {

  private authService = inject(AuthService);

  public currentUser = computed(() => this.authService.currentUser());

  public menuItems = routes
    .map((route) => route.children ?? [])
    .flat()
    .filter((route) => route && route.path)
    .filter((route) => route.path !== 'side-login' 
    && route.path !== 'emit-document' 
    && route.path !== 'discounts' 
    && route.path !== 'documents-query' 
    && route.path !== 'customer-payments'
    && route.path !== 'new-customer-payment'
    && route.path !== 'pedidos-query'
    && route.path !== 'pedidos-separacion'
    && route.path !== 'messengers-query'
    && route.path !== 'record-deliveries'
    && route.path !== 'events-query'
    )
    .filter((route) => !route.path?.includes(':'));

  constructor() {
    // const dashboardRoutes = routes
    // .map( route => route.children ?? [] )
    // .flat()
    // .filter( route => route && route.path )
    // .filter( route => !route.path?.includes(':'))
  }
  ngOnInit(): void {
   initFlowbite();
   if (
    localStorage.getItem('color-theme') === 'dark' ||
    (!('color-theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  // Change the icons inside the button based on previous settings
  const themeToggleDarkIcon = document.getElementById(
    'theme-toggle-dark-icon'
  );
  const themeToggleLightIcon = document.getElementById(
    'theme-toggle-light-icon'
  );

  if (
    localStorage.getItem('color-theme') === 'dark' ||
    (!('color-theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    themeToggleLightIcon!.classList.remove('hidden');
  } else {
    themeToggleDarkIcon!.classList.remove('hidden');
  }

  const themeToggleBtn = document.getElementById('theme-toggle');

  themeToggleBtn!.addEventListener('click', () => {
    // Toggle icons inside button
    themeToggleDarkIcon!.classList.toggle('hidden');
    themeToggleLightIcon!.classList.toggle('hidden');

    // If set via local storage previously
    if (localStorage.getItem('color-theme')) {
      if (localStorage.getItem('color-theme') === 'light') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      }

      // If NOT set via local storage previously
    } else {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      }
    }
  });
  }

  logout() {
    this.authService.logout();
  }
}
