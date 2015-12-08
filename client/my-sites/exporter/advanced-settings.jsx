/**
 * External dependencies
 */
import React, { PropTypes } from 'react';

/**
 * Internal dependencies
 */
import OptionFieldset from 'my-sites/exporter/option-fieldset';
import SpinnerButton from './spinner-button';

/**
 * Displays additional options for customising an export
 *
 * Allows the user to select whether Pages, Posts and Feedback are
 * exported. Posts and Pages can also be filtered by Authors, Statuses,
 * and Date.
 */
export default React.createClass( {
	displayName: 'AdvancedSettings',

	propTypes: {
		// Event handlers
		onToggleFieldset: PropTypes.func.isRequired,
		onClickExport: PropTypes.func.isRequired,

		// Data
		canStartExport: PropTypes.bool.isRequired,
		posts: PropTypes.shape( {
			isEnabled: PropTypes.bool.isRequired
		} ),
		pages: PropTypes.shape( {
			isEnabled: PropTypes.bool.isRequired
		} ),
		feedback: PropTypes.shape( {
			isEnabled: PropTypes.bool.isRequired
		} )
	},

	render() {
		const legends = {
			posts: this.translate( 'Posts' ),
			pages: this.translate( 'Pages' ),
			feedback: this.translate( 'Feedback' )
		};
		const defaultLabels = {
			author: 'All Authors',
			status: 'All Statuses',
			startDate: 'Start Date…',
			endDate: 'End Date…',
			category: 'All Categories'
		}
		let buildMenu = ( contentType, setting, optionList ) => {
			return {
				value: this.props[ contentType ][ setting ],
				options: this.props.options[ contentType ][ optionList ],
				defaultLabel: defaultLabels[ setting ],
				onChange: ( e ) => this.props.onChangeSetting( contentType, setting, e.target.value )
			};
		};

		let menus = {
			posts: [
				buildMenu( 'posts', 'author', 'authors' ),
				buildMenu( 'posts', 'status', 'statuses' ),
				buildMenu( 'posts', 'startDate', 'dates' ),
				buildMenu( 'posts', 'endDate', 'dates' ),
				buildMenu( 'posts', 'category', 'categories' )
			],
			pages: [
				buildMenu( 'pages', 'author', 'authors' ),
				buildMenu( 'pages', 'status', 'statuses' ),
				buildMenu( 'pages', 'startDate', 'dates' ),
				buildMenu( 'pages', 'endDate', 'dates' ),
			],
			feedback: []
		};

		const buildOptionProps = key => ( {
			legend: legends[ key ],
			isEnabled: this.props[ key ].isEnabled,
			menus: menus[ key ],
			onToggleEnabled: () => this.props.onToggleFieldset( key )
		} );

		return (
			<div className="exporter__advanced-settings">
				<h1 className="exporter__advanced-settings-title">
					{ this.translate( 'Select Content to Export' ) }
				</h1>
				<p>
					{ this.translate(
						'Use the options below to select specific content ' +
						'types to download. You can deselect Posts, Pages, ' +
						'and Feedback, or filter each by the listed parameters. ' +
						'After making your selection you can download your ' +
						'content in an .xml file.' ) }
				</p>
				<div className="exporter__advanced-settings-row">
					<OptionFieldset { ...buildOptionProps( 'posts' ) } />
					<OptionFieldset { ...buildOptionProps( 'pages' ) } />
					<OptionFieldset { ...buildOptionProps( 'feedback' ) }
						description={ this.translate( 'Survey results etc.' ) }/>
				</div>
				<SpinnerButton
					className="exporter__export-button"
					loading={ this.props.shouldShowProgress }
					isPrimary={ true }
					onClick={ this.props.onClickExport }
					text={ this.translate( 'Export Selected Content' ) }
					loadingText={ this.translate( 'Exporting…' ) } />
			</div>
		);
	}
} );
