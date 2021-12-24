import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

import { EChartsOption } from 'echarts';
import { TotalService } from './service/TotalService';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  /**
   * echart读取
   */
  Loading = false;
  Loading1 = false;
  Loading2 = false;
  /**
   *
   * 房间金额饼图
   */
  option = null;

  /**
   *
   * 房间好评饼图
   */
  likeOption = null;

  // 柱状图
  option1 = {
    color: ['#FAC858'],
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        barWidth: 30,
      },
    ],
  };
  constructor(private http: _HttpClient, private totalService: TotalService) {}

  ngOnInit() {
    this.loadOptionData();
    this.loadOptionData1();
  }

  loadOptionData() {
    // this.Loading = true;
    this.totalService.findMoneyByRoom().subscribe((data) => {
      const seriesData = [];
      const listData = data;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < listData.length; i++) {
        const totalData = {
          name: listData[i][1] + '/' + listData[i][2],
          value: listData[i][3],
        };
        seriesData.push(totalData);
      }
      this.option = {
        color: ['#5470C6', '#91CC75', '#FAC858', '#FF515A', '#36CE9E', '#8B5CFF', '#36CE9E'],
        title: {
          text: '统计每个房间的收入',
          subtext: 'PreView Data',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
      // this.Loading = false;
    });
  }
  loadOptionData1() {
    // this.Loading1 = true;
    this.totalService.findLikeByRoom().subscribe((data) => {
      const seriesData = [];
      const listData1 = data;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < listData1.length; i++) {
        const totalData = {
          name: listData1[i][1] + '/' + listData1[i][2],
          value: listData1[i][3],
        };
        seriesData.push(totalData);
      }
      this.likeOption = {
        color: ['#5470C6', '#91CC75', '#FAC858', '#FF515A', '#36CE9E', '#8B5CFF', '#36CE9E'],
        title: {
          text: '统计每个房间的好评数',
          subtext: 'PreView Data',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
      // this.Loading1 = false;
    });
  }
}
