import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SearchParam } from '@shared/interfaces/search-param.interface';
import { format } from 'date-fns';
import { initFlowbite } from 'flowbite';
import { BlockUI, BlockUIModule, NgBlockUI } from 'ng-block-ui';
import { PedidoService } from '../../pedido.service';
import { PedidoSearchParam } from '../../interfaces/pedido-search-param.interface';
import { Pedido } from '../../interfaces/pedido.interface';
import { PipesModule } from '../../../pipes/pipes.module';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PdfViewerComponent } from '@shared/components/pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-pedidos-query',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BlockUIModule,
    FormsModule,
    PipesModule,
    MatDialogModule
  ],
  templateUrl: './pedidos-query.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PedidosQueryComponent implements OnInit {
  @BlockUI('load-data') blockUILoadData!: NgBlockUI;
  private dialog = inject(MatDialog);

  private pedidoService = inject(PedidoService);
  private router = inject(Router);
  public pedidos = signal<Pedido[]>([]);

  public isLoading = computed(() => {    
    if (this.pedidoService.isLoading()) {
      this.blockUILoadData!.start('Consultando datos ...');
    } else {
      this.blockUILoadData!.stop();
    }
    return this.pedidoService.isLoading()
  })
  
  searchParam: SearchParam = {
    pagination: {
      pageSize: 10,
      pageIndex: 0,
      length: 0,
      pages: 0,
    },
    term: '',
    dateFrom: '',
    dateTo: '',
  };

  pedidoSearchParam: PedidoSearchParam = {
    status: 'A',
    anuladas: false,
    searchParam: this.searchParam,
  };

  public anuladas: boolean = false;

  public maxDate: Date = new Date();
  public dateFrom: string = format(
    new Date(new Date().getFullYear(), 0, 1),
    'yyyy-MM-dd'
  );
  public dateTo: string = format(new Date(), 'yyyy-MM-dd');
  public term: string = '';

  ngOnInit(): void {
    this.loadData();
    initFlowbite();
  }

  loadData() {
    if (this.searchParam.term !== this.term)
      this.searchParam.pagination!.pageIndex = 0;

    this.searchParam.dateFrom = this.dateFrom;
    this.searchParam.dateTo = this.dateTo;
    this.searchParam.term = this.term;
    this.searchParam.anuladas = this.anuladas;
    let previousLength: number = this.searchParam.pagination!.length;

    this.pedidoSearchParam.searchParam = this.searchParam;

    this.pedidoService
      .searchDocuments(this.pedidoSearchParam)
      .subscribe((resp) => {
        this.pedidos.set(resp.data);
        const { length, pageIndex, pageSize, pages } = resp.pagination;
        this.searchParam.pagination = {
          length: +length,
          pageIndex: +pageIndex,
          pageSize: +pageSize,
          pages: +pages,
        };
        if (previousLength !== this.searchParam.pagination.length)
          this.searchParam.pagination.pageIndex = 0;
      });
  }

  previousPage() {
    const pageIndex = this.searchParam.pagination!.pageIndex;
    if (pageIndex > 0) {
      this.searchParam.pagination!.pageIndex--;
    }
    this.loadData();
  }

  nextPage() {
    const pageIndex = this.searchParam.pagination!.pageIndex;
    if (pageIndex < this.searchParam.pagination!.pages) {
      this.searchParam.pagination!.pageIndex++;
    }
    this.loadData();
  }

  listPedidosDownload() {
    this.searchParam.dateFrom = this.dateFrom;
    this.searchParam.dateTo = this.dateTo;
    this.searchParam.term = this.term;
    this.searchParam.anuladas = this.anuladas;
    this.pedidoService.getReportExcelBase64(this.searchParam);
  }

  printPedido(id: number, name: string) {
    // this.blockUILoadData!.start('Generando comprobante ...');
    this.pedidoService.getPedidoReport(id).subscribe((data) => {
      const base64 = data;
      const fileName = `${name}`;
      // this.blockUILoadData!.stop();
      const dialogRef = this.dialog.open(PdfViewerComponent, {
        data: { base64, fileName }, disableClose: true,
      });
      dialogRef.afterClosed().subscribe(() => {});
    });
  }

  geolocationShow(pedido: Pedido) {
    this.router.navigate(['/dashboard/geolocation'], { state: { pedido } });
  }
}
