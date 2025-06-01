/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';

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
import { ProfitLossReportService } from 'src/app/core/services/profitLoss/profit-loss-report.service';

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
  public chartOptions!: Partial<ChartOptions>;
  public chartOptions2!: Partial<ChartOptions>;
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

  totalIncome: number = 0;
  totalExpense: number = 0;
  profit: number = 0;

  incomeData: any = [];
  expenseData: any = [];
  profitData: any = [];
  monthArray: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  monthcategories: any = [];

  constructor(private sideBar: SideBarService, private data: DataService, private cdr: ChangeDetectorRef, private reportService: ProfitLossReportService) {
    this.data.getProfitLoss().subscribe((res: any) => {
      res.data.sort((a: any, b: any) => parseInt(a.monthName) - parseInt(b.monthName));
      res.data.forEach((item: any) => {
        this.incomeData.push(item.totalIncome);
        this.expenseData.push(item.totalExpense);
        this.profitData.push(item.profitLoss);
        item.monthName = parseFloat(item.monthName);
        this.monthcategories.push(this.monthArray[item.monthName - 1]);

        this.totalIncome += item.totalIncome;
        this.totalExpense += item.totalExpense;
        this.profit += item.profitLoss;

      });
      this.chartOptions = {
        series: [
          {
            name: 'Income',
            data: this.incomeData,
          },

          {
            name: 'Expense',
            data: this.expenseData,
          },

          {
            name: 'Profit',
            data: this.profitData,
          },
        ],

        chart: {
          type: 'bar',
          height: 350,
          width: '100%',
          toolbar: { show: false },
          animations: { enabled: false },
          // optional tighter layout
          parentHeightOffset: 0,
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
            fillColors: ['#22CC62', '#FF0000', '#7539FF'],
          },
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        xaxis: {
          categories: this.monthcategories,
        },
        yaxis: {
          title: {
            text: 'PKR (Rupees)',
          },
        },
        fill: {
          opacity: 1,
          colors: ['#22CC62', '#FF0000', '#7539FF'],
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
        // colors: ['#7638ff', '#ff737b', 'rgb(118, 56, 255)', '#1ec1b0'],
        series: [this.profit, this.totalIncome, 0, this.totalExpense],
        chart: {
          type: 'donut',
          fontFamily: 'Poppins, sans-serif',
          height: 320,
        },
        labels: ['Profit', 'Income', 'Total Income', 'Expense'],
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
      this.cdr.detectChanges();
    });

    // <* to check layout position *>
    this.sideBar.layoutPosition.subscribe((res) => {
      this.layoutPosition = res;
    });
    // <* to check layout position *>
  }

  ngOnInit(): void {
    this.reportService.init();
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
