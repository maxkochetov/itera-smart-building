import * as React from 'react';

import { Link } from "react-router-dom";
import { fetchRooms } from './RoomApi.service';
import RoomSearch from './Search';

interface RoomListProps {}

interface RoomListState {
  initialRooms: string[];
  rooms: string[];
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
    const rooms = sessionStorage.getItem('rooms');

    if (rooms) {
      this.setRooms(JSON.parse(rooms));
    } else {
      fetchRooms().then(initialRooms => {
        this.setRooms(initialRooms);
        this.cacheRooms(initialRooms);
      });
    }
  }

  setRooms(initialRooms: string[]) {
    this.setState({
      initialRooms,
      rooms: [...initialRooms]
    });
  }

  cacheRooms(initialRooms: string[]) {
    sessionStorage.setItem('rooms', JSON.stringify(initialRooms));
  }

  filterRooms = (searchTerm: string) => {
    const { initialRooms } = this.state;
    const termLowerCased = searchTerm.toLowerCase();

    const rooms = searchTerm
      ? initialRooms.filter(r => r.toLowerCase().indexOf(termLowerCased) > -1)
      : initialRooms;

    this.setState({rooms});
  }

  render(): JSX.Element {
    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-6 offset-3">
            <RoomSearch onChange={this.filterRooms} />
          </div>
        </div>

        <div className="row">
          <div className="col-6 offset-3">
            <div className="list-group mb-5">
            {this.state.rooms.map((room: string) =>
              <Link
                to={`/room/${room}`}
                key={room}
                className="list-group-item list-group-item-action">
                {room}
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
