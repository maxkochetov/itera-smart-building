import React from 'react';

import * as am4core from "@amcharts/amcharts4/core";
import {
  XYChart, CategoryAxis, ValueAxis, CurvedColumnSeries, Legend, XYCursor, XYChartScrollbar
} from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export interface RoomDetailsProps {
  onChange: (searchTerm: string) => void
}

export interface RoomDetailsState {
  location: string;
  date: string;
}

const chartId = 'js-chart';

class RoomDetails extends React.Component<RoomDetailsProps, RoomDetailsState> {
  chart: XYChart | undefined;

  constructor(props: any) {
    super(props);
    this.state = {
      location: mockedChartData.location,
      date: mockedChartData.date
    };
  }

  componentDidMount() {
    this.createChart();
  }

  componentWillUnmount() {
    if (this.chart) this.chart.dispose();
  }

  createChart() {
    am4core.useTheme(am4themes_animated);

    this.chart = am4core.create(chartId, XYChart);
    this.chart.data = mockedChartData.data;

    // Create axes
    const categoryAxis = this.chart.xAxes.push(new CategoryAxis());
    categoryAxis.dataFields.category = "timestamp";
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.title.text = "🕑 Time";

    const valueAxis = this.chart.yAxes.push(new ValueAxis());
    valueAxis.title.text = "🌡 (°C)";

    // Create series
    // const series = this.chart.series.push(new am4charts.ColumnSeries());
    // series.dataFields.valueY = "temperature";
    // series.dataFields.categoryX = "timestamp";
    // series.name = "___";
    // series.tooltipText = "{name}: [bold]{valueY}[/]";

    const series2 = this.chart.series.push(new CurvedColumnSeries());
    series2.dataFields.valueY = "temperature";
    series2.dataFields.categoryX = "timestamp";
    series2.name = "Temperature";
    series2.tooltipText = "{name}: [bold]{valueY}[/]";
    series2.strokeWidth = 3;

    // Add legend
    this.chart.legend = new Legend();

    // Add cursor
    this.chart.cursor = new XYCursor();

    // Add simple vertical scrollbar
    // this.chart.scrollbarY = new am4core.Scrollbar();

    // Add horizotal scrollbar with preview
    const scrollbarX = new XYChartScrollbar();
    scrollbarX.series.push(series2);
    this.chart.scrollbarX = scrollbarX;
  }

  render() {
    const { location, date } = this.state;
    return (
      <React.Fragment>
        <div className="alert alert-warning text-center mt-5">{location} ({date})</div>
        <div id={chartId} style={{ width: "100%", height: "500px" }}></div>
      </React.Fragment>
    );
  }
}

export default RoomDetails;

// const mockedChartData = [{
//   "country": "Lithuania",
//   "litres": 501.9,
//   "units": 250
// }, {
//   "country": "Czech Republic",
//   "litres": 301.9,
//   "units": 222
// }, {
//   "country": "Ireland",
//   "litres": 201.1,
//   "units": 170
// }, {
//   "country": "Germany",
//   "litres": 165.8,
//   "units": 122
// }, {
//   "country": "Australia",
//   "litres": 139.9,
//   "units": 99
// }, {
//   "country": "Austria",
//   "litres": 128.3,
//   "units": 85
// }, {
//   "country": "UK",
//   "litres": 99,
//   "units": 93
// }, {
//   "country": "Belgium",
//   "litres": 60,
//   "units": 50
// }, {
//   "country": "The Netherlands",
//   "litres": 50,
//   "units": 42
// }];

const mockedChartData = {
  "location": "Meeting Room M3",
  "date": "07/15/2019",
  "data": [
    {
      "timestamp": "14:25",
      "temperature": 23.5
    },
    {
      "timestamp": "14:26",
      "temperature": 22.95
    },
    {
      "timestamp": "14:39",
      "temperature": 23.5
    },
    {
      "timestamp": "14:41",
      "temperature": 23
    },
    {
      "timestamp": "14:53",
      "temperature": 23.55
    },
    {
      "timestamp": "14:56",
      "temperature": 23
    },
    {
      "timestamp": "15:07",
      "temperature": 23.55
    },
    {
      "timestamp": "15:12",
      "temperature": 23
    }
  ]
};