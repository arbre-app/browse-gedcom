import { Dropdown, DropdownButton } from 'react-bootstrap';
import { CardText, Globe2 } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { AVAILABLE_LANGUAGES, getFallbackLanguage } from '../i18n';
import { setLanguage } from '../i18n/state/actions';

export function ChooseLanguage({ ...other }) {
    const { data: selectedLanguage } = useSelector(state => state.language);
    const dispatch = useDispatch();
    const setLanguageDispatch = locale => dispatch(setLanguage(locale));
    const currentLanguage = selectedLanguage || getFallbackLanguage();
    return (
        <DropdownButton title={<Globe2 className="icon mr-1" />} variant="outline-info" {...other}>
            <Dropdown.Header>
                <FormattedMessage id="menu.language.title" />
            </Dropdown.Header>
            {AVAILABLE_LANGUAGES.map(({ locale, name, iconComponent: IconComponent }) => (
                <Dropdown.Item
                    href="#"
                    key={locale}
                    onClick={() => setLanguageDispatch(locale)}
                    active={locale === currentLanguage}
                >
                    <IconComponent className="icon mr-2" />
                    {name}
                </Dropdown.Item>
            ))}
            <Dropdown.Divider />
            <Dropdown.Item href="https://crowdin.com/project/monarbreapp" target="_blank" rel="noreferrer">
                <CardText className="icon mr-2" />
                <FormattedMessage id="menu.language.contribute" />
            </Dropdown.Item>
        </DropdownButton>
    );
}
