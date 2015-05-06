import React from 'react';

let Playing = React.createClass({
	mixins: [ReactFireMixin],
	componentWillMount: function() {
		this.refPlaying = new Firebase('https://pirtv.firebaseio.com/playing');
		this.bindAsArray(this.refPlaying, 'playing');
		// only for removing items from array
		this.bindAsObject(this.refPlaying, 'playingObject');
	},
	getInitialState: function() {
		return {
			playing: []
		};
	},
	getFirstFirebaseItem: function(){
		// this is not a nice solution
		// for removing item from firebase we need to know item id
		// if we use bindAsArray, item id is not included so we need to get it from
		// bindAsObject
		// https://github.com/firebase/reactfire/issues/33
		if (this.state.playing[0]) {
			var id = null;
			var obj = this.state.playingObject;
			for (var property in obj) {
				if (obj.hasOwnProperty(property)) {
					if (obj[property].id === this.state.playing[0].id) {
						id = property;
					}
				}
			}
			if (id) {
				var url = 'https://pirtv.firebaseio.com/playing/' + id;
				return new Firebase(url);
			}
		}
	},
	playNext: function(){
		var item = this.getFirstFirebaseItem();
		if (item) {
			item.remove();
		}
	},
	togglePause: function(){
		var paused = this.state.playing[0].paused || false;
		var item = this.getFirstFirebaseItem();
		if (item) {
			item.update({paused: !paused});
		}
	},
	render: function(){
		return (
			<div>
				{this.state.playing.length ? 'Playing:' : null}
				<div>
				{
					this.state.playing.map(function(movie, index) {
						movie.paused = movie.paused || false;
						var pauseButton;
						if (movie.paused) {
							pauseButton = <div onClick={this.togglePause} className="button expand success">Unpause</div>
						}
						else {
							pauseButton = <div onClick={this.togglePause} className="button expand info">Pause</div>
						}
						var playControls = null;
						if (index === 0) {
							playControls = <div className="row">
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
								{movie.title}
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