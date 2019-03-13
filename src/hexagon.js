import React, { Component } from 'react';

class Hexagon extends Component {
	constructor(props){
		super(props);
		this.state = {
			discovered: false
		};
	}

	discover(){
		if(!this.state.discovered){
			this.setState({
				discovered: true
			});
		}
	}

	render(){
		const { discovered } = this.state;
		const { radius, i, j} = this.props;

		const center=[
			100 + i * 1.52 * radius,
			100 + (j * 1.76 + (i%2) * 0.88) * radius
		];

		const discover = this.discover.bind(this);

		let vertices = '';

		for (let i = 0; i < 6; i++) {
			let x = radius * Math.cos(i * Math.PI / 3) + center[0];
			let y = radius * Math.sin(i * Math.PI / 3) + center[1];
			vertices += x+','+y+' ';
		}

		return(
	        <polyline points={vertices} fill={discovered ? '#0f0' : '#000'} onClick={discover}/>
		);
	}
}


export default Hexagon;