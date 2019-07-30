import { API_URL } from '../constants';
import { IXyChartDoorStateData, IXyChartDataItem } from './Details.interface';
import { handleHttpErrors } from './../utils';

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
  dateFrom: string;
  timeFrom: string;
  dateTo: string;
  timeTo: string;
}

type IFetchRoomTemperatureOptions = IFetchRoomStatisticOptions;
type IFetchDoorStateDataOptions = IFetchRoomStatisticOptions;
type IDateTimeUriOptions = IFetchRoomStatisticOptions;

export function fetchRooms(): Promise<string[]> {
  return fetch(`${API_URL}/rooms`)
    .then(handleHttpErrors)
    .then(res => res.json())
    .catch(err => console.error('fetchRooms', err));
}

export const fetchRoomTemperature = (opts: IFetchRoomTemperatureOptions): Promise<ITemperatureResponse> => {
  const url = `${API_URL}/rooms/${opts.id}/temperatureData?${getDateTimeUri(opts)}`;

  return fetch(url)
    .then(handleHttpErrors)
    .then(res => res.json())
    .catch(err => console.error('fetchRoomTemperature', err));
}

export const fetchRoomStatistic = (opts: IFetchRoomStatisticOptions): Promise<IDoorStateStatisticResponse> => {
  const url = `${API_URL}/rooms/${opts.id}/doorStateStatistic?${getDateTimeUri(opts)}`;

  return fetch(url)
    .then(handleHttpErrors)
    .then(res => res.json())
    .catch(err => console.error('fetchRoomStatistic', err));
}

export const fetchDoorStateData = (opts: IFetchDoorStateDataOptions): Promise<IDoorStateDataResponse> => {
  const url = `${API_URL}/rooms/${opts.id}/doorStateData?${getDateTimeUri(opts)}`;

  return fetch(url)
    .then(handleHttpErrors)
    .then(res => res.json())
    .catch(err => console.error('fetchDoorStateData', err));
}

const getDateTimeUri = (opts: IDateTimeUriOptions): string => {
  const { dateFrom, dateTo } = opts;
  let { timeFrom, timeTo } = opts;

  // native <input type="time"> trims '00:00:00' to '00:00', but BE requires a format with the seconds
  if (timeFrom === '00:00') timeFrom = '00:00:00';
  if (timeTo === '00:00') timeTo = '00:00:00';

  return `startDateTime=${dateFrom}T${timeFrom}.000&endDateTime=${dateTo}T${timeTo}.000`;
}
