import React from 'react';

var FluxPlayerActions = require('../actions/FluxPlayerActions');

let Categories = React.createClass({
	setCategory: function(event){
		FluxPlayerActions.getMoviesByCategory(event.target.dataset['category']);
	},
	render: function(){
		return (
			<section>
				<ul className="inline-list">
				{
					this.props.categories.map(function(category, i){
						var disabled = category === this.props.category;
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