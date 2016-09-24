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

/**
 * Creates a dataset contanining the moving average of the given
 * data over the given number of days.
 */
function movingAverage(days, data) {
  var win = [];
  var avg = [];


  for (var i=0; i<data.length; i++) {
    // Remove data that exceeds the given number of the days from the window.
    var j = 0;
    // TODO: Handle timezone.
    while (j < win.length && win[j][0] < data[i][0] - (days * 24 * 60 * 60 * 1000)) {
      j++;
    }
    for (var k=0; k<j; k++) {
      win.shift();
    }

    // Add the current value to the window.
    win.push(data[i]);

    
    // Calculate the average for the window.
    var winTotal = 0;
    for (var k=0; k<win.length; k++) {
      winTotal+=win[k][1];
    }

    avg.push([data[i][0], winTotal/win.length]);
  }

  return avg;
}

var chartOptions = {
  chart: {
    type: 'spline'
  },

  rangeSelector: {
    // Show a shorter range if the screen is small
    selected: (window.innerWidth > 1000) ? 1 : 0
  },
  
  title: {
      text : null
  },

  xAxis: {
    type: 'datetime',
    // Set ordinal to false so the x-axis is shown
    // in a proper time based separation.
    ordinal: false
  },
  
  series : [{
    name: 'Weight',
    data: [],
    tooltip: {
      valueDecimals: 2
    }
  }, {
    name : dayAvg + ' Day Average',
    data : [],
    tooltip: {
      valueDecimals: 2
    }
  }],
  
  plotOptions: {
    spline: {
      marker: {
        enabled: true
      }
    }
  }
};

var WeightChart = React.createClass({
  componentDidMount: function() {
    var chart = this.refs.chart.chart;

    chart.showLoading('Loading...');

    google.script.run.withSuccessHandler(function(data) {
      chart.series[0].setData(data);
      chart.series[1].setData(movingAverage(dayAvg, data));

      chart.hideLoading();
    }).withFailureHandler(function(msg) {
      chart.showLoading('Error: ' + msg);
    }).getWeightGraphData(
      Date.UTC(1970, 0, 1),
      Date.now()
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

export default WeightChart;
