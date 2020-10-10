import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Gedcom } from 'read-gedcom';
import { PageBrowseFile } from './PageBrowseFile';
import { PageLoadFile } from './PageLoadFile';

export class Page extends Component {
    componentDidMount() {
        const { loadGedcomUrl } = this.props;
        const environment = process.env.NODE_ENV;
        const isDevelopment = !environment || environment === 'development';
        if(isDevelopment) {
            loadGedcomUrl('./test.ged');
        }
    }

    render() {
        const { loading, file, error, loadGedcomFile, clearNotifications } = this.props;
        if (file === null) {
            return <PageLoadFile
                loading={loading}
                error={error}
                loadGedcomFile={loadGedcomFile}
                clearNotifications={clearNotifications}
            />;
        } else {
            return <PageBrowseFile file={file} />;
        }
    }
}

Page.propTypes = {
    /* Redux */
    loading: PropTypes.bool.isRequired,
    file: PropTypes.instanceOf(Gedcom),
    error: PropTypes.string,
    loadGedcomUrl: PropTypes.func.isRequired,
    loadGedcomFile: PropTypes.func.isRequired,
    clearNotifications: PropTypes.func.isRequired,
};

Page.defaultProps = {
    file: null,
    error: null,
};
