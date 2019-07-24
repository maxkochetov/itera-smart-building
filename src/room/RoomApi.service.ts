import { API_URL } from '../constants';

export interface IRoomDoorStateStatisticResponse {
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

export function fetchRooms(): Promise<string[]> {
  return fetch(`${API_URL}/rooms`)
    .then(res => res.json())
    .catch(err => console.error(err));
}

export const fetchRoomTemperature = (opts: IFetchRoomTemperatureOptions): Promise<any> => {
  const { id, dateFrom, timeFrom, dateTo, timeTo } = opts;

  const url = `${API_URL}/rooms/${id}/temperatureData?startDateTime=${dateFrom}T${timeFrom}.000&endDateTime=${dateTo}T${timeTo}.000`;
  return fetch(url)
    .then(res => res.json())
    .then(res => res.data)
    .catch(err => console.error('fetchRoomTemperature', err));
}

export const fetchRoomStatistic = (opts: IFetchRoomStatisticOptions): Promise<IRoomDoorStateStatisticResponse> => {
  const { id, dateFrom, timeFrom, dateTo, timeTo } = opts;

  const url = `${API_URL}/rooms/${id}/doorStateStatistic?startDateTime=${dateFrom}T${timeFrom}.000&endDateTime=${dateTo}T${timeTo}.000`;

  return fetch(url)
    .then(res => res.json())
    .catch(err => console.error('fetchRoomTemperature', err));
}
