import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexXAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';

import { initFlowbite } from 'flowbite';
import { format } from 'date-fns';
import { FormsModule } from '@angular/forms';
import { BlockUI, BlockUIModule, NgBlockUI } from 'ng-block-ui';
import { CustomerPaymentService } from '../../accounts-receivable/customer-payment.service';
import { VPagoCliDetalle } from '../../accounts-receivable/models/v-pagocli-detalle.model';
import { MonthValue } from '../interfaces/month-value.interface';
import { ChartOptions } from '../interfaces/chart-options.interface';
import { ExportService } from '@shared/services/export.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-discounts',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, FormsModule, BlockUIModule, RouterModule],
  templateUrl: './discounts.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class StatisticsDiscountsComponent implements OnInit {

  @BlockUI('load-data') blockUILoadData!: NgBlockUI;

  @ViewChild('chart', { static: false }) chart!: ChartComponent;

  public chartOptions: Partial<ChartOptions> = {
    series: [
      {
        name: 'Valor',
        data: [],
      },
      {
        name: 'Valor',
        data: [],
      },
    ],
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    fill: {
      opacity: 1,
    },
    colors: ['#80c7fd', '#008FFB', '#80f1cb', '#00E396'],
    dataLabels: {
      formatter: (val) => {
        return Number(val) / 1000 + 'K';
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          position: 'top',
        },
      },
    },
    // title: {
    //   text: 'Descuentos',
    // },
    xaxis: {
      categories: [],
    },
    yaxis: {
      labels: {
        formatter: (val) => {
          return '$ ' + Number(val).toLocaleString('es-CO');
        }
      }
    },
    legend: {
      position: "top",
      horizontalAlign: "left"
    }
  };

  private customerPaymentService = inject(CustomerPaymentService);
  private exportService = inject(ExportService);

  public isLoading = computed(() => {
    if (this.customerPaymentService.isLoading()) {
      this.blockUILoadData!.start('Consultando datos ...');
    } else {
      this.blockUILoadData!.stop();
    }
    return this.customerPaymentService.isLoading()
  })

  series = signal<ApexAxisChartSeries>([]);
  xaxis = signal<ApexXAxis>({});
  count = signal<number>(0);
  total = signal<number>(0);
  totalEmit = signal<number>(0);
  totalNotEmit = signal<number>(0);
  countEmit = signal<number>(0);
  countNotEmit = signal<number>(0);
  detailData: VPagoCliDetalle[] = [];
  // loading = signal<boolean>(false);

  public maxDate: Date = new Date();
  public dateFrom: string = format(
    new Date(new Date().getFullYear(), 0, 1),
    'yyyy-MM-dd'
  );
  public dateTo: string = format(new Date(), 'yyyy-MM-dd');

  constructor() {}
  ngOnInit(): void {
    initFlowbite();
  }

  loadData() {
    // this.blockUILoadData!.start('Consultando datos ...');

    this.customerPaymentService
      .getStatisticsDocumentWhithDiscount(this.dateFrom, this.dateTo)
      .subscribe((resp: any) => {
        if (resp) {
          const { count, detailData, statistics } = resp;

          this.count.set(count);
          

          this.detailData = detailData;

          const monthValues: MonthValue[] = statistics;

          const categories: string[] = [];
          const dataEmit: number[] = [];
          const dataNotEmit: number[] = [];
          let total: number = 0;
          let totalNotEmit: number = 0;
          let totalEmit: number = 0;
          let countNotEmit: number = 0;
          let countEmit: number = 0;


          monthValues.map((i) => {
            if (i.isGenerateNote === 0) {
              countNotEmit += +i.count!;
              totalNotEmit += +i.value;
              dataNotEmit.push(+i.value);
            } else {
              countEmit += +i.count!;
              totalEmit += +i.value;
              dataEmit.push(+i.value);
            }
            total += +i.value;
            const lastTwoDigits = i.year % 100;
            const formattedYear = lastTwoDigits.toString().padStart(2, '0');
            switch (i.month) {
              case 1:
                categories.push(`Ene '${formattedYear}`);
                break;
              case 2:
                categories.push(`Feb '${formattedYear}`);
                break;
              case 3:
                categories.push(`Mar '${formattedYear}`);
                break;
              case 4:
                categories.push(`Abr '${formattedYear}`);
                break;
              case 5:
                categories.push(`May '${formattedYear}`);
                break;
              case 6:
                categories.push(`Jun '${formattedYear}`);
                break;
              case 7:
                categories.push(`Jul '${formattedYear}`);
                break;
              case 8:
                categories.push(`Ago '${formattedYear}`);
                break;
              case 9:
                categories.push(`Sep '${formattedYear}`);
                break;
              case 10:
                categories.push(`Oct '${formattedYear}`);
                break;
              case 11:
                categories.push(`Nov '${formattedYear}`);
                break;
              case 12:
                categories.push(`Dic '${formattedYear}`);
                break;
            }
          });

          const monthClean = categories.filter((month, index, array) => {
            return array.indexOf(month) === index;
          });

          this.series.set([
            { name: 'Con Nota Crédito', data: dataEmit },
            { name: 'Sin Nota Crédito', data: dataNotEmit },
          ]);
          this.xaxis.set({ categories: monthClean });
          this.total.set(total);
          this.totalEmit.set(totalEmit);
          this.totalNotEmit.set(totalNotEmit);
          this.countEmit.set(countEmit);
          this.countNotEmit.set(countNotEmit);
        }

        // this.blockUILoadData!.stop();
      });
  }

  exportData() {
    this.exportService.exportToExcel(this.detailData, 'Descuentos.xlsx');
  }
}
