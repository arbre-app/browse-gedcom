import { connect } from 'react-redux';
import { PageHome as PageHomeComponent } from './PageHome';

const mapStateToProps = state => ({
    statistics: state.gedcomFile.data.statistics,
});

export const PageHome = connect(
    mapStateToProps,
    null,
)(PageHomeComponent);
