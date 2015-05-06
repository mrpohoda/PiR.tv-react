import React from 'react';

let Movie = React.createClass({
	onPlay: function(e){
		var movie = this.props.movie;
		if (typeof this.props.onPlay === 'function') {
			this.props.onPlay(movie);
		}
	},
	render: function(){
		return (
			<li className="movie with-chevron" onClick={this.onPlay}>
				<a className="clearfix" href="javascript:">
					<img src={this.props.movie.preview} />
					<span>{this.props.movie.title}</span>
					<br />
					<span className="label">{this.props.movie.category}</span>
				</a>
			</li>
		);
	}
});

export default Movie;