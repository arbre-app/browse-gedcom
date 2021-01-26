import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import { Search, SignpostSplit } from 'react-bootstrap-icons';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Gedcom } from 'read-gedcom';
import { IndividualRich, Paginator } from '../../../components';
import { AppRoutes } from '../../../routes';
import { normalize } from '../../../util';
import { PrivateLayout } from '../PrivateLayout';
import { parse } from 'query-string';

export class PageSearch extends Component {

    searchFuzzy = query => {
        const { file } = this.props;
        const queryParts = normalize(query).split(/ +/);
        const individuals = file.getIndividualRecord(null).array();
        const matches = [];
        if(queryParts.length > 0 && queryParts[0]) { // Ignore empty queries
            for(let i = 0; i < individuals.length; i++) {
                const individual = individuals[i];
                const names = individual.getName().valueAsParts().option();
                if(names) { // Names must not be null nor empty
                    const namesParts = names.filter(v => v !== undefined).map(normalize).flatMap(s => s.split(/ +/));
                    if(queryParts.every(s => namesParts.includes(s))) { // Match
                        matches.push(individual);
                    }
                }
            }
        }
        return matches;
    };

    renderResults = (query, page) => { // TODO async
        const matches = this.searchFuzzy(query);
        const pageSize = 100;
        const currentPageIndex = page - 1;
        const offset = currentPageIndex * pageSize;
        const window = matches.slice(offset, offset + pageSize);
        const total = matches.length;
        const totalPages = Math.ceil(total / pageSize);

        return total > 0 ? (
            <>
                <FormattedMessage
                    id="page.search.n_results"
                    values={{
                        b: chunk => <strong><FormattedNumber value={chunk}/></strong>,
                        total,
                    }}
                />
                <ul>
                    {window.map(individual => (<li key={individual.pointer().one()}><IndividualRich individual={individual} gender simpleDate noPlace simpleRange /></li>))}
                </ul>
                <Paginator
                    pages={totalPages}
                    current={currentPageIndex + 1}
                    link={page => AppRoutes.searchFor(query, page)}
                />
            </>
        ) : (
            <div className="text-center">
                <h5>
                    <SignpostSplit className="icon mr-2"/>
                    <FormattedMessage id="page.search.no_results"/>
                </h5>
                <FormattedMessage id="page.search.try_again"/>
            </div>
        );
    };

    render() {
        const { location: { search } } = this.props;
        const parsed = parse(search);
        const query = parsed.q ? parsed.q : '';
        const page = parsed.p;
        return (
            <PrivateLayout>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <Search className="icon mr-2"/>
                            <FormattedMessage id="page.search.title"/>
                        </Card.Title>
                        <p>
                            <FormattedMessage
                                id="page.search.searching"
                                values={{
                                    b: chunk => <strong>{chunk}</strong>,
                                    query,
                                }}
                            />
                        </p>
                        {this.renderResults(query, page)}
                    </Card.Body>
                </Card>
            </PrivateLayout>
        );
    }
}

PageSearch.propTypes = {
    file: PropTypes.instanceOf(Gedcom).isRequired,
    location: PropTypes.shape({
        search: PropTypes.string.isRequired,
    })
};

PageSearch.defaultProps = {
};
