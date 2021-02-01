import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { CardText, Globe2 } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { AVAILABLE_LANGUAGES, getFallbackLanguage } from '../../i18n';

export class ChooseLanguage extends Component {
    render() {
        const { setLanguage, selectedLanguage, ...other } = this.props;
        const currentLanguage = selectedLanguage || getFallbackLanguage();
        return (
            <DropdownButton title={<Globe2 className="icon mr-1" />} variant="outline-info" {...other}>
                <Dropdown.Header>
                    <FormattedMessage id="menu.language.title"/>
                </Dropdown.Header>
                {AVAILABLE_LANGUAGES.map(({ locale, name, iconComponent: IconComponent }) => (
                    <Dropdown.Item
                        href="#"
                        key={locale}
                        onClick={() => setLanguage(locale)}
                        active={locale === currentLanguage}
                    >
                        <IconComponent className="icon mr-2" />
                        {name}
                    </Dropdown.Item>
                ))}
                <Dropdown.Divider />
                <Dropdown.Item href="https://crowdin.com/project/monarbreapp" target="_blank" rel="noreferrer">
                    <CardText className="icon mr-2" />
                    <FormattedMessage id="menu.language.contribute"/>
                </Dropdown.Item>
            </DropdownButton>
        );
    }
}

ChooseLanguage.propTypes = {
    /* Redux */
    setLanguage: PropTypes.func.isRequired,
    selectedLanguage: PropTypes.string,
};

ChooseLanguage.defaultProps = {
    selectedLanguage: null,
};
