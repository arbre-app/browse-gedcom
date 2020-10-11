import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Card, Container } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
import { Gedcom } from 'read-gedcom';
import { NormalLink } from '../../../components';
import { AppRoutes } from '../../../routes';
import { PageNotFound } from '../../public/PageNotFound';

export class PageIndividual extends Component {
    placeholderString = '?';

    renderFullname = individual => {
        const name = individual
            .getName()
            .valueAsParts()
            .filter(v => v !== undefined)
            .map(v => v.filter(s => s).join(' '))[0];
        return name ? name : this.placeholderString;
    };

    renderIndividualLink = individualOpt => {
        if (individualOpt.isEmpty()) {
            return this.placeholderString;
        } else {
            return (
                <NormalLink to={AppRoutes.individualFor(individualOpt.pointer()[0])}>
                    {this.renderFullname(individualOpt)}
                </NormalLink>
            );
        }
    };

    renderParents = individual => {
        const familyAsChild = individual.getFamilyAsChild();
        return (
            <>
                <h6>Parents</h6>
                <ul>
                    <li>{this.renderIndividualLink(familyAsChild.getHusband().getIndividualRecord().option())}</li>
                    <li>{this.renderIndividualLink(familyAsChild.getWife().getIndividualRecord().option())}</li>
                </ul>
            </>
        );
    };

    renderUnion = (individual, family) => {
        const otherRef = family.getHusband().value().some(s => s !== individual.pointer()[0]) ? family.getHusband() : family.getWife();
        const other = otherRef.getIndividualRecord();
        return (
            <>
                With {this.renderIndividualLink(other)}:
                <ul>
                    {family.getChild().getIndividualRecord().array().map((child, i) =>
                        <li key={i}>{this.renderIndividualLink(child.option())}</li>)}
                </ul>
            </>
        );
    };

    renderUnions = individual => {
        const familiesAsSpouse = individual.getFamilyAsSpouse();
        if (familiesAsSpouse.isEmpty()) {
            return null;
        } else {
            return (
                <>
                    <h6>Unions</h6>
                    <ul>
                        {familiesAsSpouse.array().map((family, i) =>
                            <li key={i}>{this.renderUnion(individual, family)}</li>)}
                    </ul>
                </>
            );
        }
    };

    render() {
        const { file, match: { params: { individualId } } } = this.props;
        const individual = file.getIndividualRecord(individualId).option();
        if (individual.isEmpty()) {
            return <PageNotFound />;
        }
        return (
            <Container className="mt-4">
                <Card>
                    <Card.Header>
                        <Card.Title>
                            <Person className="mr-1" />
                            {this.renderFullname(individual)}
                        </Card.Title>
                        <Card.Subtitle className="text-muted text-monospace">
                            {individualId}
                        </Card.Subtitle>
                    </Card.Header>
                    <Card.Body>

                        {this.renderParents(individual)}
                        {this.renderUnions(individual)}
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

PageIndividual.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            individualId: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    file: PropTypes.instanceOf(Gedcom).isRequired,
};
