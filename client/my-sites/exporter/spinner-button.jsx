/**
 * External dependencies
 */
import React, { PropTypes } from 'react';

/**
 * Internal dependencies
 */
import Button from 'components/forms/form-button';
import Spinner from 'components/spinner';

export default React.createClass( {
	displayName: 'SpinnerButton',

	propTypes: {
		loading: PropTypes.bool,

		text: PropTypes.string,
		loadingText: PropTypes.string,
		size: PropTypes.number
	},

	getDefaultProps() {
		return {
			size: 24,
			loading: false
		}
	},

	render() {
		const { loading, text, loadingText, size } = this.props;

		return (
			<div>
				<Button
					disabled={ loading }
					{ ...this.props } >
					{ loading ? loadingText : text }
				</Button>

				{ loading &&
					<Spinner
						size={ size }
						className="exporter__export-spinner" />
				}
			</div>
		);
	}
} );
