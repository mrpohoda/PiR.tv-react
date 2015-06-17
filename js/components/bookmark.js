import React from 'react/addons';
import Modal from 'react-modal';

let FluxPlayerActions = require('../actions/FluxPlayerActions');

let appElement = document.getElementById('app');
Modal.setAppElement(appElement);
Modal.injectCSS();

let Bookmark = React.createClass({
	getInitialState: function() {
		return { modalIsOpen: false };
	},
	openModal: function() {
		this.setState({modalIsOpen: true});
	},
	closeModal: function() {
		this.setState({modalIsOpen: false});
	},
	changeFavourite: function(ev, target) {
		let category = ev.target.value;
		if (category === '') {
			// remove from favourites
			FluxPlayerActions.removeFromFavourites(this.props.movie);
		}
		else {
			if (category === 'new') {
				category = window.prompt('Enter new category');
			}
			// update category
			FluxPlayerActions.addToFavourites({
				movie: this.props.movie,
				category: category
			});
		}
		this.props.movie.category = category;
		this.closeModal();
	},
	render: function(){
		let cx = React.addons.classSet;
		let bookmarkClasses = cx({
			fa: true,
			'fa-2x': true,
			'fa-star': this.props.movie.category,
			'fa-star-o': !this.props.movie.category,
			bookmark: true
		});
		let movie = this.props.movie;
		return (
			<div>
				<span className={bookmarkClasses} onClick={this.openModal}></span>
				<Modal
					isOpen={this.state.modalIsOpen}
					onRequestClose={this.closeModal}
				>
					<select value={movie.category || 'null'} onChange={this.changeFavourite}>
						<option value="new">-- Add new --</option>
						{
							this.props.categories.map(function(category){
								return <option value={category}>{category}</option>
							})
						}
						<option value="null">-- None --</option>
					</select>
					<button onClick={this.closeModal}>close</button>
				</Modal>
			</div>
		);
	}
});

export default Bookmark;