import { XYChart } from "@amcharts/amcharts4/charts";

export interface RoomDetailsProps {
  onChange: (searchTerm: string) => void;
  match: any; // TODO: react router match interface
}

export interface RoomDetailsState {
  location: string;
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
