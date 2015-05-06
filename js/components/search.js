import React from 'react';

let Search = React.createClass({
	handleOnChange: function (event) {
		var value = event.target.value;
		debugger;
	},
	render: function(){
		return (
			<div>
				<input type="text" placeholder="Search movie" onBlur={this.handleOnChange} />
			</div>
		)
	}
});

export default Search;