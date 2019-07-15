import React from 'react';

import './App.css';

import RoomDetails from './room/Details';
import RoomList from './room/List';

import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="container" style={{ marginTop: '2rem'}}>
        <RoomList />
      </div>

      <Route path="/room/:id" component={RoomDetails} />
    </Router>
  );
}

export default App;
