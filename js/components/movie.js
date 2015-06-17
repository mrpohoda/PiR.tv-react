import React from 'react';
import Bookmark from './bookmark.js';

let Movie = React.createClass({
	onPlay: function(e){
		var movie = this.props.movie;
		if (typeof this.props.onPlay === 'function') {
			this.props.onPlay(movie);
		}
	},
	render: function(){
		return (
			<li className="movie with-chevron">
				<div className="row">
					<div className="small-2 medium-1 columns">
						<Bookmark
							movie={this.props.movie}
							categories={this.props.categories}
						></Bookmark>
					</div>
					<div className="small-10 medium-11 columns">
						<a className="clearfix" onClick={this.onPlay}>
							<img src={this.props.movie.preview} />
							<span>{this.props.movie.title}</span>
						</a>
					</div>
				</div>
			</li>
		);
	}
});

export default Movie;