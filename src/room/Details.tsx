import React from 'react';
import { Link } from "react-router-dom";
import { useTheme, create, color, Color } from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import {
  XYChart, ValueAxis, XYCursor, XYChartScrollbar, PieChart, PieSeries, DateAxis, LineSeries, AxisRenderer
} from "@amcharts/amcharts4/charts";

import { NoData } from './NoData';
import { RoomDetailsProps, RoomDetailsState, IXyChart, IXyChartDataItem, IPieChartItem } from './Details.interface';

import {
  fetchRoomTemperature, fetchRoomStatistic, IDoorStateStatisticResponse, fetchDoorStateData, IDoorStateDataResponse
} from './RoomApi.service';

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
        xy: []
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

  setXyChartData(xyChartData: IXyChartDataItem[]) {
    this.setState({
      charts: { ...this.state.charts, xy: xyChartData }
    });

    if (this.chart) this.chart.data = xyChartData;
  }

  setPieChartData(pieChartData: IPieChartItem[]) {
    this.setState({
      charts: { ...this.state.charts, pie: pieChartData }
    });

    if (this.pieChart) this.pieChart.data = pieChartData;
  }

  preparePieChartDate({openTime, closedTime}: IDoorStateStatisticResponse): IPieChartItem[] {
    const [openedHours, openedMinutes] = this.splitTime(openTime);
    const [closedHours, closedMinutes] = this.splitTime(closedTime);

    const noData = parseInt(openTime) === 0 && parseInt(closedTime) === 0; // BE response "00:00:00"

    return noData
      ? []
      : [
        { state: 'Opened', amount: (parseInt(openedHours) * 60) + parseInt(openedMinutes) },
        { state: 'Closed', amount: (parseInt(closedHours) * 60) + parseInt(closedMinutes) }
      ];
  }

  fetchXyChartData(): Promise<IXyChartDataItem[]> {
    return fetchRoomTemperature({ id: this.state.location, ...this.state.datepicker })
      .then(({ data }) => data.map((el: IXyChartDataItem) => ({
        temperature: el.temperature,
        timestamp: new Date(el.timestamp)
      }))
    );
  }

  fetchPieChartData(): Promise<IDoorStateStatisticResponse> {
    return fetchRoomStatistic({ id: this.state.location, ...this.state.datepicker });
  }

  fetchDoorStateChartData(): Promise<IDoorStateDataResponse> {
    return fetchDoorStateData({ id: this.state.location, ...this.state.datepicker });
  }

  createRange(axis: DateAxis<AxisRenderer>, from: Date, to: Date, color: Color) {
    const range = axis.axisRanges.create();
    (range as any).value = from;
    (range as any).endValue = to;
    range.axisFill.fill = color;
    range.axisFill.fillOpacity = 0.25;
    range.label.disabled = true;
  }

  createXyChart(chartData: IXyChartDataItem[]) {
    this.chart = create(chartId, XYChart);
    this.chart.cursor = new XYCursor();
    this.setXyChartData(chartData);

    // Create axes
    const dateAxis = this.chart.xAxes.push(new DateAxis());
    dateAxis.title.text = "🕑 Time";
    dateAxis.tooltipDateFormat = "MM/dd";
    dateAxis.dateFormats.setKey("hour", "MMMM dt");
    dateAxis.periodChangeDateFormats.setKey("hour", "MMMM dt");

    this.createRange(dateAxis, new Date('2019-07-25T15:57:06'), new Date('2019-07-25T21:59:23'), this.chart.colors.getIndex(0));
    this.createRange(dateAxis, new Date('2019-07-25T21:59:23'), new Date('2019-07-26T05:00:00'), this.chart.colors.getIndex(2));
    this.createRange(dateAxis, new Date('2019-07-25T05:00:00'), new Date('2019-07-26T13:47:31'), this.chart.colors.getIndex(0));
    // categoryAxis.dataFields.category = "timestamp";

    const valueAxis = this.chart.yAxes.push(new ValueAxis());
    valueAxis.title.text = "🌡 (°C)";

    const series = this.chart.series.push(new LineSeries());
    series.dataFields.valueY = "temperature";
    series.dataFields.dateX = "timestamp";
    series.name = "Temperature";
    series.stroke = this.chart.colors.getIndex(11);
    // series.fill = color('#ea');
    // series.fill = color('#ffeeba');
    series.fill = this.chart.colors.getIndex(12);
    series.strokeWidth = 0.5;
    series.strokeOpacity = 0.8;
    series.fillOpacity = 0.6;
    // series.tensionY = 0;
    // series.tensionX = 0.5;
    series.tooltipText = "At {dateX.formatDate('HH:mm')} the temperature was {valueY}°";

    const scrollbarX = new XYChartScrollbar(); // Add horizotal scrollbar with preview
    scrollbarX.series.push(series);
    this.chart.scrollbarX = scrollbarX;
  }

  createPieChart({ openTime, closedTime }: IDoorStateStatisticResponse) {
    this.pieChart = create(chartPieId, PieChart);

    const pieSeries = this.pieChart.series.push(new PieSeries());
    pieSeries.dataFields.value = "amount";
    pieSeries.dataFields.category = "state";
    pieSeries.slices.template.tooltipText = "{category}: {value.value} minutes";

    this.setPieChartData(this.preparePieChartDate({ openTime, closedTime }));
  }

  splitTime(s: string): [string, string] {
    const splitedOpen = s.split(':');
    const [openHours, openMinutes] = splitedOpen; // ignoring ms
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

  render(): JSX.Element {
    const { location, isLoading } = this.state;

    return (
      <div className="container">
        <div className="row mb-5">
          <div className="col-12">
            <div className="row mb-3 mt-3">
              <div className="col-2">
                <Link to="/" className="text-decoration-none">
                  <button type="button" className="btn btn-light alert btn-block">
                    <span role="img" aria-label="go back">←</span> select room
                  </button>
                </Link>
              </div>
              <div className="col-10">
                <div className="alert alert-success text-center">
                  {location}
                </div>
              </div>
            </div>

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
                  <span role="img" aria-label="go back">🔄</span>
                </button>
              </div>
            </div>

            {/* TODO: info message about timings */}

            <div className="alert alert-warning d-flex justify-content-around align-items-center">
              <div className="d-flex align-items-center">
                <div className="rounded-circle mr-2" style={{ width: '1rem', height: '1rem', backgroundColor: '#c12b22' }}></div>
                <div>Door Opened</div>
              </div>
              <div>Temperature</div>
              <div className="d-flex align-items-center">
                <div className="rounded-circle mr-2" style={{ width: '1rem', height: '1rem', backgroundColor: '#6f94d6' }}></div>
                <div>Door Closed</div>
              </div>
            </div>

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
