import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Card, Container } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
import { Gedcom } from 'read-gedcom';
import { DebugGedcom, NormalLink } from '../../../components';
import { AppRoutes } from '../../../routes';
import { PageNotFound } from '../../public/PageNotFound';
import { displayEvent } from '../../../util';

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

    renderIndividualLink = (individualOpt, isDetailed) => {
        if (individualOpt.isEmpty()) {
            return this.placeholderString;
        } else {
            let strEvents;
            if (isDetailed) {
                const birth = individualOpt.getEventBirth().option().array().map(e => displayEvent(e, 'born', false))[0];
                const death = individualOpt.getEventDeath().option().array().map(e => displayEvent(e, 'died', true))[0];

                if (birth && death) {
                    strEvents = `${birth}, ${death}`;
                } else if (birth) {
                    strEvents = birth;
                } else if (death) {
                    strEvents = death;
                } else {
                    strEvents = '';
                }
            } else {
                strEvents = '';
            }

            return (
                <>
                    <NormalLink to={AppRoutes.individualFor(individualOpt.pointer()[0])}>
                        {this.renderFullname(individualOpt)}
                    </NormalLink>
                    {strEvents ? ` (${strEvents})` : ''}
                </>
            );
        }
    };

    renderParents = individual => {
        const familyAsChild = individual.getFamilyAsChild();
        return (
            <>
                <h6>Parents</h6>
                <ul>
                    <li>{this.renderIndividualLink(familyAsChild.getHusband().getIndividualRecord().option(), true)}</li>
                    <li>{this.renderIndividualLink(familyAsChild.getWife().getIndividualRecord().option(), true)}</li>
                </ul>
            </>
        );
    };

    renderUnion = (individual, family) => {
        const otherRef = family.getHusband().value().some(s => s !== individual.pointer()[0]) ? family.getHusband() : family.getWife();
        const other = otherRef.getIndividualRecord();
        const marriage = family.getEventMarriage().option();
        let strMarriage = '';
        if (!marriage.isEmpty()) {
            strMarriage = displayEvent(marriage, 'married', true);
        }
        const children = family.getChild().getIndividualRecord();
        return (
            <>
                With {this.renderIndividualLink(other, false)}{strMarriage ? ` (${strMarriage})` : ''}:
                <ul>
                    {children.isEmpty() ? <li key={-1}><em className="text-muted">(no children recorded)</em></li> : null}
                    {children.array().map((child, i) => <li key={i}>{this.renderIndividualLink(child.option(), true)}</li>)}
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

    renderGeneral = individual => {
        const birth = individual.getEventBirth().option().array().map(e => displayEvent(e, 'Birth', false));
        const death = individual.getEventDeath().option().array().map(e => displayEvent(e, 'Deceased', true));
        const events = [birth, death].flatMap(e => e).filter(e => e);
        return (
            <ul>
                {events.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
        );
    };

    renderTree = () => {

    };

    render() {
        const { file, match: { params: { individualId } } } = this.props;
        const individual = file.getIndividualRecord(individualId).option();
        if (individual.isEmpty()) {
            return <PageNotFound/>;
        }
        return (
            <Container className="mt-4">
                <Card>
                    <Card.Header>
                        <Card.Title>
                            <Person className="mr-1"/>
                            {this.renderFullname(individual)}
                            <DebugGedcom node={individual.first()} style={{ position: 'absolute', right: '0.5rem', top: '0.5rem' }} />
                        </Card.Title>
                        <Card.Subtitle className="text-muted text-monospace">
                            {individualId}
                        </Card.Subtitle>
                    </Card.Header>
                    <Card.Body>
                        {this.renderGeneral(individual)}
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
