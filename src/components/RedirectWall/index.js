import { connect } from 'react-redux';
import { RedirectWall as RedirectWallComponent } from './RedirectWall';

const mapStateToProps = state => ({
    isFileLoaded: !!state.gedcomFile.data,
});

export const RedirectWall = connect(
    mapStateToProps,
    null,
)(RedirectWallComponent);
