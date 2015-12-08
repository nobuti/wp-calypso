/**
 * External dependencies
 */
import { connect } from 'react-redux';
import { compose } from 'lodash';

/**
 * Internal dependencies
 */
import Exporter from './exporter';

import {
	getAuthorOptions,
	getStatusOptions,
	getDateOptions,
	getCategoryOptions,
	canStartExport,
	prepareExportRequest,
	shouldShowProgress,
	isFailed,
	isComplete
} from 'lib/site-settings/exporter/selectors';

import {
	toggleAdvancedSettings,
	toggleSection,
	setAdvancedSetting,
	startExport,
	requestExportSettings
} from 'lib/site-settings/exporter/actions';

function mapStateToProps( state, ownProps ) {
	return {
		site: ownProps.site,
		advancedSettings: state.siteSettings.exporter.ui.toJS().advancedSettings,
		options: {
			posts: {
				authors: getAuthorOptions( state, 'post' ),
				statuses: getStatusOptions( state, 'post' ),
				dates: getDateOptions( state, 'post' ),
				categories: getCategoryOptions( state, 'post' )
			},
			pages: {
				authors: getAuthorOptions( state, 'page' ),
				statuses: getStatusOptions( state, 'page' ),
				dates: getDateOptions( state, 'page' )
			}
		},
		downloadURL: state.siteSettings.exporter.ui.get( 'downloadURL' ),
		failureReason: state.siteSettings.exporter.ui.get( 'failureReason' ),
		canStartExport: canStartExport( state ),
		shouldShowProgress: shouldShowProgress( state ),
		isFailed: isFailed( state ),
		isComplete: isComplete( state )
	};
}

let lastSiteId = null;
function mapDispatchToProps( dispatch, ownProps ) {
	// This is working but not very nice, it should be called inside the component
	// mapDispatchToProps should be a pure map with no side-effects
	if ( lastSiteId !== ownProps.site.ID ) {
		lastSiteId = ownProps.site.ID;
		requestExportSettings( ownProps.site.ID )( dispatch );
	}

	return {
		toggleAdvancedSettings: compose( dispatch, toggleAdvancedSettings ),
		toggleSection: compose( dispatch, toggleSection ),
		setAdvancedSetting: compose( dispatch, setAdvancedSetting ),
		startExport: () => dispatch( startExport( ownProps.site.ID ) )
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( Exporter );
