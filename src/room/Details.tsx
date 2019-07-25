import React from 'react';
import { Link } from "react-router-dom";
import { useTheme, create } from "@amcharts/amcharts4/core";
import {
  XYChart, ValueAxis, CurvedColumnSeries, Legend, XYCursor, XYChartScrollbar, PieChart, PieSeries,
  DateAxis, ColumnSeries, XYSeries
} from "@amcharts/amcharts4/charts";

import { color } from "@amcharts/amcharts4/core";

import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import { NoData } from './NoData';
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
      isLoading: true,
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
    this.create();
  }

  componentWillUnmount() {
    if (this.chart) this.chart.dispose();
    if (this.pieChart) this.pieChart.dispose();
  }

  create = () => {
    Promise.all([this.fetchXyChartData(), this.fetchPieChartData(), this.fetchDoorStateChartData()])
      .then(([xyResponse, pieResponse, doorStateResponse]) => {
        this.createXyChart(xyResponse);
        this.createPieChart(pieResponse);
        console.log(doorStateResponse); // TODO: doorStateResponse
      })
      .finally(() => this.setState({ isLoading: false }));
  }

  update = () => {
    Promise.all([this.fetchXyChartData(), this.fetchPieChartData(), this.fetchDoorStateChartData()])
      .then(([xyResponse, pieResponse, doorStateResponse]) => {
        this.setXyChartData(xyResponse);
        this.setPieChartData(this.preparePieChartDate(pieResponse));
        console.log(doorStateResponse); // TODO: doorStateResponse
      });
  }

  setXyChartData(chartData: IXyChartData[]) {
    this.setState({
      charts: { ...this.state.charts, xy: chartData }
    });

    if (this.chart) this.chart.data = chartData;
  }

  setPieChartData(pieChartData: any[]) {
    this.setState({
      charts: { ...this.state.charts, pie: pieChartData }
    });

    if (this.pieChart) this.pieChart.data = pieChartData;
  }

  preparePieChartDate({openTime, closedTime}: IDoorStateStatisticResponse) {
    const [openHours, openMinutes] = this.splitTime(openTime);
    const [closedHours, closedMinutes] = this.splitTime(closedTime);

    const noData = parseInt(openTime) === 0 && parseInt(closedTime) === 0;

    return noData ? [] : [
      { state: 'Open', amount: (parseInt(openHours) * 60) + parseInt(openMinutes) },
      { state: 'Closed', amount: (parseInt(closedHours) * 60) + parseInt(closedMinutes) }
    ];
  }

  fetchXyChartData() {
    const { dateFrom, dateTo, timeFrom, timeTo } = this.state.datepicker;
    return fetchRoomTemperature({ id: this.state.location, dateFrom, dateTo, timeFrom, timeTo })
      .then(({data}) => data.map((el: IXyChartData) => ({
        temperature: el.temperature,
        timestamp: new Date(el.timestamp)
      })))
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

    // const moreThanHardcodedLimit = this.chart.data.length > 12; // TODO: implement

    // Create axes
    const dateAxis = this.chart.xAxes.push(new DateAxis());
    dateAxis.title.text = "🕑 Time";
    dateAxis.tooltipDateFormat = "MM/dd";
    dateAxis.dateFormats.setKey("hour", "MMMM dt");
    dateAxis.periodChangeDateFormats.setKey("hour", "MMMM dt");
    // categoryAxis.dataFields.category = "timestamp";

    const valueAxis = this.chart.yAxes.push(new ValueAxis());
    valueAxis.title.text = "🌡 (°C)";

    const series = this.chart.series.push(new ColumnSeries());
    series.dataFields.valueY = "temperature";
    series.dataFields.dateX = "timestamp";
    series.name = "Temperature";

    series.tooltipText = "At {dateX.formatDate('HH:mm')} the temperature was {valueY}°";
    series.columns.template.fill = color("#fff3cd");

    this.chart.legend = new Legend();
    this.chart.cursor = new XYCursor();

    // Add horizotal scrollbar with preview
    const scrollbarX = new XYChartScrollbar();
    scrollbarX.series.push(series);
    this.chart.scrollbarX = scrollbarX;

    this.setXyChartData(chartData);
  }

  createPieChart({ openTime, closedTime }: IDoorStateStatisticResponse) {
    this.pieChart = create(chartPieId, PieChart);

    // Add and configure Series
    const pieSeries = this.pieChart.series.push(new PieSeries());
    pieSeries.dataFields.value = "amount";
    pieSeries.dataFields.category = "state";
    pieSeries.slices.template.tooltipText = "{category}: {value.value} minutes";

    this.setPieChartData(this.preparePieChartDate({ openTime, closedTime }));
  }

  splitTime(s: string): [string, string] {
    const splitedOpen = s.split(':');
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
    const { location, isLoading } = this.state;

    return (
      <div className="container">
      <div className="row mb-5">
        <div className="col-12">
          <Link to="/">
            <button type="button" className="btn btn-light btn-lg btn-block mb-3 mt-3">
              <span role="img" aria-label="go back">🔙</span> select room..
            </button>
          </Link>

          <h6 className="alert alert-primary text-center">{location}</h6>

          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>Date From</label>
                <input type="date" max="3000-12-31" min="1000-01-01" className="form-control"
                  onChange={({ target: { value } }) => this.datepickerChanged('dateFrom', value)}
                  value={this.state.datepicker.dateFrom} />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label>Time From</label>
                <input type="time" min="1000-01-01" max="3000-12-31" className="form-control"
                  onChange={({ target: { value } }) => this.datepickerChanged('timeFrom', value)}
                  value={this.state.datepicker.timeFrom} />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label>Date To</label>
                <input type="date" max="3000-12-31" min="1000-01-01" className="form-control"
                  onChange={({ target: { value } }) => this.datepickerChanged('dateTo', value)}
                  value={this.state.datepicker.dateTo} />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label>Time To</label>
                <input type="time" min="1000-01-01" max="3000-12-31" className="form-control"
                  onChange={({ target: { value } }) => this.datepickerChanged('timeTo', value)}
                  value={this.state.datepicker.timeTo} />
              </div>
            </div>

            <div className="col">
              <label>&nbsp;</label>
              <button onClick={this.update} type="button" className="form-control btn btn-outline-primary">
                <span role="img" aria-label="go back">🔄</span> update..
              </button>
            </div>
          </div>

          {/* TODO: info message about timings */}

          <div className="alert alert-warning text-center">Temperature</div>
          <div id={chartId} style={{
            width: "100%",
            height: "25rem",
            display: this.state.charts.xy.length === 0 ? 'none' : 'block'
          }}>
          </div>

          {(this.state.charts.xy.length === 0 && !isLoading) && <NoData />}

          <div className="alert alert-secondary text-center">Proximity</div>
          <div id={chartPieId} className="mt-5" style={{
            width: "100%",
            height: "10rem",
            display: this.state.charts.pie.length === 0 ? 'none' : 'block'
          }}>
          </div>

          {(this.state.charts.pie.length === 0 && !isLoading) && <NoData />}

        </div>
      </div>
    </div>
    )
  }
}

export default RoomDetails;
