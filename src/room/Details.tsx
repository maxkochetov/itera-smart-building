import React, { Component } from 'react';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

class RoomDetails extends Component {
  chart: any;

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.createChart()
  }

  componentWillUnmount() {
    if (this.chart) this.chart.dispose();
  }

  createChart() {
    this.chart = am4core.create("chartdiv", am4charts.XYChart);
    this.chart.data = mockedChartData;

    // Create axes
    const categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.title.text = "Countries";

    const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Litres sold (M)";

    // Create series
    const series = this.chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "litres";
    series.dataFields.categoryX = "country";
    series.name = "Sales";
    series.tooltipText = "{name}: [bold]{valueY}[/]";

    const series2 = this.chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = "units";
    series2.dataFields.categoryX = "country";
    series2.name = "Units";
    series2.tooltipText = "{name}: [bold]{valueY}[/]";
    series2.strokeWidth = 3;

    // Add legend
    this.chart.legend = new am4charts.Legend();

    // Add cursor
    this.chart.cursor = new am4charts.XYCursor();

    // Add simple vertical scrollbar
    this.chart.scrollbarY = new am4core.Scrollbar();

    // Add horizotal scrollbar with preview
    const scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    this.chart.scrollbarX = scrollbarX;
  }

  render() {
    return (
      <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
    );
  }
}

export default RoomDetails;

const mockedChartData = [{
  "country": "Lithuania",
  "litres": 501.9,
  "units": 250
}, {
  "country": "Czech Republic",
  "litres": 301.9,
  "units": 222
}, {
  "country": "Ireland",
  "litres": 201.1,
  "units": 170
}, {
  "country": "Germany",
  "litres": 165.8,
  "units": 122
}, {
  "country": "Australia",
  "litres": 139.9,
  "units": 99
}, {
  "country": "Austria",
  "litres": 128.3,
  "units": 85
}, {
  "country": "UK",
  "litres": 99,
  "units": 93
}, {
  "country": "Belgium",
  "litres": 60,
  "units": 50
}, {
  "country": "The Netherlands",
  "litres": 50,
  "units": 42
}];