import React, { Component } from 'react';

class Hexagon extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hovered: false
		};
	}

	openMenu(event) {
		const { openMenu, i, j } = this.props;
		openMenu(event, i, j);
	}

	handleHover() {
		const { handleHover, i, j } = this.props;
		this.setState({
			hovered: !this.state.hovered
		});
		handleHover(i, j);
	}

	render() {
		const { hovered } = this.state;
		const { radius, i, j, discovered, type, road, connections, village, river, colors } = this.props;
		const roadSize = 0.1, villageSize = 0.3, riverSize = 5;

		const center=[
			100 + i * 1.5 * radius,
			50 + (j * 1.74	 + (i%2) * 0.87) * radius
		];

		const openMenu = this.openMenu.bind(this);
		const handleHover = this.handleHover.bind(this);

		let vertices = '';
		let x,y;
		for (let i = 0; i < 7; i++) {
			x = center[0] + Math.cos(i * Math.PI / 3) * radius;
			y = center[1] + Math.sin(i * Math.PI / 3) * radius;
			vertices += x+','+y+' ';
		}

		let villageVertices = '';
		if (village && discovered) {
			for (let i = 0; i < 7; i++) {
				x = center[0] + Math.cos(i * Math.PI / 3) * radius * villageSize;
				y = center[1] + Math.sin(i * Math.PI / 3) * radius * villageSize;
				villageVertices += x+','+y+' ';
			}
		}

		let roadVertices = '';
		if (road && discovered) {
			for (let i = 0; i < 6; i++) {
				x = center[0] + Math.cos(i * Math.PI / 3) * radius * roadSize;
				y = center[1] + Math.sin(i * Math.PI / 3) * radius * roadSize;
				roadVertices += x+','+y+' ';

				// road connections
				if (connections.includes(i)) {
					x = center[0] + Math.cos(i * Math.PI / 3) * radius * roadSize + Math.cos((2*i+1) * Math.PI / 6) * radius * (0.9 - roadSize);
					y = center[1] + Math.sin(i * Math.PI / 3) * radius * roadSize + Math.sin((2*i+1) * Math.PI / 6) * radius * (0.9 - roadSize);
					roadVertices += x+','+y+' ';
					x = center[0] + Math.cos((i+1) * Math.PI / 3) * radius * roadSize + Math.cos((2*i+1) * Math.PI / 6) * radius * (0.9 - roadSize);
					y = center[1] + Math.sin((i+1) * Math.PI / 3) * radius * roadSize + Math.sin((2*i+1) * Math.PI / 6) * radius * (0.9 - roadSize);
					roadVertices += x+','+y+' ';
				}
			}
		}

		const riverExists = (0 <= river[0] && river[0] < 6 && 0 <= river[1] && river[1] < 6);
		let riverVertices = '';
		if (riverExists && discovered) {
			x = center[0] + Math.cos(river[0] * Math.PI / 3) * radius;
			y = center[1] + Math.sin(river[0] * Math.PI / 3) * radius;
			riverVertices += x+','+y+' ';
			x = center[0] + Math.cos(river[1] * Math.PI / 3) * radius;
			y = center[1] + Math.sin(river[1] * Math.PI / 3) * radius;
			riverVertices += x+','+y+' ';
		}

		return(
			<g>
				<polyline
	      	points={vertices}
	      	fill={discovered ? colors[type] : '#000'}
	      	stroke={hovered ? '#0ff' : '#f00'}
	      	strokeOpacity={hovered ? 1 : 0}
	      	onClick={e => openMenu(e)}
	      	onMouseEnter={handleHover}
	      	onMouseLeave={handleHover}
	      />
		    {riverExists && discovered &&
					<polyline
		      	points={riverVertices}
		      	stroke={'#03a'}
		      	strokeWidth={riverSize}
		      />}
	      {village && discovered &&
					<polyline
		      	points={villageVertices}
		      	fill={'#00a'}
		      	stroke={'#000'}
		      />}
	      {road && discovered &&
					<polyline
		      	points={roadVertices}
		      	fill={'#ff8'}
		      />}
			</g>
		);
	}
}


export default Hexagon;