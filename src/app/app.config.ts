import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { BlockUIModule } from 'ng-block-ui';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';;
import { provideRouter, withHashLocation, withViewTransitions } from '@angular/router';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { environment } from './environments/environment';
import { routes } from './app.routes';
import { InterceptorService } from './interceptors/interceptor.service';
import { registerLocaleData } from '@angular/common';
import localeEsCO from '@angular/common/locales/es';


const token = localStorage.getItem('token-app-spv3') || '';

const config: SocketIoConfig = { url: environment.wsUrl, options: {
   extraHeaders:{
    authenticacion: token
  }
}};

// Establecer idioma español
registerLocaleData(localeEsCO);

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

    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    {
      provide: LOCALE_ID, useValue: 'es-CO'
    }    
  ],
};
