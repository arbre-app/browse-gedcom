import { connect } from 'react-redux';
import { setRootIndividual } from '../../../gedcom/actions';
import { PageIndividual as PageIndividualComponent } from './PageIndividual';

const mapStateToProps = state => ({
    settings: state.gedcomFile.data.settings,
});

const mapDispatchToProps = dispatch => ({
    setRootIndividual: (root, rootIndividual) => dispatch(setRootIndividual(root, rootIndividual)),
});

export const PageIndividual = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PageIndividualComponent);
