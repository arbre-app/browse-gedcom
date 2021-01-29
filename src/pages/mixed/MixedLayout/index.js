import { connect } from 'react-redux';
import { MixedLayout as MixedLayoutComponent } from './MixedLayout';

const mapStateToProps = state => ({
    isFileLoaded: !!state.gedcomFile.data,
});

export const MixedLayout = connect(
    mapStateToProps,
    null,
)(MixedLayoutComponent);
