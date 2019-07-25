import React from 'react';
import { Link } from "react-router-dom";
import {useTheme, create} from "@amcharts/amcharts4/core";
import {
  XYChart, CategoryAxis, ValueAxis, CurvedColumnSeries, Legend, XYCursor, XYChartScrollbar, PieChart, PieSeries
} from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import './Details.css';
import { RoomDetailsProps, RoomDetailsState, IXyChart, IXyChartData } from './Details.interface';
import { fetchRoomTemperature, fetchRoomStatistic, IDoorStateStatisticResponse, fetchDoorStateData } from './RoomApi.service';

const chartId = 'js-chart';
const chartPieId = 'js-chart-pie';

class RoomDetails extends React.Component<RoomDetailsProps, RoomDetailsState> {
  chart: IXyChart | undefined; // undefined because we can't render the element in constructor phase
  pieChart: PieChart | undefined;

  constructor(props: RoomDetailsProps) {
    super(props);
    useTheme(am4themes_animated);
    const dateFrom = new Date();

    this.state = {
      location: props.match.params.id,
      datepicker: {
        dateFrom: this.formatDate(new Date(dateFrom.setDate(dateFrom.getDate() - 1))),
        timeFrom: new Date().toLocaleTimeString(),
        dateTo: this.formatDate(new Date()),
        timeTo: new Date().toLocaleTimeString()
      },
      charts: {
        pie: [],
        xy: [],
      }
    };
  }

  componentDidMount() {
    this.update();
  }

  componentWillUnmount() {
    if (this.chart) this.chart.dispose();
    if (this.pieChart) this.pieChart.dispose();
  }

  update = () => {
    this.fetchXyChartData()
      .then(({data}) => {
        this.createXyChart(data.map((el: IXyChartData) => ({
          temperature: el.temperature,
          timestamp: el.timestamp.split('T')[1]
        })));
    });

    this.fetchPieChartData().then(data => this.createPieChart(data));

    this.fetchDoorStateChartData().then(console.log);
  }

  fetchXyChartData() {
    const { dateFrom, dateTo, timeFrom, timeTo } = this.state.datepicker;
    return fetchRoomTemperature({id: this.state.location, dateFrom, dateTo, timeFrom, timeTo});
  }

  fetchPieChartData() {
    const { dateFrom, dateTo, timeFrom, timeTo } = this.state.datepicker;
    return fetchRoomStatistic({id: this.state.location, dateFrom, dateTo, timeFrom, timeTo});
  }

  fetchDoorStateChartData() {
    const { dateFrom, dateTo, timeFrom, timeTo } = this.state.datepicker;
    return fetchDoorStateData({id: this.state.location, dateFrom, dateTo, timeFrom, timeTo});
  }

  createXyChart(chartData: IXyChartData[]) {
    this.chart = create(chartId, XYChart);

    this.setState({
      charts: {
        ...this.state.charts,
        xy: !chartData ? [] : chartData
      }
    });

    this.chart.data = this.state.charts.xy;

    // const moreThanHardcodedLimit = this.chart.data.length > 12; // TODO: implement

    // Create axes
    const categoryAxis = this.chart.xAxes.push(new CategoryAxis());
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

    this.chart.legend = new Legend();
    this.chart.cursor = new XYCursor();

    // Add horizotal scrollbar with preview
    const scrollbarX = new XYChartScrollbar();
    scrollbarX.series.push(series);
    this.chart.scrollbarX = scrollbarX;
  }

  createPieChart({openTime, closedTime}: IDoorStateStatisticResponse) {
    const [openHours, openMinutes] = this.splitTime(openTime);
    const [closedHours, closedMinutes] = this.splitTime(closedTime);

    this.pieChart = create(chartPieId, PieChart);

    const noData = parseInt(openTime) === 0 && parseInt(closedTime) === 0;

    this.setState({
      charts: {
        ...this.state.charts,
        pie: noData ? [] : [
          {state: 'Open', amount: (parseInt(openHours) * 60) + parseInt(openMinutes)},
          {state: 'Closed', amount: (parseInt(closedHours) * 60) + parseInt(closedMinutes)}
        ]
      }
    });

    this.pieChart.data = this.state.charts.pie;

    // Add and configure Series
    const pieSeries = this.pieChart.series.push(new PieSeries());
    pieSeries.dataFields.value = "amount";
    pieSeries.dataFields.category = "state";
    pieSeries.slices.template.tooltipText = "{category}: {value.value} minutes";
  }

  splitTime(str: string) {
    const splitedOpen = str.split(':');
    const [openHours, openMinutes] = splitedOpen;
    return [openHours, openMinutes];
  }

  datepickerChanged = (field: keyof RoomDetailsState['datepicker'], value: string) => {
    this.setState({
      datepicker: {
        ...this.state.datepicker,
        [field]: value
      }
    });
  }

  formatDate(date: Date, chunk = 0): string {
    return date.toISOString().split('T')[chunk];
  }

  render() {
    const { location } = this.state;
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

              {/* TODO: info message about timings */}

              <div className="alert alert-primary c-location-container">
                <h6>{location}</h6>
                <button onClick={this.update} type="button" className="btn btn-outline-primary">
                  <span role="img" aria-label="go back">🔄</span> update..
                </button>
              </div>

              <div className="alert alert-warning text-center">Temperature</div>
              <div id={chartId} style={{
                width: "100%",
                height: "25rem",
                display: this.state.charts.xy.length === 0 ? 'none' : 'block'
              }}>
              </div>

              {this.state.charts.xy.length === 0 && <h3 className="text-center">No Data</h3>}

              <div className="alert alert-secondary text-center">Proximity</div>
              <div id={chartPieId} style={{
                width: "100%",
                height: "10rem",
                display: this.state.charts.pie.length === 0 ? 'none' : 'block'
              }}>
              </div>

              {this.state.charts.pie.length === 0 && <h3 className="text-center">No Data</h3>}

            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default RoomDetails;
