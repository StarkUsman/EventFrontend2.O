/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewChild, OnInit } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexTooltip,
  ApexFill,
  ApexResponsive,
} from 'ng-apexcharts';
import { routes, SideBarService, DataService } from 'src/app/core/core.index';

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  dataLabels: ApexDataLabels | any;
  grid: ApexGrid | any;
  stroke: ApexStroke | any;
  title: ApexTitleSubtitle | any;
  plotOptions: ApexPlotOptions | any;
  yaxis: ApexYAxis | any;
  legend: ApexLegend | any;
  tooltip: ApexTooltip | any;
  responsive: ApexResponsive[] | any;
  fill: ApexFill | any;
  labels: string[] | any;
  marker: string[] | any;
  colors: string[];
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;
  public layoutPosition = '1';
  public routes = routes;
  people_to_be_served: number = 0;
  pct_people_to_be_served_last_month: number = 0;
  total_people_served: number = 0;
  pct_total_people_served_last_month: number = 0;
  reservations_this_month: number = 0;
  pct_reservations_last_month: number = 0;
  total_reservations_completed: number = 0;
  pct_total_due_balance_last_month: number = 0;
  upcominReservations: any = [];

  constructor(private sideBar: SideBarService, private data: DataService) {
    this.chartOptions = {
      series: [
        {
          name: 'Received',
          data: [70, 150, 80, 180, 150, 175, 201, 60, 200, 120, 190, 160, 50],
          colors: ['#7539FF'],
        },

        {
          name: 'Pending',
          data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16, 80],
          colors: ['#fda600'],
        },
      ],

      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '60%',
          borderRadius: 5,
          borderRadiusOnAllStackedSeries: true,
          borderRadiusApplication: 'end',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
        markers: {
          fillColors: ['#7638ff', '#fda600'],
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
        ],
      },
      yaxis: {
        title: {
          text: '$ (thousands)',
        },
      },
      fill: {
        opacity: 1,
        colors: ['#7638ff', '#fda600'],
      },
      tooltip: {
        y: {
          formatter: function (val: string) {
            return '$ ' + val + ' thousands';
          },
        },
      },
    };
    this.chartOptions2 = {
      colors: ['#7638ff', '#ff737b', 'rgb(118, 56, 255)', '#1ec1b0'],
      series: [55, 40, 20, 10],
      chart: {
        type: 'donut',
        fontFamily: 'Poppins, sans-serif',
        height: 320,
      },
      labels: ['Paid', 'Unpaid', 'Overdue', 'Draft'],
      legend: { show: false },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
              height: 200,
            },
            legend: { position: 'bottom' },
          },
        },
      ],
    };

    // <* to check layout position *>
    this.sideBar.layoutPosition.subscribe((res) => {
      this.layoutPosition = res;
    });
    // <* to check layout position *>
  }

  ngOnInit(): void {
    this.data.getDashboardData().subscribe((res: any) => {
      this.people_to_be_served = res.people_to_be_served;
      this.pct_people_to_be_served_last_month = res.pct_people_to_be_served_last_month.toFixed(1);
      this.total_people_served = res.total_people_served;
      this.pct_total_people_served_last_month = res.pct_total_people_served_last_month.toFixed(1);
      this.reservations_this_month = res.reservations_this_month;
      this.pct_reservations_last_month = res.pct_reservations_last_month.toFixed(1);
      this.total_reservations_completed = res.total_reservations_completed;
    });

    this.data.getUCReservations().subscribe((res: any) => {
      this.upcominReservations = res.data;
    });
  }
}
