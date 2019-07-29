import React from 'react';

import './App.css';

import RoomDetails from './room/Details';
import RoomList from './room/List';

import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <Router basename={process.env.NODE_ENV === 'development' ? '' : '/itera-smart-building/'}>
      <Route exact path="/" component={RoomList} />
      <Route path="/room/:id" component={RoomDetails} />
    </Router>
  );
}

export default App;
