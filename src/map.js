import React, { Component } from 'react';
import Hexagon from './hexagon';

class Map extends Component {
	constructor(props) {
		super(props);
		let types = new Array(props.width * props.height);
		for (var i = types.length - 1; i >= 0; i--) {
			types[i] = 0;
		}
		this.state = {
			isMenuOpen: false,
			hi: -1,
			hj: -1,
			notes: new Array(props.width * props.height),
			discovered: new Array(props.width * props.height),
			types: types,
			roads: new Array(props.width * props.height),
			villages: new Array(props.width * props.height),
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

	changeType(e, i, j) {
		const { types } = this.state;
		const { height } = this.props;
		types[i * height + j] = e.target.value;
		this.setState({
			types: types
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

	addRoad(i, j) {
		const { roads } = this.state;
		const { height } = this.props;
		roads[i * height + j] = !roads[i * height + j];
		this.setState({
			roads: roads
		});
	}

	addVillage(i, j) {
		const { villages } = this.state;
		const { height } = this.props;
		villages[i * height + j] = !villages[i * height + j];
		this.setState({
			villages: villages
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
		const { mapName, discovered, types, roads, villages, notes } = this.state;
		const { width, height, hexRadius } = this.props;
		localStorage.setItem(
			mapName,
			JSON.stringify(
				{	width: width,
					height: height,
					hexRadius: hexRadius,
					discovered: discovered,
					types: types,
					roads: roads,
					villages: villages,
					notes:notes
				}
			)
		);
	}

	loadMap() {
		const { mapName } = this.state;
		const { handleChange } = this.props;
		if(localStorage.getItem(mapName) === null){
			handleChange('mapWidth', 20);
			handleChange('mapHeight', 8);
			handleChange('hexRadius', 40);
			this.setState({
				discovered: new Array(20 * 8),
				types: new Array(20 * 8),
				roads: new Array(20 * 8),
				villages: new Array(20 * 8),
				notes: new Array(20 * 8),
			});
		}
		else{
			let { width, height, hexRadius, discovered, types, roads, villages, notes } = JSON.parse(localStorage.getItem(mapName));
			handleChange('mapWidth', width);
			handleChange('mapHeight', height);
			handleChange('hexRadius', hexRadius);
			this.setState({
				discovered: discovered ? discovered : new Array(20 * 8),
				types: types ? types : new Array(20 * 8),
				roads: roads ? roads : new Array(20 * 8),
				villages: villages ? villages : new Array(20 * 8),
				notes: notes
			});
		}
	}

	mapNameHandler(e) {
		this.setState({
			mapName: e.target.value
		});
	}

	render() {
		const { width, height, hexRadius } = this.props;
		const { isMenuOpen, hi, hj, notes, discovered, types, roads, villages, mapName } = this.state;
		const openMenu = this.openMenu.bind(this);
		const addNotes = this.addNotes.bind(this);
		const saveMap = this.saveMap.bind(this);
		const loadMap = this.loadMap.bind(this);
		const mapNameHandler = this.mapNameHandler.bind(this);
		const discover = this.discover.bind(this);
		const changeType = this.changeType.bind(this);
		const addRoad = this.addRoad.bind(this);
		const addVillage = this.addVillage.bind(this);

		// creation of all hexagons
		let map = [];
		for (let i = 0; i < width; i++) {
			let column = [];
			for (let j = 0; j < height; j++) {

				// roads connections: i is the direction where the road should be drawn in
				let connections = [];
				if(roads[(i-1) * height + j]){
					connections.push(2+(i%2));
				}
				if(roads[(i+1) * height + j]){
					connections.push((5+((i+1)%2))%6);
				}
				if(roads[i * height + j-1] && j>0){
					connections.push(4);
				}
				if(roads[i * height + j+1] && j+1<height){
					connections.push(1);
				}
				if((i%2) === 1 && roads[(i-1) * height + j+1] && j+1<height){
					connections.push(2);
				}
				if((i%2) === 1 && roads[(i+1) * height + j+1] && j+1<height){
					connections.push(0);
				}
				if((i%2) === 0 && roads[(i-1) * height + j-1] && j>0){
					connections.push(3);
				}
				if((i%2) === 0 && roads[(i+1) * height + j-1] && j>0){
					connections.push(5);
				}
				
				column.push(
					<Hexagon
						key={i* height + j}
						radius={hexRadius}
						i={i}
						j={j}
						openMenu={openMenu}
						discovered={discovered[i * height + j]}
						type={types[i * height + j]}
						road={roads[i * height + j]}
						connections={connections}
						village={villages[i * height + j]}
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
			  		<span style={{color: 'white', backgroundColor: 'black', textAlign: 'center'}}>
			  			i={hi} j={hj}
			  		</span>
			  		<button onClick={() => discover(hi, hj)} >
			  			{discovered[hi * height + hj] ? 'Cover' : 'Discover'}
			  		</button>
			  		<select onChange={e => changeType(e, hi, hj)} value={types[hi * height + hj]}>
			  			<option value={0}>Plaines</option>
			  			<option value={1}>Mer</option>
			  			<option value={2}>Montagnes</option>
			  			<option value={3}>Forêts</option>
			  			<option value={4}>Marais</option>
			  			<option value={5}>Collines</option>
			  		</select>
			  		{discovered[hi * height + hj] && types[hi * height + hj] != 1 &&
			  			<div>
				  			<button onClick={() => addRoad(hi, hj)} >
					  			{roads[hi * height + hj] ? 'Remove Road' : 'Add Road'}
					  		</button>
					  		<button onClick={() => addVillage(hi, hj)} >
					  			{villages[hi * height + hj] ? 'Remove Village' : 'Add Village'}
					  		</button>
					  	</div>}
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