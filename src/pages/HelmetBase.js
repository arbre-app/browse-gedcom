import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { name } from '../../package.json';

export const HelmetBase = ({ title, description }) => {
    const intl = useIntl();

    const titleSuffix = name;
    const titleSeparator = '⋅';
    const actualDescription = description !== null ? description : intl.formatMessage({ id: 'page.common.head.description' });
    const actualTitle = `${title !== null ? `${title} ${titleSeparator} ` : ''}${titleSuffix}`;
    return (
        <Helmet>
            <html lang={intl.locale}/>

            <title>
                {actualTitle}
            </title>

            <meta name="language" content={intl.locale}/>
            <meta httpEquiv="content-language" content={intl.locale}/>

            <meta name="description" content={actualDescription} />

            <meta name="twitter:title" content={actualTitle}/>
            <meta name="twitter:description" content={actualDescription}/>

            <meta property="og:title" content={actualTitle}/>
            <meta property="og:description" content={actualDescription}/>
            <meta property="og:site_name" content={name}/>
        </Helmet>
    );
}

HelmetBase.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
};

HelmetBase.defaultProps = {
    title: null,
    description: null,
};
