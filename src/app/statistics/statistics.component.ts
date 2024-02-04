import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexXAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { initFlowbite } from 'flowbite';
import { FormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';

import { RouterModule } from '@angular/router';

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
    BlockUIModule,
    RouterModule,
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
  ngOnInit(): void {
    initFlowbite();
  }
}
