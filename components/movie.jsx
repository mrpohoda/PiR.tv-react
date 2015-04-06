var Movie = React.createClass({
	onPlay: function(e){
		var movie = this.props.movie;
		if (typeof this.props.onPlay === 'function') {
			this.props.onPlay(movie);
		}
	},
	render: function(){
		return (
			<li className="with-chevron" onClick={this.onPlay}>
				<a href="javascript:">{this.props.movie.title}</a>
			</li>
		);
	}
});