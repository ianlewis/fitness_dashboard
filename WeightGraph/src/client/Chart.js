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

var Chart = React.createClass({
    // When the DOM is ready, create the chart.
    componentDidMount: function () {
        // Extend Highcharts with modules
        if (this.props.modules) {
            this.props.modules.forEach(function (module) {
                module(Highcharts);
            });
        }
        // Set container which the chart should render to.
        this.chart = new Highcharts[this.props.type || "Chart"](
            this.props.container, 
            this.props.options
        );
    },

    //Destroy chart before unmount.
    componentWillUnmount: function () {
        this.chart.destroy();
    },

    //Create the div which the chart will be rendered to.
    render: function () {
        return (
          <div id={this.props.container} />
        )
    }
});

export default Chart;
