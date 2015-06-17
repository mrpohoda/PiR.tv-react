import React from 'react';
import Movie from './movie.js';

let FluxPlayerActions = require('../actions/FluxPlayerActions');

let Favourites = React.createClass({
	onPlayHandler: function(movie){
		FluxPlayerActions.playMovie(movie);
	},
	handleScroll: function() {
		if (!this.props.category) {
			if (document.body.scrollHeight === document.body.scrollTop + window.innerHeight) {
				FluxPlayerActions.showNextPageMovies();
			}
		}
	},
	componentDidMount: function() {
		window.addEventListener('scroll', this.handleScroll);
	},
	componentWillUnmount: function() {
		window.removeEventListener('scroll', this.handleScroll);
	},
	render: function(){

		return (
			<section className="block-list">
				<ul>
				{
					this.props.movies.map(function(movie) {
						return <Movie movie={movie.movie} key={movie.key} onPlay={this.onPlayHandler} categories={this.props.categories} />
					}.bind(this))
				}
				</ul>
			</section>
		);
	}
});

export default Favourites;