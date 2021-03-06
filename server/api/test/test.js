/**
 * External dependencies
 */
var expect = require( 'chai' ).expect,
	sinon = require( 'sinon' ),
	request = require( 'superagent' ),
	supertest = require( 'supertest' );

/**
 * Internal dependencies
 */
var config = require( 'config' ),
	app = require( '../' )(),
	localRequest = supertest( app );

if ( process.env.NODE_ENV === 'desktop' ) {
	describe( 'api', function() {
		var sandbox = sinon.sandbox.create();

		afterEach( function() {
			sandbox.restore();
		} );

		it( 'should return package version', function( done ) {
			var version = require( '../../../package.json' ).version

			localRequest.get( '/version' )
				.expect( 200, { version: version }, done );
		} );

		it( 'should clear oauth cookie and redirect to login_url', function( done ) {
			localRequest
				.get( '/logout' )
				.redirects( 0 )
				.set( 'cookie', 'wpcom_token=test' )
				.expect( 'location', config( 'login_url' ) )
				.expect( 'set-cookie', 'wpcom_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT' )
				.expect( 302, done );
		} );

		it( 'should handle incomplete login details', function( done ) {
			var end = sandbox.stub( request.Request.prototype, 'end' );
			end.callsArgWithAsync( 0, { status: 400 }, { body: { error: 'invalid_request' } } );

			localRequest
				.post( '/oauth' )
				.end( function( err, res ) {
					expect( res.body.error ).to.equal( 'invalid_request' );
					expect( res.status ).to.equal( 400 );
					done();
				} );
		} );

		it( 'should return a login error with a bad login', function( done ) {
			var end = sandbox.stub( request.Request.prototype, 'end' );
			var response = { error: 'invalid_request' };

			end.callsArgWithAsync( 0, { status: 400 }, { body: response } );

			localRequest
				.post( '/oauth' )
				.send( { username: 'testoauth', password: 'test' } )
				.expect( 400, response, done );
		} );

		it( 'should return a 400 needs_2fa if the user has 2FA enabled', function( done ) {
			var response = { error: 'needs_2fa', error_description: 'Please enter the verification code generated by your Authenticator mobile application.' };
			var end = sandbox.stub( request.Request.prototype, 'end' );

			end.callsArgWithAsync( 0, { status: 400 }, { body: response } );

			localRequest
				.post( '/oauth' )
				.send( { username: 'validuser', password: 'validpassword' } )
				.expect( 400, response, done );
		} );

		it( 'should return a successful login', function( done ) {
			var response = { access_token: '1234' };
			var end = sandbox.stub( request.Request.prototype, 'end' );

			end.callsArgWithAsync( 0, null, { body: response } );

			localRequest
				.post( '/oauth' )
				.send( { username: 'validuser', password: 'validpassword', auth_code: '123456' } )
				.expect( 200, response, done );
		} );

		it( 'should return a 408 with no connection', function( done ) {
			var response = { error: 'invalid_request', error_description: 'The request to localhost failed (code 12345), please check your internet connection and try again.' };
			var end = sandbox.stub( request.Request.prototype, 'end' );

			end.callsArgWithAsync( 0, { host: 'localhost', code: '12345' }, undefined );

			localRequest
				.post( '/oauth' )
				.send( { username: 'validuser', password: 'validpassword' } )
				.expect( 408, response, done );
		} );
	} );
}
