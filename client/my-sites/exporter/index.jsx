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
	canStartExport,
	shouldShowProgress,
	isFailed,
	isComplete
} from 'lib/site-settings/exporter/selectors';

import {
	toggleAdvancedSettings,
	toggleSection,
	startExport
} from 'lib/site-settings/exporter/actions';

function mapStateToProps( state, ownProps ) {
	return {
		site: ownProps.site,
		advancedSettings: state.siteSettings.exporter.ui.toJS().advancedSettings,
		downloadURL: state.siteSettings.exporter.ui.get( 'downloadURL' ),
		downloadFilename: state.siteSettings.exporter.ui.get( 'downloadFilename' ),
		failureReason: state.siteSettings.exporter.ui.get( 'failureReason' ),
		canStartExport: canStartExport( state ),
		shouldShowProgress: shouldShowProgress( state ),
		isFailed: isFailed( state ),
		isComplete: isComplete( state )
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		toggleAdvancedSettings: compose( dispatch, toggleAdvancedSettings ),
		toggleSection: compose( dispatch, toggleSection ),
		startExport: () => startExport()( dispatch )
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( Exporter );
