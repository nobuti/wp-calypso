/**
 * Internal dependencies
 */
import notices from 'notices';

import {
	TOGGLE_EXPORTER_ADVANCED_SETTINGS,
	TOGGLE_EXPORTER_SECTION,
	REQUEST_START_EXPORT,
	REPLY_START_EXPORT,
	FAIL_EXPORT,
	COMPLETE_EXPORT
} from '../action-types';

/**
 * Toggle the visibility of the Advanced Settings panel
 * @return {Function}        Action object
 */
export function toggleAdvancedSettings() {
	return {
		type: TOGGLE_EXPORTER_ADVANCED_SETTINGS
	};
}

/**
 * Toggles whether a section of the export is enabled.
 *
 * @param  {Object} section   The name of the section to toggle - 'posts', 'pages', or 'feedback'
 * @return {Object}           Action object
 */
export function toggleSection( section ) {
	return {
		type: TOGGLE_EXPORTER_SECTION,
		section
	};
}

/**
 * Sends a request to the server to start an export.
 *
 * @return {Function}         Action thunk
 */
export function startExport() {
	return ( dispatch ) => {

		dispatch( {
			type: REQUEST_START_EXPORT
		} );

		// This will be replaced with an API call to start the export
		setTimeout( () => {
			dispatch( replyStartExport() );

			// This will be replaced with polling to check when the export completes
			setTimeout( () => {
				dispatch( completeExport( '#', 'testing-2015-01-01.xml' ) );
				//dispatch( failExport( 'The reason for failure would be displayed here' ) );
			}, 1400 );

		}, 400 );

	}
}

export function replyStartExport() {
	return {
		type: REPLY_START_EXPORT
	}
}


export function failExport( failureReason ) {
	notices.error(
		failureReason,
		{
			button: 'Get Help',
			href: 'http://google.com/?q=heeeelp'
		}
	);

	return {
		type: FAIL_EXPORT,
		reason: failureReason
	}
}

export function completeExport( downloadURL, downloadFilename ) {
	notices.success(
		`Your export was successful! ${downloadFilename} has been created`,
		{
			button: 'Download',
			href: downloadURL
		}
	);

	return {
		type: COMPLETE_EXPORT,
		downloadURL: downloadURL,
		downloadFilename: downloadFilename
	}
}
