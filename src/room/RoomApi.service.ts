import { IRoom } from './Details.interface';

export function fetchRooms(): Promise<IRoom[]> {
  // return fetch('http://example.com/movies.json')
  //   .then(res => res.json())
  //   .then(response => {
  //     console.log(JSON.stringify(response));
  //   })
  //   .catch(err => console.error(err));

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockedRooms);
    }, 350);
  });
}

export const fetchRoomDetails = (id: number): Promise<any> => {
  return Promise.resolve({});
}

const mockedRooms: IRoom[] = [
  { id: 1, name: 'Kevin De Bruyne' },
  { id: 2, name: 'Oleksandr Zinchenko' },
  { id: 3, name: 'Kyle Walker' },
  { id: 4, name: 'Leroy Sané' },
  { id: 5, name: 'Gabriel Jesus' },
  { id: 7, name: 'room 7' },
  { id: 8, name: 'room 8' },
  { id: 9, name: 'room 9' },
  { id: 10, name: 'room 10' },
  { id: 11, name: 'room 11' },
  { id: 12, name: 'room 12' },
  { id: 13, name: 'room 13' },
  { id: 14, name: 'room 14' },
  { id: 15, name: 'room 15' },
  { id: 16, name: 'room 16' },
  { id: 17, name: 'room 17' },
  { id: 18, name: 'room 18' },
  { id: 19, name: 'room 19' }
];
