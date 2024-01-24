import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexTitleSubtitle, ApexXAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { CustomerPaymentService } from '../../../customer-payments/customer-payment.service';
import { MonthValue } from './interfaces/month-value.interface';
import { initFlowbite } from 'flowbite';
import { format } from 'date-fns';
import { FormsModule } from '@angular/forms';
import { BlockUI, BlockUIModule, NgBlockUI } from 'ng-block-ui';
import { StatisticsService } from './statistics.service';
import { VPagoCliDetalle } from '../../../customer-payments/models/v-pagocli-detalle.model';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule,
    FormsModule,
    BlockUIModule
  ],
  templateUrl: './statistics.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})




export default class StatisticsComponent implements OnInit {

  // @BlockUI() blockUI?: NgBlockUI;
  @BlockUI('load-data') blockUILoadData!: NgBlockUI;
  
  @ViewChild("chart", { static: false }) chart!: ChartComponent;

  public chartOptions: Partial<ChartOptions> = {
    series: [
      {
        name: "Valor",
        data: []
      }
    ],
    chart: {
      height: 350,
      type: "bar"
    },
    title: {
      text: "Descuentos sin emitir Nota"
    },
    xaxis: {
      categories: []
    }
  };;

  private customerPaymentService = inject(CustomerPaymentService);
  private statisticsService = inject(StatisticsService) ;

  series = signal<ApexAxisChartSeries>([]);
  xaxis = signal<ApexXAxis>({});
  count = signal<number>(0);
  total = signal<number>(0);
  detailData: VPagoCliDetalle[] = [];
  // loading = signal<boolean>(false);

  public maxDate: Date = new Date();
  public dateFrom: string =  format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd');
  public dateTo: string =  format(new Date(), 'yyyy-MM-dd');


  constructor() {  

    

  }
  ngOnInit(): void {
    initFlowbite();
  }

  loadData() {

    this.blockUILoadData!.start('Consultando datos ...');

    this.customerPaymentService.getStatisticsNoDocumentEmit(this.dateFrom, this.dateTo).subscribe((resp: any) =>{

      if (resp) {

        const { count, detailData, statistics } = resp;

        this.detailData = detailData;


        const monthValues: MonthValue[] = statistics;
        this.count.set(count);
      
        const categories: string[] = [];
        const data: number[] = [];
        let total: number = 0;

        monthValues.map(i=>{
          data.push(+i.value);
          total += +i.value;
          switch (i.month) {
            case 1:
              categories.push('Ene');
              break;
            case 2:
              categories.push('Feb');
              break;
            case 3:
              categories.push('Mar');
              break;
            case 4:
              categories.push('Abr');
              break;
            case 5:
              categories.push('May');
              break;
            case 6:
              categories.push('Jun');
              break;
            case 7:
              categories.push('Jul');
              break;
            case 8:
              categories.push('Ago');
              break;
            case 9:
              categories.push('Sep');
              break;
            case 10:
              categories.push('Oct');
              break;
            case 11:
              categories.push('Nov');
              break;
            case 12:
              categories.push('Dic');
              break;
          }
        });

        this.series.set([{ name: 'Total Descuento', data }]);
        this.xaxis.set({categories});
        this.total.set(total);
        
      }

      this.blockUILoadData!.stop();

    });
  }

  exportData() {

    this.statisticsService.exportToExcel(this.detailData, 'DocumentosConDescuentoSinEmitir.xlsx');

  }

 }
