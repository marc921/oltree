import React, { Component } from 'react';

class Hexagon extends Component {
	openMenu() {
		const { openMenu, i, j} = this.props;
		openMenu(i, j);
	}

	render() {
		const { radius, i, j, discovered} = this.props;

		const center=[
			100 + i * 1.52 * radius,
			100 + (j * 1.76 + (i%2) * 0.88) * radius
		];

		const openMenu = this.openMenu.bind(this);

		let vertices = '';

		for (let i = 0; i < 6; i++) {
			let x = center[0] + Math.cos(i * Math.PI / 3) * radius;
			let y = center[1] + Math.sin(i * Math.PI / 3) * radius;
			vertices += x+','+y+' ';
		}	

		return(
			<polyline
      	points={vertices}
      	fill={discovered ? '#0f0' : '#f00'}
      	onClick={openMenu}
      />
		);
	}
}


export default Hexagon;