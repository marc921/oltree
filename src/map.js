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
		let rivers = new Array(props.width * props.height);
		for (let i = rivers.length - 1; i >= 0; i--) {
			rivers[i] = [0, 0];
		}
		const colors = ['#bc4', '#058', '#642',	'#274d1a', '#1a4', '#eb2'];
		this.state = {
			isMenuOpen: false,
			menuX: -1,
			menuY: -1,
			hi: -1,
			hj: -1,
			notes: new Array(props.width * props.height),
			discovered: new Array(props.width * props.height),
			types: types,
			roads: new Array(props.width * props.height),
			noConnectionRoads: noConnectionRoads,
			villages: new Array(props.width * props.height),
			rivers: rivers,
			mapName: "",
			exportedMap: "",
			importedMapName: "",
			importedMap: "",
			shortcutsEnabled: false,
			colors: colors
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
		const { shortcutsEnabled, hi, hj, rivers } = this.state;
		const { width, height } = this.props;
		if(event.keyCode === 164){	// $
			this.setState({
				shortcutsEnabled: !shortcutsEnabled
			});
		}
		else if (shortcutsEnabled && 0<=hi && hi<width && 0<=hj && hj<height){
			const handleChange = this.handleChange.bind(this);
			const addNoConnectionRoad = this.addNoConnectionRoad.bind(this);
	    switch( event.keyCode ) {
	      case 68: handleChange(2, 'discovered', null, hi, hj, null); break; // d 
	      case 82: handleChange(2, 'roads', null, hi, hj, null); break; // r
	      case 86: handleChange(2, 'villages', null, hi, hj, null); break; // v

	      case 73: handleChange(1, 'types', 0, hi * height + hj, null, null); break; // i
	      case 79: handleChange(1, 'types', 1, hi * height + hj, null, null); break; // o 
	      case 80: handleChange(1, 'types', 2, hi * height + hj, null, null); break; // p 
	      case 75: handleChange(1, 'types', 3, hi * height + hj, null, null); break; // k
	      case 76: handleChange(1, 'types', 4, hi * height + hj, null, null); break; // l
	      case 77: handleChange(1, 'types', 5, hi * height + hj, null, null); break; // m

	      case 97: addNoConnectionRoad(2, hi, hj); break; // 1
	      case 98: addNoConnectionRoad(1, hi, hj); break; // 2
	      case 99: addNoConnectionRoad(0, hi, hj); break; // 3
	      case 100: addNoConnectionRoad(3, hi, hj); break; // 4
	      case 101: addNoConnectionRoad(4, hi, hj); break; // 5
	      case 102: addNoConnectionRoad(5, hi, hj); break; // 6

	      case 65: handleChange(3, 'rivers', this.mod(rivers[hi * height + hj][0] + 1, 6), hi, hj, 0); break;	// a
	      case 90: handleChange(3, 'rivers', this.mod(rivers[hi * height + hj][1] + 1, 6), hi, hj, 1); break;	// z
	      case 81: handleChange(3, 'rivers', this.mod(rivers[hi * height + hj][0] - 1, 6), hi, hj, 0); break;	// q
	      case 83: handleChange(3, 'rivers', this.mod(rivers[hi * height + hj][1] - 1, 6), hi, hj, 1); break;	// s
        default: break;
	    }
		}
	}

	mod (a, b) {
		a = parseInt(a);
		b = parseInt(b);
		while (a < 0) {
			console.log(a+' '+b);
			a += b;
		}
		while (a >= b) {
			a -= b;
		}
		return a;
	}

	// opens menu related to hexagon (i,j)
	openMenu(event, i, j) {
		this.setState({
			isMenuOpen: !this.state.isMenuOpen,
			menuX: event.pageX,
			menuY: event.pageY,
			hi: i,
			hj: j
		});
	}

	handleHover(i, j) {
		if(!this.state.isMenuOpen){
			this.setState({
				hi: i,
				hj: j
			});
		}
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

	addNotes(i, j, e) {
		const { notes } = this.state;
		notes[i * this.props.height + j] = e.target.value;
		this.setState({
			notes: notes
		});
	}


	// save and load map on localStorage
	saveMap() {
		const { mapName, discovered, types, roads, noConnectionRoads, villages, rivers, notes, colors } = this.state;
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
					rivers: rivers,
					notes: notes,
					colors: colors
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
		let defaultRivers = new Array(20 * 8);
		for (let i = defaultRivers.length - 1; i >= 0; i--) {
			defaultRivers[i] = [0, 0];
		}
		const defaultColors = ['#bc4', '#058', '#642',	'#274d1a', '#1a4', '#eb2'];

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
				rivers: defaultRivers,
				notes: new Array(20 * 8),
				colors: defaultColors
			});
		}
		else{
			let { width, height, hexRadius, discovered, types, roads, noConnectionRoads, villages, rivers, notes, colors } = JSON.parse(localStorage.getItem(mapName));
			handleChange('mapWidth', width);
			handleChange('mapHeight', height);
			handleChange('hexRadius', hexRadius);
			this.setState({
				discovered: discovered ? discovered : new Array(20 * 8),
				types: types ? types : defaultTypes,
				roads: roads ? roads : new Array(20 * 8),
				noConnectionRoads: noConnectionRoads ? noConnectionRoads : defaultNoConnectionRoads,
				villages: villages ? villages : new Array(20 * 8),
				rivers: rivers ? rivers : defaultRivers,
				notes: notes,
				colors: colors ? colors : defaultColors
			});
		}
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

	handleChange(type, field, value, i, j, k) {
		const { height } = this.props;
		let newField = this.state[field];
		switch (type) {
			case 0:
				newField = value;
				break;
			case 1:
				newField[i] = value;
				break;
			case 2:
				newField[i * height + j] = !newField[i * height + j];
				break;
			case 3:
				newField[i * height + j][k] = value;
				break;
			default:
				break;
		}
		this.setState({
			[field]: newField
		});
		
	}



	render() {
		const { width, height, hexRadius } = this.props;
		const { isMenuOpen, menuX, menuY, hi, hj, mapName, colors, exportedMap,
						notes, discovered, types, roads, noConnectionRoads, villages, rivers } = this.state;

		const openMenu = this.openMenu.bind(this);
		const handleHover = this.handleHover.bind(this);
		const addNotes = this.addNotes.bind(this);
		const saveMap = this.saveMap.bind(this);
		const loadMap = this.loadMap.bind(this);
		const discoverAll = this.discoverAll.bind(this);
		const importMap = this.importMap.bind(this);
		const handleChange = this.handleChange.bind(this);

		let terrains = ['Plaines', 'Mer', 'Montagnes', 'Forêts', 'Marais', 'Déserts/Collines'];


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
						river={rivers[i * height + j]}
						colors={colors}
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
							<input type='text' placeholder='map_name' value={mapName} onChange={e => handleChange(0, 'mapName', e.target.value, null, null, null)} />
							<button onClick={saveMap}>Save Map</button>
							<button onClick={loadMap}>Load Map</button>
							<select onChange={e => handleChange(0, 'mapName', e.target.value, null, null, null)} >
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
						<div>
							<label>Colors:</label>
							{terrains.map((item, key) => 
								<div key={key}>
									<input type='text' value={colors[key]} onChange={e => handleChange(1, 'colors', e.target.value, key)} />
									<label>{item}</label>
								</div>)}
						</div>
					</div>

					<div className='half-page'>
						<div>
						  <label>Import map from JSON:</label>
						  <input placeholder="map_name" onChange={e => handleChange(0, 'importedMapName', e.target.value, null, null, null)}/>
						  <textarea placeholder="{ ... }" onChange={e => handleChange(0, 'importedMap', e.target.value, null, null, null)}/>
						  <button onClick={importMap}>Add Map</button>
					  </div>
					  <div>
						  <button onClick={() => handleChange(0, 'exportedMap', localStorage.getItem(mapName), null, null, null)}>Export current map to JSON:</button>
						  <textarea placeholder="{ ... }" value={exportedMap} readOnly={true} />
					  </div>
					</div>
				</div>

				<svg
					width	=	{100 + (width + 1) * hexRadius * 2}
					height=	{100 + (height + 1) * hexRadius * 2}
				>
					{map}
		    </svg>
		    {isMenuOpen &&
		    	<div 
		    		className='menu'
			  		style={{
			  			left: menuX+'px',
			  			top: menuY+'px',
			  		}}
			  	>
			  		<span className='menuText'>
			  			i={hi} j={hj}
			  		</span>
			  		<button onClick={() => handleChange(2, 'discovered', null, hi, hj, null)} >
			  			{discovered[hi * height + hj] ? 'Cover' : 'Discover'}
			  		</button>
			  		<select onChange={e => handleChange(1, 'types', e.target.value, hi * height + hj, null, null)} value={types[hi * height + hj]}>
			  			{terrains.map((item, key) =>
			  				<option key={key} value={key}>{item}</option>)}
			  		</select>
			  		{discovered[hi * height + hj] && types[hi * height + hj] != terrains.indexOf('Mer') &&
			  			<div>
				  			<button onClick={() => handleChange(2, 'roads', null, hi, hj, null)} >
					  			{roads[hi * height + hj] ? 'Remove Road' : 'Add Road'}
					  		</button>
					  		<button onClick={() => handleChange(2, 'villages', null, hi, hj, null)} >
					  			{villages[hi * height + hj] ? 'Remove Village' : 'Add Village'}
					  		</button>
					  		<br/>
					  		<label className='menuText'>River:</label>
					  		<input type='number' value={rivers[hi * height + hj][0]} onChange={e => handleChange(3, 'rivers', this.mod(e.target.value, 6), hi, hj, 0)} />
					  		<input type='number' value={rivers[hi * height + hj][1]} onChange={e => handleChange(3, 'rivers', this.mod(e.target.value, 6), hi, hj, 1)} />
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