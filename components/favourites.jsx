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
		var favourites = this.state.favourites.sort(function(a, b){
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
		return (
			<section className="block-list">
			{
				favourites.map(function(movie) {
					return <Movie movie={movie} onPlay={this.onPlayHandler} />
				}.bind(this))
			}
			</section>
		);
	}
});