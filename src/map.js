import React, { Component } from 'react';
import Hexagon from './hexagon';

class Map extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isMenuOpen: false,
			hi: -1,
			hj: -1,
			discovered: new Array(props.width * props.height),
			notes: new Array(props.width * props.height),
			mapName: ""
		};
	}

	// opens menu related to hexagon (i,j)
	openMenu(i, j) {
		this.setState({
			isMenuOpen: !this.state.isMenuOpen,
			hi: i,
			hj: j
		});
	}

	discover(i, j) {
		const { discovered } = this.state;
		const { height } = this.props;
		discovered[i * height + j] = !discovered[i * height + j];
		this.setState({
			discovered: discovered
		});
	}

	addNotes(i, j, e) {
		const { notes } = this.state;
		notes[i * this.props.height + j] = e.target.value;
		this.setState({
			notes: notes
		});
	}

	saveMap() {
		const { mapName, discovered, notes } = this.state;
		const { width, height, hexRadius } = this.props;
		localStorage.setItem(
			mapName,
			JSON.stringify(
				{	width: width,
					height: height,
					hexRadius: hexRadius,
					discovered: discovered,
					notes:notes
				}
			)
		);
	}

	loadMap() {
		const { mapName } = this.state;
		if(localStorage.getItem(mapName) === null){
			this.props.handleChange('mapWidth', 20);
			this.props.handleChange('mapHeight', 8);
			this.props.handleChange('hexRadius', 40);
			this.setState({
				discovered: new Array(20 * 8),
				notes: new Array(20 * 8)
			});
		}
		else{
			const { width, height, hexRadius, discovered, notes } = JSON.parse(localStorage.getItem(mapName));
			this.props.handleChange('mapWidth', width);
			this.props.handleChange('mapHeight', height);
			this.props.handleChange('hexRadius', hexRadius);
			this.setState({
				discovered: discovered,
				notes: notes
			});
		}
	}

	mapNameHandler(e) {
		this.setState({
			mapName: e.target.value
		});
	}

	getMapNames(){

	}

	render() {
		const { width, height, hexRadius } = this.props;
		const { isMenuOpen, hi, hj, discovered, notes, mapName } = this.state;
		const openMenu = this.openMenu.bind(this);
		const discover = this.discover.bind(this);
		const addNotes = this.addNotes.bind(this);
		const saveMap = this.saveMap.bind(this);
		const loadMap = this.loadMap.bind(this);
		const mapNameHandler = this.mapNameHandler.bind(this);
		let map = [];

		for (let i = 0; i < width; i++) {
			let column = [];
			for (let j = 0; j < height; j++) {
				column.push(
					<Hexagon
					 	key={i* height + j}
						radius={hexRadius}
						i={i}
						j={j}
						openMenu={openMenu}
						discovered={discovered[i * height + j]}
					/>
				);
			}
			map.push(column);
		}

		return(
			<div>
				<label>Map Name: </label>
				<input type='text' placeholder='map_name' value={mapName} onChange={e => mapNameHandler(e)} />
				<button onClick={saveMap}>Save Map</button>
				<button onClick={loadMap}>Load Map</button>
				<select onChange={e => mapNameHandler(e)} >
					<option key="" value="">Blank</option>
					{Object.keys(localStorage).map(key =>
						<option key={key} value={key}>{key}</option>
					)}
				</select>
				<svg
					width	=	{100 + (width + 1) * hexRadius * 2}
					height=	{100 + (height + 1) * hexRadius * 2}
				>
					{map}
		    </svg>
		    {isMenuOpen &&
		    	<div 
			  		style={{
			  			position: 'absolute',
			  			left: (100 + hi * 1.52 * hexRadius)+'px',
			  			top: (100 + (hj * 1.76 + (hi%2) * 0.88) * hexRadius)+'px',
			  			display: 'flex',
			  			flexDirection: 'column'
			  		}}
			  	>
			  		<button
			  			onClick={() => discover(hi, hj)}
			  		>
			  			{discovered[hi * height + hj] ? 'Cover' : 'Discover'}
			  		</button>
			  		<textarea
			  			onChange={e => addNotes(hi, hj, e)}
			  			value={notes[hi * height + hj]}
			  		/>
			  			
			  	</div>}
		  </div>
		);
	}
}


export default Map;