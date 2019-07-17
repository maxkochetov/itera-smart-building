import React from 'react';

import { Link } from "react-router-dom";

import * as am4core from "@amcharts/amcharts4/core";
import {
  XYChart, CategoryAxis, ValueAxis, CurvedColumnSeries, Legend, XYCursor, XYChartScrollbar,
  PieChart, PieSeries
} from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import './Details.css';
import { RoomDetailsProps, RoomDetailsState, ITempChart } from './Details.interface';

const chartId = 'js-chart';
const chartPieId = 'js-chart-pie';

class RoomDetails extends React.Component<RoomDetailsProps, RoomDetailsState> {
  chart: ITempChart | undefined;
  pieChart: PieChart | undefined;

  constructor(props: RoomDetailsProps) {
    super(props);
    am4core.useTheme(am4themes_animated);
    const dateFrom = new Date();

    this.state = {
      location: mockedChartData.location,
      date: mockedChartData.date,
      datepicker: {
        dateFrom: this.formatDate(new Date(dateFrom.setDate(dateFrom.getDate() - 1))),
        timeFrom: new Date().toLocaleTimeString(),
        dateTo: this.formatDate(new Date()),
        timeTo: new Date().toLocaleTimeString()
      }
    };
  }

  componentDidMount() {
    this.createXyChart();
    this.createPieChart();
  }

  componentWillUnmount() {
    if (this.chart) this.chart.dispose();
    if (this.pieChart) this.pieChart.dispose();
  }

  createXyChart() {
    this.chart = am4core.create(chartId, XYChart);
    this.chart.data = mockedChartData.data;

    // Create axes
    const categoryAxis = this.chart.xAxes.push(new CategoryAxis()); // TODO: DateAxis?
    categoryAxis.dataFields.category = "timestamp";
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.title.text = "🕑 Time";

    const valueAxis = this.chart.yAxes.push(new ValueAxis());
    valueAxis.title.text = "🌡 (°C)";

    const series = this.chart.series.push(new CurvedColumnSeries());
    series.dataFields.valueY = "temperature";
    series.dataFields.categoryX = "timestamp";
    series.name = "Temperature";
    series.tooltipText = "{name}: {valueY}";
    series.strokeWidth = 2;

    // Add legend
    this.chart.legend = new Legend();

    // Add cursor
    this.chart.cursor = new XYCursor();

    // Add horizotal scrollbar with preview
    const scrollbarX = new XYChartScrollbar();
    scrollbarX.series.push(series);
    this.chart.scrollbarX = scrollbarX;
  }

  createPieChart() {
    this.pieChart = am4core.create(chartPieId, PieChart);

    this.pieChart.data = [{
      "country": "Open",
      "litres": 70
    }, {
      "country": "Closed",
      "litres": 30
    }
    ];

    // Add and configure Series
    const pieSeries = this.pieChart.series.push(new PieSeries());
    pieSeries.dataFields.value = "litres";
    pieSeries.dataFields.category = "country";
  }

  datepickerChanged = (field: keyof RoomDetailsState['datepicker'], value: string) => {
    this.setState({
      datepicker: {
        ...this.state.datepicker,
        [field]: value
      }
    });
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  render() {
    const { location, date } = this.state;
    return (
      <React.Fragment>
        <div className="container">
          <div className="row mb-5">
            <div className="col-12">
              <Link to="/">
                <button type="button" className="btn btn-outline-primary btn-lg btn-block mb-3">
                  <span role="img" aria-label="go back">🔙</span> Select room..
                </button>
              </Link>

              <div className="alert alert-primary c-location-container">
                <h6>{location} ({date})</h6>
                <button type="button" className="btn btn-outline-success">
                  <span role="img" aria-label="go back">🔄</span> update..
                </button>
              </div>

              <div className="row">
                <div className="col-3">
                  <div className="form-group">
                    <label>Date From</label>
                    <input type="date" max="3000-12-31" min="1000-01-01" className="form-control"
                           onChange={({target: {value}}) => this.datepickerChanged('dateFrom', value)}
                           value={this.state.datepicker.dateFrom}/>
                  </div>
                </div>

                <div className="col-3">
                  <div className="form-group">
                    <label>Time From</label>
                    <input type="time" min="1000-01-01" max="3000-12-31" className="form-control"
                           onChange={({target: {value}}) => this.datepickerChanged('timeFrom', value)}
                           value={this.state.datepicker.timeFrom}/>
                  </div>
                </div>

                <div className="col-3">
                  <div className="form-group">
                    <label>Date To</label>
                    <input type="date" max="3000-12-31" min="1000-01-01" className="form-control"
                           onChange={({target: {value}}) => this.datepickerChanged('dateTo', value)}
                           value={this.state.datepicker.dateTo}/>
                  </div>
                </div>

                <div className="col-3">
                  <div className="form-group">
                    <label>Time To</label>
                    <input type="time" min="1000-01-01" max="3000-12-31" className="form-control"
                           onChange={({target: {value}}) => this.datepickerChanged('timeTo', value)}
                           value={this.state.datepicker.timeTo}/>
                  </div>
                </div>
              </div>

              <div className="alert alert-warning text-center">Temperature</div>
              <div id={chartId} style={{ width: "100%", height: "25rem" }}></div>
              <div className="alert alert-secondary text-center">Open / Closed</div>
              <div id={chartPieId} style={{ width: "100%", height: "10rem" }}></div>
            </div>
          </div>
        </div>
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
      "temperature": 18
    },
    {
      "timestamp": "14:26",
      "temperature": 25
    },
    {
      "timestamp": "14:39",
      "temperature": 23.5
    },
    {
      "timestamp": "14:41",
      "temperature": 21
    },
    {
      "timestamp": "14:53",
      "temperature": 23.55
    },
    {
      "timestamp": "14:56",
      "temperature": 21
    },
    {
      "timestamp": "15:07",
      "temperature": 25
    },
    {
      "timestamp": "15:12",
      "temperature": 23
    }
  ]
};