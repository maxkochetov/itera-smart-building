import { XYChart } from "@amcharts/amcharts4/charts";

export interface IRoom {
  id: number;
  name: string;
}

export interface RoomDetailsProps {
  onChange: (searchTerm: string) => void
}

export interface RoomDetailsState {
  location: string;
  date: string;
  datepicker: {
    dateFrom: string;
    timeFrom: string;
    dateTo: string;
    timeTo: string;
  }
}

export interface ITempChart extends XYChart {
  data: Array<{
    timestamp: string;
    temperature: number;
  }>;
}
