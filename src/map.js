import React, { Component } from 'react';
import Hexagon from './hexagon';

class Map extends Component {
	render(){
		const { width, height, hexRadius } = this.props;
		let map = [];

		for (let i = 0; i < width; i++) {
			let column = [];
			for (let j = 0; j < height; j++) {
				column.push(
					<Hexagon
						radius={hexRadius}
						i={i}
						j={j}
					/>
				);
			}
			map.push(column);
		}

		return(
			<svg
				width	=	{100 + (width + 1) * hexRadius * 2}
				height=	{100 + (height + 1) * hexRadius * 2}
			>
				{map}
	    </svg>
		);
	}
}


export default Map;