var App = React.createClass({
	render: function(){
		return (
			<div className="grid-container">
				<div className="grid-block">
					<div className="grid-content">
						<Playing />
					</div>
				</div>
				<div className="grid-block">
					<div className="grid-content">
						<Search />
					</div>
				</div>
				<div className="grid-block">
					<div className="grid-content">
						<Favourites />
					</div>
				</div>
			</div>
		);
	}
});

React.render(<App/>, document.querySelector('#app'));

