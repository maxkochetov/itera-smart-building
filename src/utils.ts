import { IDateTimeUriOptions } from "./room/RoomApi.service";

export function handleHttpErrors(response: Response) {
  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(response.statusText);
  }
  return response;
};


export function getDateTimeUri(opts: IDateTimeUriOptions): string {
  const { dateFrom, dateTo } = opts;
  let { timeFrom, timeTo } = opts;

  // native <input type="time"> trims '00:00:00' to '00:00', but BE requires a format with the seconds
  if (timeFrom === '00:00') timeFrom = '00:00:00';
  if (timeTo === '00:00') timeTo = '00:00:00';

  return `startDateTime=${constructDate(dateFrom)}T${timeFrom}.000&endDateTime=${constructDate(dateTo)}T${timeTo}.000`;
}

// private
const padLeft = (n: number): string => n < 10 ? `0${n}` : `${n}`;

const constructDate = (d: Date): string => {
  return `${d.getFullYear()}-${padLeft(d.getMonth() + 1)}-${padLeft(d.getDate())}`;
}
