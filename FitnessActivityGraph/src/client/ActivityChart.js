/*
Copyright 2015 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';
import Highcharts from 'highcharts/highstock';

import Chart from './Chart';

var dayAvg = 30;

var chartOptions = {
  rangeSelector : {
    // Show a shorter range if the screen is small
    selected : (window.innerWidth > 1000) ? 1 : 0
  },
  
  title : {
      text : null
  },

  xAxis: {
    type: 'datetime',
    // Set ordinal to false so the x-axis is shown
    // in a proper time based separation.
    ordinal: false
  },
  
  series : [],
  
  tooltip: {
    formatter: function() {
      var html = '<strong>' + Highcharts.dateFormat("%A, %b %d, %Y", this.x) + '</strong><br />';
      var total = 0;
      var numTypes = 0;

      // Add all activity types. Exclude the 30 day total for now.
      for (var i=0; i < this.points.length - 1; i++) {
        if (this.points[i].y != 0) {
          html += this.points[i].series.name + ': ' + Math.floor(this.points[i].y) + ' min<br />';
          numTypes += 1;
          total += this.points[i].y;
        }
      }
      
      // If there is more than one activity type add an
      // daily activity total.
      if (numTypes == 0) {
        html += 'No Activity'
      } else if (numTypes > 1) {
        html += '<strong>Total:</strong> ' + Math.floor(total) + ' min<br />';
      }
      
      // Add the 30 day average.
      html += '<strong>' + this.points[this.points.length - 1].series.name + ':</strong> ' + Math.floor(this.points[this.points.length - 1].y) + ' min';
      return html;
    }
  },
  
  plotOptions: {
    area: {
      stacking: 'normal',
      lineColor: '#666666',
      lineWidth: 1,
      marker: {
        lineWidth: 1,
        lineColor: '#666666'
      }
    }
  }
};

var ActivityChart = React.createClass({
  componentDidMount: function() {
    var chart = this.refs.chart.chart;

    chart.showLoading('Loading...');

    google.script.run.withSuccessHandler(function(data) {
      // Set the base series for the navigator to the average.
      chart.options.navigator.series = {data: data.avg};

      for (var activity in data.data) {
        if (data.data.hasOwnProperty(activity)) {
          var activityName = activity.toLowerCase().replace("_", " ");
          activityName = activityName.charAt(0).toUpperCase() + activityName.slice(1);
          chart.addSeries({
            name: activityName,
            type: 'area',
            data : data.data[activity]
          });
        }
      }

      chart.addSeries({
        name : dayAvg + ' Day Average',
        type: 'line',
        data : data.avg,
        tooltip: {
            valueDecimals: 2
        }
      });

      chart.hideLoading();
    }).withFailureHandler(function(msg) {
      chart.showLoading('Error: ' + msg);
    }).getActivityGraphData(
      Date.UTC(1970, 0, 1),
      Date.now(),
      dayAvg
    );
  },

  render: function() {
    return (
      <Chart
        container="stockChart"
        type="stockChart"
        ref="chart"
        options={chartOptions}
      />
    );
  }
});

export default ActivityChart;
