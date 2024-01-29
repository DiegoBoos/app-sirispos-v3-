import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexPlotOptions, ApexStroke, ApexDataLabels, ApexFill, ApexLegend, ApexYAxis } from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    title: ApexTitleSubtitle;
    plotOptions: ApexPlotOptions;
    stroke: ApexStroke;
    dataLabels: ApexDataLabels;
    fill: ApexFill;
    colors: string[];
    legend: ApexLegend;
    yaxis: ApexYAxis;
  };