import * as React from 'react';

export interface RoomSearchProps {
  onChange: (searchTerm: string) => void;
}

export interface RoomSearchState {
  searchTerm: string;
}

class RoomSearch extends React.Component<RoomSearchProps, RoomSearchState> {
  constructor(props: RoomSearchProps) {
    super(props);

    this.state = {
      searchTerm: ''
    };
  }

  render(): JSX.Element {
    return (
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search for a room.."
          onChange={ ({target: {value: searchTerm}}) => this.props.onChange(searchTerm) }/>
      </div>
    );
  }
}

export default RoomSearch;
