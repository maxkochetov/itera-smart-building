import { API_URL } from '../constants';
import { IXyChartDoorStateData, IXyChartData } from './Details.interface';

export interface IDoorStateDataResponse {
  data: IXyChartDoorStateData[];
  location: string;
}

export interface ITemperatureResponse {
  data: IXyChartData[];
  location: string;
}

export interface IDoorStateStatisticResponse {
  openTime: string;
  closedTime: string;
}

interface IFetchRoomStatisticOptions {
  id: string;
  dateFrom: string;
  timeFrom: string;
  dateTo: string;
  timeTo: string;
}

type IFetchRoomTemperatureOptions = IFetchRoomStatisticOptions;
type IFetchDoorStateDataOptions = IFetchRoomStatisticOptions;

export function fetchRooms(): Promise<string[]> {
  return fetch(`${API_URL}/rooms`)
    .then(res => res.json())
    .catch(err => console.error(err));
}

export const fetchRoomTemperature = (opts: IFetchRoomTemperatureOptions): Promise<ITemperatureResponse> => {
  const { id, dateFrom, timeFrom, dateTo, timeTo } = opts;

  const url = `${API_URL}/rooms/${id}/temperatureData?startDateTime=${dateFrom}T${timeFrom}.000&endDateTime=${dateTo}T${timeTo}.000`;

  return fetch(url)
    .then(res => res.json())
    .catch(err => console.error('fetchRoomTemperature', err));
}

export const fetchRoomStatistic = (opts: IFetchRoomStatisticOptions): Promise<IDoorStateStatisticResponse> => {
  const { id, dateFrom, timeFrom, dateTo, timeTo } = opts;

  const url = `${API_URL}/rooms/${id}/doorStateStatistic?startDateTime=${dateFrom}T${timeFrom}.000&endDateTime=${dateTo}T${timeTo}.000`;

  return fetch(url)
    .then(res => res.json())
    .catch(err => console.error('fetchRoomStatistic', err));
}

export const fetchDoorStateData = (opts: IFetchDoorStateDataOptions): Promise<IDoorStateDataResponse> => {
  const { id, dateFrom, timeFrom, dateTo, timeTo } = opts;

  const url = `${API_URL}/rooms/${id}/doorStateData?startDateTime=${dateFrom}T${timeFrom}.000&endDateTime=${dateTo}T${timeTo}.000`;

  return fetch(url)
    .then(res => res.json())
    .catch(err => console.error('fetchDoorStateData', err));
}
