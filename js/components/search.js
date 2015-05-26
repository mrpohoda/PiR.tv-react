import React from 'react';

var FluxPlayerActions = require('../actions/FluxPlayerActions');

let Search = React.createClass({
	getInitialState: function() {
		return {userInput: ''};
	},
	handleChange: function(event){
		this.setState({userInput: event.target.value});
	},
	handleSearch: function(){
		var value = this.state.userInput;
		if (value) {
			// perform youtube search
			FluxPlayerActions.searchMovies(value);
			// clear input
			this.setState({userInput: ''});
			// this removes focus and also hides keyboard on mobile devices
			React.findDOMNode(this.refs.searchTextInput).blur();
		}
	},
	handleKeys: function(event){
		// we want to start searching when Enter is pressed
		if (event.keyCode === 13) {
			this.handleSearch();
		}
	},
	render: function(){
		return (
			<div className="large-12">
				<div className="row collapse">
					<div className="row">
						<div className="row collapse">
							<div className="small-10 columns">
								<input
									type="text"
									placeholder="Search movie"
									onKeyUp={this.handleKeys}
									onChange={this.handleChange}
									value={this.state.userInput}
									ref="searchTextInput"
								/>
							</div>
							<div className="small-2 columns">
								<button type="submit" onClick={this.handleSearch} className="button postfix">Go</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});

export default Search;