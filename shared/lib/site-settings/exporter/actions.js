/**
 * Internal dependencies
 */
import notices from 'notices';
import wpcom from 'lib/wp';
import debugModule from 'debug';
import { prepareExportRequest } from './selectors';

const debug = debugModule( 'calypso:exporter' );
const wpcomUndocumented = wpcom.undocumented();

import {
	TOGGLE_EXPORTER_ADVANCED_SETTINGS,
	TOGGLE_EXPORTER_SECTION,
	SET_EXPORTER_ADVANCED_SETTING,

	REQUEST_EXPORTER_ADVANCED_SETTINGS,
	REPLY_EXPORTER_ADVANCED_SETTINGS,

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

export function setAdvancedSetting( section, setting, value ) {
	return {
		type: SET_EXPORTER_ADVANCED_SETTING,
		section,
		setting,
		value
	};
}

/**
 * Request the available settings for customizing an export.
 *
 * @return {Function}         Action thunk
 */
export function requestExportSettings( siteId ) {
	return ( dispatch ) => {

		dispatch( {
			type: REQUEST_EXPORTER_ADVANCED_SETTINGS,
			siteId: siteId
		} );

		wpcomUndocumented.getExportSettings( siteId, ( error, data ) => {
			dispatch( replyExportSettings( siteId, data ) );
		} );
	}
}

export function replyExportSettings( siteId, data ) {
	return {
		type: REPLY_EXPORTER_ADVANCED_SETTINGS,
		siteId: siteId,
		data: data
	};
}

/**
 * Sends a request to the server to start an export.
 *
 * @param {number}    siteId            The ID of the site to export
 * @param {number}    advancedSettings  Advanced settings for the site
 * @return {Function}                   Action thunk
 */
export function startExport( siteId ) {
	return ( dispatch, getState ) => {

		const advancedSettings = prepareExportRequest( getState() );

		dispatch( {
			type: REQUEST_START_EXPORT,
			siteId: siteId,
			advancedSettings: advancedSettings
		} );

		wpcomUndocumented.startExport( siteId, advancedSettings, ( error, data ) => {
			if ( error ) {
				debug( error );
				dispatch( failExport( error.toString() ) );
				return;
			}
			debug( data );

			dispatch( replyStartExport() );

			// Poll for completion of the export
			let poll = ( timeout ) => {
				setTimeout( () => {
					wpcomUndocumented.getExport( siteId, 0, ( error, data ) => {
						if ( error ) {
							dispatch( failExport( error.toString() ) );
						}

						if ( data.status === 'running' ) {
							poll( 500 );
						}

						if ( data.status === 'finished' ) {
							dispatch( completeExport( data.$attachment_url ) );
						}
					} );
				}, timeout );
			}
			poll( 0 );
		} );
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

export function completeExport( downloadURL ) {
	notices.success(
		`Your export was successful! A link for download has been sent to your email`,
		{
			button: 'Download',
			href: downloadURL
		}
	);

	return {
		type: COMPLETE_EXPORT,
		downloadURL: downloadURL
	}
}
