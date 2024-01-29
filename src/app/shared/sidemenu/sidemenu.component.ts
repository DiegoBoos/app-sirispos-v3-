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
    .filter((route) => route.path !== 'side-login' && route.path !== 'emit-document' && route.path !== 'discounts' && route.path !== 'documents-query')
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
  }

  logout() {
    this.authService.logout();
  }
}
