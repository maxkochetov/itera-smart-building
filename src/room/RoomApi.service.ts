import { API_URL } from '../constants';
import { IXyChartDoorStateData, IXyChartDataItem } from './Details.interface';
import { handleHttpErrors, getDateTimeUri } from './../utils';

export interface IDoorStateDataResponse {
  data: IXyChartDoorStateData[];
  location: string;
}

export interface ITemperatureResponse {
  data: IXyChartDataItem[];
  location: string;
}

export interface IDoorStateStatisticResponse {
  openTime: string;
  closedTime: string;
}

interface IFetchRoomStatisticOptions {
  id: string;
  dateFrom: Date;
  timeFrom: string;
  dateTo: Date;
  timeTo: string;
}

type IFetchRoomTemperatureOptions = IFetchRoomStatisticOptions;
type IFetchDoorStateDataOptions = IFetchRoomStatisticOptions;
export type IDateTimeUriOptions = IFetchRoomStatisticOptions;

export const fetchRooms = (): Promise<string[]> => {
  return fetch(`${API_URL}/rooms`)
    .then(handleHttpErrors)
    .then(res => res.json());
}

export const fetchRoomTemperature = (opts: IFetchRoomTemperatureOptions): Promise<ITemperatureResponse> => {
  const url = `${API_URL}/rooms/${opts.id}/temperatureData?${getDateTimeUri(opts)}`;

  return fetch(url)
    .then(handleHttpErrors)
    .then(res => res.json());
}

export const fetchRoomStatistic = (opts: IFetchRoomStatisticOptions): Promise<IDoorStateStatisticResponse> => {
  const url = `${API_URL}/rooms/${opts.id}/doorStateStatistic?${getDateTimeUri(opts)}`;

  return fetch(url)
    .then(handleHttpErrors)
    .then(res => res.json());
}

export const fetchDoorStateData = (opts: IFetchDoorStateDataOptions): Promise<IDoorStateDataResponse> => {
  const url = `${API_URL}/rooms/${opts.id}/doorStateData?${getDateTimeUri(opts)}`;

  return fetch(url)
    .then(handleHttpErrors)
    .then(res => res.json());
}
