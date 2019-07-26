import { XYChart } from "@amcharts/amcharts4/charts";
import { RouteComponentProps } from 'react-router-dom';

export interface RoomDetailsProps extends RouteComponentProps<{id: string}> {
  onChange: (searchTerm: string) => void;
}

export interface RoomDetailsState {
  isLoading: boolean;
  location: string;
  datepicker: {
    dateFrom: string;
    timeFrom: string;
    dateTo: string;
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
  temperature: number;
}

export interface IPieChartItem {
  state: 'Opened' | 'Closed';
  amount: number;
}

export interface IXyChartDoorStateData {
  timestamp: string;
  state: 'PRESENT' | 'NOT_PRESENT';
}
