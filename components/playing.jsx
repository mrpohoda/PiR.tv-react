var Playing = React.createClass({
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
	playNext: function(){
		// this is not a nic solution
		// for removing item from firebase we need to know item id
		// if we use bindAsArray, item id is not included so we need to get it from
		// bindAsObject
		// https://github.com/firebase/reactfire/issues/33
		if (this.state.playing[0]) {
			var idToRemove = null;
			var obj = this.state.playingObject;
			for (var property in obj) {
				if (obj.hasOwnProperty(property)) {
					if (obj[property].id === this.state.playing[0].id) {
						idToRemove = property;
					}
				}
			}
			if (idToRemove) {
				var url = 'https://pirtv.firebaseio.com/playing/' + idToRemove;
				var itemToRemove = new Firebase(url);
				itemToRemove.remove();
			}
		}
	},
	render: function(){
		return (
			<div>
				{this.state.playing.length ? 'Playing:' : null}
				<ul>
				{
					this.state.playing.map(function(movie, index) {
						return (
							<li>
								{movie.title}
								{index === 0 ? <div><div onClick={this.playNext} className="button alert">Stop &amp; play next</div></div> : null}
							</li>
						)
					}.bind(this))
				}
				</ul>
			</div>
		)
	}
});