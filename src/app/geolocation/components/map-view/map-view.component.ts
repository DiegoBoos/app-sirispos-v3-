import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  GoogleMap,
  MapInfoWindow,
  MapMarker,
  MapMarkerClusterer,
} from '@angular/google-maps';
import { PositionInfo } from '../../interfaces/postion-info-interface';
import { User } from '../../../auth/interfaces/user.interface';
import { Pedido } from '../../../pedidos/interfaces/pedido.interface';
import { GeolocationService } from '../../geolocation.service';
import { format } from 'date-fns';
import { UbicacionInterface } from '../../interfaces';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [
    CommonModule,
    GoogleMap,
    MapMarker,
    MapMarkerClusterer,
    MapInfoWindow,
    FormsModule
  ],
  templateUrl: './map-view.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MapViewComponent implements OnInit, AfterViewInit {
  private geolocationService = inject(GeolocationService);
  
  @ViewChild(MapInfoWindow) infoWindow?: MapInfoWindow;

  center: google.maps.LatLngLiteral = { lat: 0.82753, lng: -77.65633 };
  zoom = 10;
  markerOptions: google.maps.marker.AdvancedMarkerElementOptions = { gmpDraggable: false,  };
  markerPositions = signal<google.maps.LatLngLiteral[]>([]);
  public maxDate: Date = new Date();
  public dateTo: string = format(new Date(), 'yyyy-MM-dd');

  public vendedores = signal<string[]>([]);

  selectedVendedor: string = 'Todos los vendedores';

  positionsInfo = signal<PositionInfo[]>([]);
  userInfo = signal<User>({
    user_id: '0',
    email: '',
    nombre: '',
    activo: 0,
  });
  markerClustererImagePath =
    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';

  @Input() pedido?: Pedido;
  #ubicaciones = signal<UbicacionInterface[]>([]);
  // public ubicaciones = computed(() => {
  //   if (this.selectedVendedor === 'Todos los vendedores') {
  //     return this.#ubicaciones();

  //   } else {
  //     return this.#ubicaciones().filter(i=>i.user_nombre===this.selectedVendedor);

  //   }
  // })
  public ubicaciones = signal<UbicacionInterface[]>([]);

  ubicacion = signal<UbicacionInterface|undefined>(undefined);

  ngOnInit(): void {
    
    // if (!this.pedido) {
    //   this.getLocalizaciones();

    // }
   
  }

  filterVendedores() {
    if (this.selectedVendedor === 'Todos los vendedores') {
      this.ubicaciones.set(this.#ubicaciones());

    } else {
      this.ubicaciones.set(this.#ubicaciones().filter(i=>i.user_nombre===this.selectedVendedor));
    }
  }

  getLocalizaciones() {
    this.#ubicaciones.set([]);
    this.vendedores.set([]);
    this.geolocationService.getGeolocation(this.dateTo).subscribe((data: any)=>{
      this.#ubicaciones.set(data);
      this.vendedores.set([...new Set(this.#ubicaciones().map(item => item.user_nombre!))]);
      this.vendedores.update((arr: string[]) => {
        arr.push('Todos los vendedores');
        return arr.slice(0);
      });
      this.filterVendedores();
      this.center = { lat: this.#ubicaciones()[0].latitud, lng: this.#ubicaciones()[0].longitud };
    })
  }

  ngAfterViewInit(): void {
    if (this.pedido) {
      this.positionsInfo.update((arr: PositionInfo[]) => {
        this.zoom = 20;
        this.center = { lat: this.pedido?.lat!, lng: this.pedido?.lng! };
        arr.push({
          user: this.pedido?.user!,
          position: this.center,
        });
        return arr.slice(0);
      });
    } else {
      this.getLocalizaciones();
      // this.positionsInfo.update((arr: PositionInfo[]) => {
      //   arr.push({
      //     user: {
      //       user_id: '13',
      //       email: '',
      //       nombre: 'Juan Pablo Villota',
      //       activo: 0,
      //     },
      //     position: { lat: 0.88272, lng: -77.70085 },
      //   });
      //   arr.push({
      //     user: {
      //       user_id: '38',
      //       email: '',
      //       nombre: 'Juan Carlos Bastidas',
      //       activo: 0,
      //     },
      //     position: { lat: 0.96012, lng: -77.62847 },
      //   });
      //   arr.push({
      //     user: {
      //       user_id: '12',
      //       email: '',
      //       nombre: 'Cristian Calvache',
      //       activo: 0,
      //     },
      //     position: { lat: 1.06911, lng: -77.65762 },
      //   });
      //   arr.push({
      //     user: {
      //       user_id: '7',
      //       email: '',
      //       nombre: 'Alvaro Diaz',
      //       activo: 0,
      //     },
      //     position: { lat: 0.82753, lng: -77.65633 },
      //   });
      //   return arr.slice(0);
      // });
    }
  }

  positionInfo(position: MapMarker, info: PositionInfo) {
    this.userInfo.set(info.user);
    this.infoWindow!.open(position);
  }

  ubicacionInfo(position: MapMarker, ubicacion: UbicacionInterface) {
    this.ubicacion.set(ubicacion!);
    this.infoWindow!.open(position);
  }
}
