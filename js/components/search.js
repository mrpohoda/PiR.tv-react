import React from 'react';

var FluxPlayerActions = require('../actions/FluxPlayerActions');

let Search = React.createClass({
	getInitialState: function() {
		return {userInput: ''};
	},
	handleChange: function(event){
		this.setState({userInput: event.target.value});
	},
	handleSearch: function(event){
		var value = this.state.userInput;
		if (value) {
			FluxPlayerActions.searchMovies(value);
			this.setState({userInput: ''});
			React.findDOMNode(this.refs.searchTextInput).blur();
		}
	},
	render: function(){
		return (
			<div className="large-12">
				<div className="row collapse">
					<form onSubmit={this.handleSearch}>
						<div className="row">
							<div className="row collapse">
								<div className="small-10 columns">
									<input
										type="text"
										placeholder="Search movie"
										onChange={this.handleChange}
										value={this.state.userInput}
										ref="searchTextInput"
									/>
								</div>
								<div className="small-2 columns">
									<button type="submit" className="button postfix">Go</button>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		)
	}
});

export default Search;