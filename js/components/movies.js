import React from 'react';
import Movie from './movie.js';

var FluxPlayerActions = require('../actions/FluxPlayerActions');

let Favourites = React.createClass({
	onPlayHandler: function(movie){
		FluxPlayerActions.playMovie(movie);
	},
	render: function(){

		return (
			<section className="block-list">
				<ul>
				{
					this.props.movies.map(function(movie) {
						return <Movie movie={movie.movie} key={movie.key} onPlay={this.onPlayHandler} />
					}.bind(this))
				}
				</ul>
			</section>
		);
	}
});

export default Favourites;