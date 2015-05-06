import React from 'react';
import Movie from './movie.js';

let Favourites = React.createClass({
	mixins: [ReactFireMixin],
	componentWillMount: function() {
		var refFavourites = new Firebase('https://pirtv.firebaseio.com/favourites');
		this.bindAsArray(refFavourites, 'favourites');
		this.refPlaying = new Firebase('https://pirtv.firebaseio.com/playing');
	},
	getInitialState: function() {
		return {
			favourites: [],
			categories: [],
			selectedCategory: null
		};
	},
	onPlayHandler: function(movie){
		this.refPlaying.push(movie);
	},
	sortFavourites: function(items){
		return items.sort(function(a, b){
			if (a.category === undefined) {
				a.category = 'Ostatní';
			}
			if (b.category === undefined) {
				b.category = 'Ostatní';
			}
			if(a.category < b.category) return -1;
			if(a.category > b.category) return 1;
			return 0;
		});
	},
	getCategories: function(items){
		var category,
			categories = [];
		items.forEach(function (value, key) {
			category = value.category;
			if (category && categories.indexOf(category) < 0) {
				categories.push(category);
			}
		});
		return categories;
	},
	setCategory: function(event){
		var category = event.target.dataset['category'];
		this.setState({selectedCategory: category});
	},
	render: function(){
		var favourites = this.sortFavourites(this.state.favourites);
		var categories = this.getCategories(this.state.favourites);
		var selectedCategory = this.state.selectedCategory || categories[0];
		favourites = favourites.filter(function(movie){
			return movie.category === selectedCategory;
		});
		return (
			<div>
				<ul className="inline-list">
				{
					categories.map(function(category){
						return <li className="button small" data-category={category} onClick={this.setCategory}>{category}</li>
					}.bind(this))
				}
				</ul>
				<section className="block-list">
				{
					favourites.map(function(movie) {
						return <Movie movie={movie} onPlay={this.onPlayHandler} />
					}.bind(this))
				}
				</section>
			</div>
		);
	}
});

export default Favourites;