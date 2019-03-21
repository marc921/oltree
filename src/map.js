import React, { Component } from 'react';
import Hexagon from './hexagon';

import './App.css';

class Map extends Component {
	constructor(props) {
		super(props);
		let types = new Array(props.width * props.height);
		for (let i = types.length - 1; i >= 0; i--) {
			types[i] = 0;
		}
		let noConnectionRoads = new Array(props.width * props.height);
		for (let i = noConnectionRoads.length - 1; i >= 0; i--) {
			noConnectionRoads[i] = [];
		}
		this.state = {
			isMenuOpen: false,
			hi: -1,
			hj: -1,
			notes: new Array(props.width * props.height),
			discovered: new Array(props.width * props.height),
			types: types,
			roads: new Array(props.width * props.height),
			noConnectionRoads: noConnectionRoads,
			villages: new Array(props.width * props.height),
			mapName: "",
			//import/export
			exportedMap: "",
			importedMapName: "",
			importedMap: ""
		};
	}

	// key listener: enables quick actions on the hovered hexagon
	componentDidMount(){
	    document.addEventListener("keydown", this.handleKeyDown.bind(this));
	}
	componentWillUnmount() {
	    document.removeEventListener("keydown", this.handleKeyDown.bind(this));
	}

	handleKeyDown(event) {
		const { hi, hj } = this.state;
		const { width, height } = this.props;
		if (0<=hi && hi<width && 0<=hj && hj<height){
			const discover = this.discover.bind(this);
			const changeType = this.changeType.bind(this);
			const addRoad = this.addRoad.bind(this);
			const addVillage = this.addVillage.bind(this);
			const addNoConnectionRoad = this.addNoConnectionRoad.bind(this);
	    switch( event.keyCode ) {
	      case 68: // d 
	        discover(hi, hj);
	          break;
	      case 82: // r
	      	addRoad(hi, hj);
	      	break;
	      case 86: // v
	      	addVillage(hi, hj);
	      	break;

	      case 73: // i
	        changeType(0, hi, hj);
	          break;
	      case 79: // o 
	        changeType(1, hi, hj);
	          break;
	      case 80: // p 
	        changeType(2, hi, hj);
	          break;
	      case 75: // k
	        changeType(3, hi, hj);
	          break;
	      case 76: // l
	        changeType(4, hi, hj);
	          break;
	      case 77: // m
	        changeType(5, hi, hj);
	          break;

	      case 97: // 1
	      	addNoConnectionRoad(2, hi, hj);
	      	break;
	      case 98: // 2
	      	addNoConnectionRoad(1, hi, hj);
	      	break;
	      case 99: // 3
	      	addNoConnectionRoad(0, hi, hj);
	      	break;
	      case 100: // 4
	      	addNoConnectionRoad(3, hi, hj);
	      	break;
	      case 101: // 5
	      	addNoConnectionRoad(4, hi, hj);
	      	break;
	      case 102: // 6
	      	addNoConnectionRoad(5, hi, hj);
	      	break;
	        default: 
	          break;
	    }
		}
	}



	// opens menu related to hexagon (i,j)
	openMenu(i, j) {
		this.setState({
			isMenuOpen: !this.state.isMenuOpen,
			hi: i,
			hj: j
		});
	}

	handleHover(i, j) {
		this.setState({
			hi: i,
			hj: j
		});
	}

