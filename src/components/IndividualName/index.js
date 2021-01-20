import { connect } from 'react-redux';
import { IndividualName as IndividualNameComponent } from './IndividualName';

const mapStateToProps = state => ({
    ancestors: state.gedcomFile.data.ancestors,
});

export const IndividualName = connect(
    mapStateToProps,
    null,
)(IndividualNameComponent);
