import { XYChart } from "@amcharts/amcharts4/charts";
import { Color } from "@amcharts/amcharts4/core";
import { RouteComponentProps } from 'react-router-dom';

export interface RoomDetailsProps extends RouteComponentProps<{id: string}> {
  onChange: (searchTerm: string) => void;
}

export interface RoomDetailsState {
  isLoading: boolean;
  location: string;
  datepicker: {
    dateFrom: Date;
    timeFrom: string;
    dateTo: Date;
    timeTo: string;
  }
  charts: {
    xy: IXyChartDataItem[],
    pie: IPieChartItem[]
  }
}

export interface IXyChart extends XYChart {
  data: IXyChartDataItem[];
}

export interface IXyChartDataItem {
  timestamp: Date;
  temperature: number | null;
}

export interface IPieChartItem {
  state: 'Opened' | 'Closed';
  amount: number;
  color: Color;
}

export interface IXyChartDoorStateData {
  startDateTime: string;
  endDateTime: string;
  state: 'PRESENT' | 'NOT_PRESENT';
}
