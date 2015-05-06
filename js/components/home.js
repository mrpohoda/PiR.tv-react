import React from 'react';
import Playing from './playing.js';
import Search from './search.js';
import Favourites from './favourites.js';

let Home = React.createClass({
	render() {
		return (
			<div className="grid-container">
				<div className="grid-block">
					<div className="grid-content">
						<Playing />
					</div>
				</div>
				{
				/*
				<div className="grid-block">
					<div className="grid-content">
						<Search />
					</div>
				</div>
				*/
				}
				<div className="grid-block">
					<div className="grid-content">
						<Favourites />
					</div>
				</div>
			</div>
		);
	}
});

export default Home;
