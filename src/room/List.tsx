import * as React from 'react';

import { Link } from "react-router-dom";
import { fetchRooms } from './RoomApi.service';
import RoomSearch from './Search';

export interface RoomListProps {}

export interface RoomListState {
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
      ? initialRooms.filter(r => r.toLowerCase().indexOf(termLowerCased) > -1)
      : initialRooms;

    this.setState({rooms});
  }

  render() {
    return (
      <div className="container" style={{ marginTop: '2rem'}}>
        <div className="row">
          <div className="col-6 offset-3">
            <RoomSearch onChange={this.filterRooms} />
          </div>
        </div>

        <div className="row">
          <div className="col-6 offset-3">
            <div className="list-group mb-5">
            {this.state.rooms.map(room =>
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
