import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export class Paginator extends Component {
    renderItem = page => {
        const { link, current } = this.props;
        return (
            <LinkContainer to={link(page)}>
                <Pagination.Item key={page} active={page === current}>{page}</Pagination.Item>
            </LinkContainer>
        )
    }

    renderEllipsis = () => <Pagination.Ellipsis disabled />;

    renderArrow = direction => {
        const { pages, current, link } = this.props;
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
    }

    render() {
        const { pages } = this.props;
        const elements = [];
        for(let i = 1; i <= pages; i++) { // Simple procedure for now: display all pages
            elements.push(this.renderItem(i));
        }

        return (
            <Pagination className="justify-content-center">
                {this.renderArrow(-1)}
                {elements}
                {this.renderArrow(1)}
            </Pagination>
        );
    }
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