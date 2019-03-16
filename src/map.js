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
			notes: new Array(props.width * props.height)
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


	render() {
		const { width, height, hexRadius } = this.props;
		const { isMenuOpen, hi, hj, discovered, notes } = this.state;
		const openMenu = this.openMenu.bind(this);
		const discover = this.discover.bind(this);
		const addNotes = this.addNotes.bind(this);
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