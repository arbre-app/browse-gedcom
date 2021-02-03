import { connect } from 'react-redux';
import { setRootIndividual } from '../../../state/gedcom/actions';
import { PageIndividual as PageIndividualComponent } from './PageIndividual';

const mapStateToProps = state => ({
    settings: state.gedcomFile.data.settings,
    ancestors: state.gedcomFile.data.ancestors,
    descendants: state.gedcomFile.data.descendants,
    related: state.gedcomFile.data.related,
    topologicalOrdering: state.gedcomFile.data.topologicalOrdering,
    inbreedingMap: state.gedcomFile.data.inbreedingMap,
    relatednessMap: state.gedcomFile.data.relatednessMap,
});

const mapDispatchToProps = dispatch => ({
    setRootIndividual: (root, rootIndividual) => dispatch(setRootIndividual(root, rootIndividual)),
});

export const PageIndividual = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PageIndividualComponent);
