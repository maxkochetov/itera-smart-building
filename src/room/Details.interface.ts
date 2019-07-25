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
    xy: IXyChartData[],
    pie: IPieChart[]
  }
}

export interface IXyChart extends XYChart {
  data: IXyChartData[];
}

export interface IXyChartData {
  timestamp: Date;
  // timestamp: string;
  temperature: number;
}

export interface IPieChart {
  state: 'Open' | 'Closed';
  amount: number;
}

export interface IXyChartDoorStateData {
  timestamp: string;
  state: 'PRESENT' | 'NOT_PRESENT';
}
