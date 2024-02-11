import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MapViewComponent } from './components/map-view/map-view.component';

@Component({
  selector: 'app-geolocation',
  standalone: true,
  imports: [
    CommonModule,
    MapViewComponent,
  ],
  templateUrl: './geolocation.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GeolocationComponent { }
