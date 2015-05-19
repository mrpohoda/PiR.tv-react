import React from 'react';

var FluxPlayerActions = require('../actions/FluxPlayerActions');

let Playing = React.createClass({
	playNext: function(){
		FluxPlayerActions.stopMovie(this.props.playing[0]);
	},
	togglePause: function(){
		FluxPlayerActions.pauseMovie(this.props.playing[0]);
	},
	render: function(){
		return (
			<div>
				{this.props.playing.length ? 'Playing:' : null}
				<div>
				{
					this.props.playing.map(function(movie, index) {
						movie.paused = movie.movie.paused || false;
						var pauseButton;
						if (movie.movie.paused) {
							pauseButton = <div onClick={this.togglePause} className="button expand success">Unpause</div>
						}
						else {
							pauseButton = <div onClick={this.togglePause} className="button expand info">Pause</div>
						}
						var playControls = null;
						if (index === 0) {
							playControls = <div className="row collapse">
								<div className="small-6 columns">
									{pauseButton}
								</div>
								<div className="small-6 columns">
									<div><div onClick={this.playNext} className="button expand alert">Stop &amp; play next</div></div>
								</div>
							</div>;
						}
						return (
							<div>
								{movie.movie.title}
								{playControls}
							</div>
						)
					}.bind(this))
				}
				</div>
			</div>
		)
	}
});

export default Playing;