import React, { Component } from 'react';
import Map from './map';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Map width={20} height={8} hexRadius={50}/>
        </header>
      </div>
    );
  }
}

export default App;