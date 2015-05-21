import React from 'react';

var FluxPlayerActions = require('../actions/FluxPlayerActions');

var selectedCategory;

let Categories = React.createClass({
	setCategory: function(event){
		selectedCategory = event.target.dataset['category'];
		FluxPlayerActions.getMoviesByCategory(selectedCategory);
	},
	render: function(){
		return (
			<section>
				<ul className="inline-list">
				{
					this.props.categories.map(function(category, i){
						var disabled;// = category === selectedCategory;
						return <li
							key={i}
							className="button secondary tiny"
							data-category={category}
							onClick={disabled ? '' : this.setCategory}
							disabled={disabled}
						>{category}</li>
					}.bind(this))
				}
				</ul>
			</section>
		);
	}
});

export default Categories;