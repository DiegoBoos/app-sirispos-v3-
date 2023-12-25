
import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { BlockUI, BlockUIModule, NgBlockUI } from 'ng-block-ui';
import { WebsocketService } from '@shared/services/websocket.service';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces/auth-status.enum';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, BlockUIModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'app-sirispos-v3';

  @BlockUI() blockUI?: NgBlockUI;

  private authService = inject(AuthService);
  private router = inject(Router);
  private wsService = inject(WebsocketService);

  public isSocketConnected = computed<boolean>(() =>
    this.wsService.isSocketConnected()
  );

  public finishedAuthCheck = computed<boolean>(() => {
    if (this.authService.authStatus() === AuthStatus.checking) {
      return false;
    }

    return true;
  });

  constructor() {
    effect(() => {
      this.isSocketConnected()
        ? this.blockUI!.stop()
        : this.blockUI!.start('Se perdió la conexión con el servidor...');

      switch (this.authService.authStatus()) {
        case AuthStatus.checking:
          return;

        case AuthStatus.authenticated:
          const route = localStorage.getItem('route') || undefined;

          if (!route) this.router.navigateByUrl('/dashboard');
          else this.router.navigateByUrl(route);

          return;

        case AuthStatus.notAuthenticated:
          this.router.navigateByUrl('/auth/side-login');
          return;
      }
    });
  }

}
