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
  dateFrom: Date;
  timeFrom: string;
  dateTo: Date;
  timeTo: string;
}

type IFetchRoomTemperatureOptions = IFetchRoomStatisticOptions;
type IFetchDoorStateDataOptions = IFetchRoomStatisticOptions;
type IDateTimeUriOptions = IFetchRoomStatisticOptions;

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

const getDateTimeUri = (opts: IDateTimeUriOptions): string => {
  const { dateFrom, dateTo } = opts;
  let { timeFrom, timeTo } = opts;

  // native <input type="time"> trims '00:00:00' to '00:00', but BE requires a format with the seconds
  if (timeFrom === '00:00') timeFrom = '00:00:00';
  if (timeTo === '00:00') timeTo = '00:00:00';

  return `startDateTime=${constructDate(dateFrom)}T${timeFrom}.000&endDateTime=${constructDate(dateTo)}T${timeTo}.000`;
}

const padLeft = (n: number) => n < 10 ? `0${n}` : n;

const constructDate = (d: Date): string => {
  return `${d.getFullYear()}-${padLeft(d.getMonth() + 1)}-${padLeft(d.getDate())}`;
}
