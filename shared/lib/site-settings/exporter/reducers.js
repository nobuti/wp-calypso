/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import Immutable from 'immutable';
import debugModule from 'debug';

/**
 * Internal dependencies
 */
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

import { States } from './constants';

const debug = debugModule( 'calypso:exporter' );

const initialUIState = Immutable.fromJS( {
	exportingState: States.READY,
	failureReason: null,
	downloadURL: null,
	downloadFilename: null,
	advancedSettings: {
		isVisible: false,
		posts: {
			isEnabled: true
		},
		pages: {
			isEnabled: true
		},
		feedback: {
			isEnabled: true
		}
	}
} );

const initialDataState = Immutable.fromJS( {
	siteId: null,
	advancedSettings: null
} );

/**
 * Reducer for managing the exporter UI
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export function ui( state = initialUIState, action ) {
	switch ( action.type ) {
		case TOGGLE_EXPORTER_SECTION:
			debug( 'toggle section', action.section );
			return state.updateIn( [ 'advancedSettings', action.section, 'isEnabled' ], ( x ) => ( !x ) );

		case TOGGLE_EXPORTER_ADVANCED_SETTINGS:
			debug( 'toggle advanced settings' );
			return state.updateIn( [ 'advancedSettings', 'isVisible' ], ( x ) => ( !x ) );

		case SET_EXPORTER_ADVANCED_SETTING:
			debug( '[TODO] set advanced setting', action );
			const { section, setting, value } = action;
			return state.setIn( [ 'advancedSettings', section, setting ], value );

		case REQUEST_START_EXPORT:
			debug( 'start export', action );
			if ( state.get( 'exportingState' ) === States.READY ||
			     state.get( 'exportingState' ) === States.COMPLETED ||
				   state.get( 'exportingState' ) === States.FAILED ) {
				return state
					.set( 'exportingState', States.STARTING )
					.set( 'downloadURL', null )
					.set( 'downloadFilename', null )
					.set( 'failureReason', null );
			}
			return state;

		case REPLY_START_EXPORT:
			debug( 'reply start export' );
			return state.set( 'exportingState', States.EXPORTING );

		case FAIL_EXPORT:
			debug( 'fail export', action.reason );
			return state
				.set( 'exportingState', States.FAILED )
				.set( 'failureReason', action.reason );

		case COMPLETE_EXPORT:
			debug( 'complete export', action.downloadURL );
			return state
				.set( 'exportingState', States.COMPLETED )
				.set( 'downloadURL', action.downloadURL );
	}

	return state;
}

export function data( state = initialDataState, action ) {
	switch ( action.type ) {
		case REQUEST_EXPORTER_ADVANCED_SETTINGS:
			debug( 'request exporter advanced settings' );
			//return state.set( 'isFetchingSettings', true );
			return state;
		case REPLY_EXPORTER_ADVANCED_SETTINGS:
			debug( 'reply exporter advanced settings', action );
			return state
				.set( 'siteId', action.siteId )
				.set( 'advancedSettings', Immutable.fromJS( action.data ) );
	}

	return state;
}

export default combineReducers( {
	ui,
	data
} );
