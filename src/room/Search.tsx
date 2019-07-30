import React, { useState } from 'react';

interface RoomSearchProps {
  onChange: (searchTerm: string) => void;
}

export const RoomSearch = ({onChange}: RoomSearchProps): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const searchTermChanged = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    onChange(searchTerm);
  }

  return (
    <div className="form-group">
      <input
        type="text"
        className="form-control"
        value={searchTerm}
        placeholder="Search for a room.."
        onChange={( {target: {value: searchTerm} }) => searchTermChanged(searchTerm) } />
    </div>
  );
}
