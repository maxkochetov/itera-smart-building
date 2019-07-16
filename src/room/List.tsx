import * as React from 'react';

import './List.css';
import { Link } from "react-router-dom";
import { IRoom } from './Details.interface'
import { fetchRooms } from './RoomApi.service';
import RoomSearch from './Search';

export interface RoomListProps {}

export interface RoomListState {
  initialRooms: IRoom[];
  rooms: IRoom[];
}

class RoomList extends React.Component<RoomListProps, RoomListState> {
  constructor(props: RoomListProps) {
    super(props);

    this.state = {
      initialRooms: [],
      rooms: []
    };
  }

  componentWillMount() {
    fetchRooms().then(initialRooms => {
      this.setState({
        initialRooms,
        rooms: [...initialRooms]
      });
    });
  }

  filterRooms = (searchTerm: string) => {
    const { initialRooms } = this.state;
    const termLowerCased = searchTerm.toLowerCase();

    const rooms = searchTerm
      ? initialRooms.filter(r => r.name.toLowerCase().startsWith(termLowerCased))
      : initialRooms;

    this.setState({rooms});
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-6 offset-3">
            <RoomSearch onChange={this.filterRooms} />
          </div>
        </div>

        <div className="row">
          <div className="col-6 offset-3">
            <div className="nav flex-column nav-pills c-room-list__list" role="tablist" aria-orientation="vertical">
              {this.state.rooms.map(room =>
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

      </div>
    );
  }
}

export default RoomList;
