import PropTypes from 'prop-types';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export function Paginator({ pages, current, link, window }) {
    const renderItem = page => (
        <LinkContainer to={link(page)} key={page}>
            <Pagination.Item active={page === current}>{page}</Pagination.Item>
        </LinkContainer>
    );

    // eslint-disable-next-line
    const renderEllipsis = () => <Pagination.Ellipsis disabled />;

    const renderArrow = direction => {
        const Component = direction > 0 ? Pagination.Next : direction < 0 ? Pagination.Prev : null;
        const next = current + direction;
        const disabled = next < 1 || next > pages;
        if(disabled) {
            return <Component disabled />
        } else {
            return (
                <LinkContainer to={link(next)}>
                    <Component />
                </LinkContainer>
            )
        }
    };

    const elements = [];
    for(let i = 1; i <= pages; i++) { // Simple procedure for now: display all pages
        elements.push(renderItem(i));
    }

    return (
        <Pagination className="justify-content-center">
            {renderArrow(-1)}
            {elements}
            {renderArrow(1)}
        </Pagination>
    );
}

Paginator.propTypes = {
    pages: PropTypes.number.isRequired,
    current: PropTypes.number.isRequired,
    link: PropTypes.func.isRequired,
    window: PropTypes.number,
};

Paginator.defaultProps = {
    window: 1,
};
