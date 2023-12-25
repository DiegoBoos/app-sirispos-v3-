import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BlockUIModule } from 'ng-block-ui';
import { HttpClientModule } from '@angular/common/http';;
import { provideRouter, withHashLocation, withViewTransitions } from '@angular/router';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { environment } from './environments/environment';
import { routes } from './app.routes';

const token = localStorage.getItem('token-app-spv3') || '';

const config: SocketIoConfig = { url: environment.wsUrl, options: {
   extraHeaders:{
    authenticacion: token
  }
}};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
    routes,
    withHashLocation(),
    withViewTransitions({
      skipInitialTransition: true,
    })
    
    ), 
    
    importProvidersFrom(
      HttpClientModule,
      SocketIoModule.forRoot(config),
      BlockUIModule.forRoot(),
    ),
  ],
};