	changeType(value, i, j) {
		const { types } = this.state;
		const { height } = this.props;
		types[i * height + j] = value;
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

	discoverAll(value) {
		const { discovered } = this.state;
		for (var i = discovered.length - 1; i >= 0; i--) {
			discovered[i] = value;
		}
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

	addNoConnectionRoad(value, i, j) {
		const { noConnectionRoads } = this.state;
		const { height } = this.props;
		let index = noConnectionRoads[i * height + j].indexOf(value);
		if (index > -1) {
		  noConnectionRoads[i * height + j].splice(index, 1);
		}
		else {
			noConnectionRoads[i * height + j].push(value);
		}
		this.setState({
			noConnectionRoads: noConnectionRoads
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


	// save and load map on localStorage
	saveMap() {
		const { mapName, discovered, types, roads, noConnectionRoads, villages, notes } = this.state;
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
					noConnectionRoads: noConnectionRoads,
					villages: villages,
					notes:notes
				}
			)
		);
	}

	loadMap() {
		const { mapName } = this.state;
		const { handleChange } = this.props;

		let defaultTypes = new Array(20 * 8);
		for (let i = defaultTypes.length - 1; i >= 0; i--) {
			defaultTypes[i] = 0;
		}
		let defaultNoConnectionRoads = new Array(20 * 8);
		for (let i = defaultNoConnectionRoads.length - 1; i >= 0; i--) {
			defaultNoConnectionRoads[i] = [];
		}

		if(localStorage.getItem(mapName) === null){
			handleChange('mapWidth', 20);
			handleChange('mapHeight', 8);
			handleChange('hexRadius', 40);
			this.setState({
				discovered: new Array(20 * 8),
				types: defaultTypes,
				roads: new Array(20 * 8),
				noConnectionRoads: defaultNoConnectionRoads,
				villages: new Array(20 * 8),
				notes: new Array(20 * 8),
			});
		}
		else{
			let { width, height, hexRadius, discovered, types, roads, noConnectionRoads, villages, notes } = JSON.parse(localStorage.getItem(mapName));
			handleChange('mapWidth', width);
			handleChange('mapHeight', height);
			handleChange('hexRadius', hexRadius);
			this.setState({
				discovered: discovered ? discovered : new Array(20 * 8),
				types: types ? types : defaultTypes,
				roads: roads ? roads : new Array(20 * 8),
				noConnectionRoads: noConnectionRoads ? noConnectionRoads : defaultNoConnectionRoads,
				villages: villages ? villages : new Array(20 * 8),
				notes: notes
			});
		}
	}

	handleChange(type, value) {
		this.setState({
			[type]: value
		});
	}

	// import/export
	exportMap() {
		this.setState({
			exportedMap: localStorage.getItem(this.state.mapName)
		});
	}

	importMap() {
		const { importedMapName, importedMap } = this.state;
		if(importedMapName === null || importedMapName === "") {
			alert("Imported map has no name!");
		}
		else {
			localStorage.setItem(
				importedMapName,
				importedMap
			);
			document.location.reload();
		}
	}


	render() {
		const { width, height, hexRadius } = this.props;
		const { isMenuOpen, hi, hj, notes, discovered, types, roads, noConnectionRoads, villages, mapName } = this.state;
		const openMenu = this.openMenu.bind(this);
		const handleHover = this.handleHover.bind(this);
		const addNotes = this.addNotes.bind(this);
		const saveMap = this.saveMap.bind(this);
		const loadMap = this.loadMap.bind(this);
		const handleChange = this.handleChange.bind(this);
		const discover = this.discover.bind(this);
		const discoverAll = this.discoverAll.bind(this);
		const changeType = this.changeType.bind(this);
		const addRoad = this.addRoad.bind(this);
		const addVillage = this.addVillage.bind(this);
		const exportMap = this.exportMap.bind(this);
		const importMap = this.importMap.bind(this);


		// creation of all hexagons
		let map = [];
		for (let i = 0; i < width; i++) {
			let column = [];
			for (let j = 0; j < height; j++) {

				// roads connections: i is the direction where the road should be drawn in
				let connections = [];
				if(roads[(i-1) * height + j] && !noConnectionRoads[i * height + j].includes(2+(i%2))){
					connections.push(2+(i%2));
				}
				if(roads[(i+1) * height + j] && !noConnectionRoads[i * height + j].includes((5+((i+1)%2))%6)){
					connections.push((5+((i+1)%2))%6);
				}
				if(roads[i * height + j-1] && j>0 && !noConnectionRoads[i * height + j].includes(4)){
					connections.push(4);
				}
				if(roads[i * height + j+1] && j+1<height && !noConnectionRoads[i * height + j].includes(1)){
					connections.push(1);
				}
				if((i%2) === 1 && roads[(i-1) * height + j+1] && j+1<height && !noConnectionRoads[i * height + j].includes(2)){
					connections.push(2);
				}
				if((i%2) === 1 && roads[(i+1) * height + j+1] && j+1<height && !noConnectionRoads[i * height + j].includes(0)){
					connections.push(0);
				}
				if((i%2) === 0 && roads[(i-1) * height + j-1] && j>0 && !noConnectionRoads[i * height + j].includes(3)){
					connections.push(3);
				}
				if((i%2) === 0 && roads[(i+1) * height + j-1] && j>0 && !noConnectionRoads[i * height + j].includes(5)){
					connections.push(5);
				}
				
				column.push(
					<Hexagon
						key={i* height + j}
						radius={hexRadius}
						i={i}
						j={j}
						openMenu={openMenu}
						handleHover={handleHover}
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
				<div className='two-columns-page'>

					<div className='half-page'>
						<div>
							<label>Current Map: </label>
							<input type='text' placeholder='map_name' value={mapName} onChange={e => handleChange('mapName', e.target.value)} />
							<button onClick={saveMap}>Save Map</button>
							<button onClick={loadMap}>Load Map</button>
							<select onChange={e => handleChange('mapName', e.target.value)} >
								<option key="" value="">Blank</option>
								{Object.keys(localStorage).map(key =>
									<option key={key} value={key}>{key}</option>
								)}
							</select>
						</div>
						<div>
							<button onClick={() => discoverAll(true)}>Discover All</button>
							<button onClick={() => discoverAll(false)}>Cover All</button>
						</div>
					</div>

					<div className='half-page'>
						<div>
						  <label>Import map from JSON:</label>
						  <input placeholder="map_name" onChange={e => handleChange('importedMapName', e.target.value)}/>
						  <textarea placeholder="{ ... }" onChange={e => handleChange('importedMap', e.target.value)}/>
						  <button onClick={importMap}>Add Map</button>
					  </div>
					  <div>
						  <button onClick={exportMap}>Export current map to JSON:</button>
						  <textarea placeholder="{ ... }" value={this.state.exportedMap} readOnly={true} />
					  </div>
					</div>
				</div>

				<svg onMouseLeave={() => handleHover(-1,-1)}
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
			  		<select onChange={e => changeType(e.target.value, hi, hj)} value={types[hi * height + hj]}>
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