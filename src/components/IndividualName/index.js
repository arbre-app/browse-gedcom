import { connect } from 'react-redux';
import { IndividualName as IndividualNameComponent } from './IndividualName';

const mapStateToProps = state => ({
    settings: state.gedcomFile.data.settings,
    ancestors: state.gedcomFile.data.ancestors,
    descendants: state.gedcomFile.data.descendants,
});

export const IndividualName = connect(
    mapStateToProps,
    null,
)(IndividualNameComponent);
