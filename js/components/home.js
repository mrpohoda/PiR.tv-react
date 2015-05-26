import React from 'react';

import MovieStore from '../stores/MovieStore.js';
import PlaylistStore from '../stores/PlaylistStore.js';

import Playing from './playing.js';
import Search from './search.js';
import Movies from './movies.js';
import Categories from './categories.js';

// Method to retrieve state from Stores
function getMoviesState() {
	return {
		movies: MovieStore.getMovies(),
		categories: MovieStore.getCategories(),
		selectedCategory: MovieStore.getSelectedCategory(),
		playing: PlaylistStore.getPlaying()
	};
}

let Home = React.createClass({
	getInitialState() {
		return getMoviesState()
	},

	// Add change listeners to stores
	componentDidMount: function() {
		MovieStore.addChangeListener(this._onChange);
		PlaylistStore.addChangeListener(this._onChange);
	},

	// Remove change listers from stores
	componentWillUnmount: function() {
		MovieStore.removeChangeListener(this._onChange);
		PlaylistStore.removeChangeListener(this._onChange);
	},

	render() {
		return (
			<div className="grid-container">
				<div className="grid-block">
					<div className="grid-content">
						<Playing playing={this.state.playing} />
					</div>
				</div>
				<div className="grid-block">
					<div className="grid-content">
						<Search />
					</div>
				</div>
				<div className="grid-block">
					<div className="grid-content">
						<Categories categories={this.state.categories} category={this.state.selectedCategory} />
						<Movies movies={this.state.movies} category={this.state.selectedCategory} />
					</div>
				</div>
			</div>
		);
	},

	// Method to setState based upon Store changes
	_onChange: function() {
		this.setState(getMoviesState());
	}
});

export default Home;
