var Favourites = React.createClass({
	mixins: [ReactFireMixin],
	componentWillMount: function() {
		var refFavourites = new Firebase('https://pirtv.firebaseio.com/favourites');
		this.bindAsArray(refFavourites, 'favourites');
		this.refPlaying = new Firebase('https://pirtv.firebaseio.com/playing');
	},
	getInitialState: function() {
		return {
			favourites: []
		};
	},
	onPlayHandler: function(movie){
		this.refPlaying.push(movie);
	},
	render: function(){
		return (
			<section className="block-list">
			{
				this.state.favourites.map(function(movie) {
					return <Movie movie={movie} onPlay={this.onPlayHandler} />
				}.bind(this))
			}
			</section>
		);
	}
});