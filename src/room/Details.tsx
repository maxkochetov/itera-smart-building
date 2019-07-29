import React from 'react';
import { Link } from "react-router-dom";
import { useTheme, create, color, Color } from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import {
  XYChart, ValueAxis, XYCursor, XYChartScrollbar, PieChart, PieSeries, DateAxis, LineSeries, AxisRenderer
} from "@amcharts/amcharts4/charts";

import {
  RoomDetailsProps, RoomDetailsState, IXyChart, IXyChartDataItem, IPieChartItem, IXyChartDoorStateData
} from './Details.interface';

import {
  fetchRoomTemperature, fetchRoomStatistic, IDoorStateStatisticResponse, fetchDoorStateData, IDoorStateDataResponse
} from './RoomApi.service';

import { NoData } from './NoData';

const CFG = {
  chartId: 'js-chart',
  chartPieId: 'js-chart-pie',
  openedColor: 'blue',
  closedColor: 'red'
}

class RoomDetails extends React.Component<RoomDetailsProps, RoomDetailsState> {
  chart: IXyChart | undefined; // undefined because we can't render the element in constructor phase
  pieChart: PieChart | undefined;
  dateAxis: DateAxis<AxisRenderer> | undefined;

  rangesColors: { [key in IXyChartDoorStateData['state']]: Color } = {
    PRESENT: color(CFG.closedColor),
    NOT_PRESENT: color(CFG.openedColor)
  };

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
        this.renderRanges(doorStateResponse);
      })
      .catch(console.error)
      .finally(() => this.setState({ isLoading: false }));
  }

  update = () => {
    Promise.all([this.fetchXyChartData(), this.fetchPieChartData(), this.fetchDoorStateChartData()])
      .then(([xyResponse, pieResponse, doorStateResponse]) => {
        this.setXyChartData(xyResponse);
        this.setPieChartData(this.preparePieChartDate(pieResponse));
        this.renderRanges(doorStateResponse);
      })
      .catch(console.error);
  }

  renderRanges({data}: IDoorStateDataResponse) {
    const { dateAxis } = this;
    if (!dateAxis) return;

    dateAxis.axisRanges.clear();

    data.forEach((el: IXyChartDoorStateData) => {
      this.createRange(dateAxis, new Date(el.startDateTime), new Date(el.endDateTime), this.rangesColors[el.state]);
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

    const calcAmount = (openedHours: string, openedMinutes: string): number => {
      return (parseInt(openedHours) * 60) + parseInt(openedMinutes);
    }

    return noData
      ? []
      : [
        {state: 'Opened', amount: calcAmount(openedHours, openedMinutes), color: color(CFG.openedColor).lighten(0.65)},
        {state: 'Closed', amount: calcAmount(closedHours, closedMinutes), color: color(CFG.closedColor).lighten(0.65)}
      ];
  }

  fetchXyChartData(): Promise<IXyChartDataItem[]> {
    return fetchRoomTemperature({ id: this.state.location, ...this.state.datepicker })
      .then(({ data }) => data.map((el: IXyChartDataItem) => ({
        temperature: el.temperature,
        timestamp: new Date(el.timestamp)
      })))
      .catch(err => {
        console.error(err);
        return [];
      });
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
    range.axisFill.fillOpacity = 0.3;
  }

  createXyChart(chartData: IXyChartDataItem[]) {
    this.chart = create(CFG.chartId, XYChart);
    this.chart.cursor = new XYCursor();
    this.setXyChartData(chartData);

    this.dateAxis = this.chart.xAxes.push(new DateAxis());
    this.dateAxis.title.text = "🕑 Time";
    this.dateAxis.tooltipDateFormat = "dd.MM";
    this.dateAxis.dateFormats.setKey("hour", "MMMM dt");
    this.dateAxis.periodChangeDateFormats.setKey("hour", "MMMM dt");
    this.dateAxis.startLocation = 1;
    this.dateAxis.endLocation = 0;

    const valueAxis = this.chart.yAxes.push(new ValueAxis());
    valueAxis.title.text = "🌡 (°C)";

    const series = this.chart.series.push(new LineSeries());
    series.dataFields.valueY = "temperature";
    series.dataFields.dateX = "timestamp";
    series.name = "Temperature";
    series.stroke = color('yellow').lighten(0.1);
    series.fill = color('#efefef');
    series.strokeWidth = 1;
    // series.strokeOpacity = 0.8;
    // series.fillOpacity = 0.5;
    // series.tensionY = 0.97;
    // series.tensionX = 0.97;
    series.tooltipText = "At {dateX.formatDate('HH:mm')} the temperature was {valueY}°";

    const scrollbarX = new XYChartScrollbar(); // Add horizotal scrollbar with preview
    scrollbarX.series.push(series);
    this.chart.scrollbarX = scrollbarX;
  }

  createPieChart({ openTime, closedTime }: IDoorStateStatisticResponse) {
    this.pieChart = create(CFG.chartPieId, PieChart);

    const pieSeries = this.pieChart.series.push(new PieSeries());
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.slices.template.propertyFields.stroke = "color";
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
              <div className="col-3">
                <Link to="/" className="text-decoration-none">
                  <button type="button" className="btn btn-light alert btn-block">
                    <span role="img" aria-label="go back">←</span> select room
                  </button>
                </Link>
              </div>
              <div className="col-9">
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
                <div className="rounded-circle mr-2" style={{ width: '1rem', height: '1rem', backgroundColor: CFG.openedColor }}></div>
                <div>Door Opened</div>
              </div>
              <div>Temperature</div>
              <div className="d-flex align-items-center">
                <div className="rounded-circle mr-2" style={{ width: '1rem', height: '1rem', backgroundColor: CFG.closedColor }}></div>
                <div>Door Closed</div>
              </div>
            </div>

            <div id={CFG.chartId} style={{
              width: "100%",
              height: "25rem",
              // display: this.state.charts.xy.length === 0 ? 'none' : 'block'
            }}>
            </div>

            {(this.state.charts.xy.length === 0 && !isLoading) && <NoData />}

            <div className="alert alert-secondary text-center">Proximity</div>
            <div id={CFG.chartPieId} className="mt-5" style={{
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
