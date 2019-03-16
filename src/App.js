import React, { Component } from 'react';
import Map from './map';

import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mapWidth: 20,
			mapHeight: 8,
			hexRadius: 40
		};
	}

	handleChange(type, value) {
		this.setState({
			[type]: value
		});
	}

  render() {
  	const { mapWidth, mapHeight, hexRadius } = this.state;
  	const handleChange = this.handleChange.bind(this);
    return (
      <div className="App">
      	<label>Map Width: </label>
      	<input type='number' value={mapWidth} onChange={e => handleChange('mapWidth', e.target.value)} />
      	<label>Map Height: </label>
      	<input type='number' value={mapHeight} onChange={e => handleChange('mapHeight', e.target.value)} />
      	<label>Hexagon Size: </label>
      	<input type='number' value={hexRadius} onChange={e => handleChange('hexRadius', e.target.value)} />

        <Map width={mapWidth} height={mapHeight} hexRadius={hexRadius} handleChange={handleChange} />
      </div>
    );
  }
}

export default App;
