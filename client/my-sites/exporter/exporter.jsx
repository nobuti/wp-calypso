/**
 * External dependencies
 */
import React, { PropTypes } from 'react';

/**
 * Internal dependencies
 */
import FoldableCard from 'components/foldable-card';
import CompactCard from 'components/card/compact';
import Gridicon from 'components/gridicon';
import AdvancedSettings from 'my-sites/exporter/advanced-settings';
import SpinnerButton from './spinner-button';

export default React.createClass( {
	displayName: 'Exporter',

	propTypes: {
		advancedSettings: PropTypes.shape( {
			isVisible: PropTypes.bool.isRequired
		} )
	},

	render: function() {
		return (
			<div className="section-export">
				<FoldableCard
					header={
						<div>
							<h1 className="exporter__title">
								{ this.translate( 'Export your content' ) }
							</h1>
							<h2 className="exporter__subtitle">
								{ this.translate( 'Or select specific content items to export' ) }
							</h2>
						</div>
					}
					summary={
						<SpinnerButton
							className="exporter__export-button"
							loading={ this.props.shouldShowProgress }
							isPrimary={ true }
							onClick={ this.props.startExport }
							text={ this.translate( 'Export' ) }
							loadingText={ this.translate( 'Exporting…' ) } />
					}
					>
					<AdvancedSettings
						{ ...this.props.advancedSettings }
						canStartExport={ this.props.canStartExport }
						shouldShowProgress={ this.props.shouldShowProgress }
						onToggleFieldset={ this.props.toggleSection }
						onClickExport={ this.props.startExport }
						onChangeSetting={ this.props.setAdvancedSetting }
						options={ this.props.options }
					/>
				</FoldableCard>
			</div>
		);
	}
} );
