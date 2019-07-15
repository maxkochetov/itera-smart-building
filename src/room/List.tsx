import * as React from 'react';
import { Link } from "react-router-dom";
import { IRoom } from './Details.interface'

export interface RoomListProps {

}

export interface RoomListState {

}

class RoomList extends React.Component<RoomListProps, RoomListState> {
  constructor(props: RoomListProps) {
    super(props);
    this.state = { };
  }
  render() {
    return (
      <div className="row">
        <div className="col-6 offset-3">
          <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            {mockedRooms.map(room =>
              <Link
                to={`/room/${room.id}`}
                key={room.id}
                className="nav-link"
                data-toggle="pill"
                href="#v-pills-home"

                role="tab"
                aria-controls="v-pills-home"
                aria-selected="true">
                {room.name}
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default RoomList;


const mockedRooms: IRoom[] = [
  { id: 1, name: 'Room 1' },
  { id: 2, name: 'Room 2' },
  { id: 3, name: 'Room 3' },
  { id: 4, name: 'Room 4' },
  { id: 5, name: 'Room 5' },
  { id: 6, name: 'Room 6' }
];
