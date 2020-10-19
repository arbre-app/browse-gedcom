import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Diagram2, Person } from 'react-bootstrap-icons';
import { Gedcom } from 'read-gedcom';
import { DebugGedcom, NormalLink } from '../../../components';
import { AncestorsTreeChart } from '../../../components/AncestorsTreeChart';
import { AppRoutes } from '../../../routes';
import { PageNotFound } from '../../public/PageNotFound';
import { displayEvent, displayName } from '../../../util';

export class PageIndividual extends Component {
    placeholderString = '?';

    renderFullname = individual => displayName(individual, this.placeholderString);

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
                    {children.isEmpty() ?
                        <li key={-1}><em className="text-muted">(no children recorded)</em></li> : null}
                    {children.array().map((child, i) =>
                        <li key={i}>{this.renderIndividualLink(child.option(), true)}</li>)}
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

    renderAncestorsCard = individual => {
        return !individual.getFamilyAsChild().isEmpty() && (
            <Card className="mt-3">
                <Card.Body>
                    <h5>
                        <Diagram2 className="flip-vertical mr-2"/>
                        Ancestors chart
                    </h5>
                    <Row>
                        <Col className="d-none d-lg-block">
                            <AncestorsTreeChart individual={individual.first()} maxDepth={3}/>
                        </Col>
                        <Col className="d-none d-sm-block d-lg-none">
                            <AncestorsTreeChart individual={individual.first()} maxDepth={2}/>
                        </Col>
                        <Col className="d-block d-sm-none">
                            <AncestorsTreeChart individual={individual.first()} maxDepth={1}/>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        );
    };

    render() {
        const { file, match: { params: { individualId } } } = this.props;
        const individualOpt = file.getIndividualRecord(individualId).option();
        if (individualOpt.isEmpty()) {
            return <PageNotFound/>;
        }
        const individual = individualOpt.first();
        return (
            <Container className="mt-4">
                <Card>
                    <Card.Header>
                        <Card.Title>
                            <Person className="mr-1"/>
                            {this.renderFullname(individualOpt)}
                            <DebugGedcom node={individual}
                                         style={{ position: 'absolute', right: '0.5rem', top: '0.5rem' }}/>
                        </Card.Title>
                        <Card.Subtitle className="text-muted text-monospace">
                            {individualId}
                        </Card.Subtitle>
                    </Card.Header>
                    <Card.Body>
                        {this.renderGeneral(individualOpt)}
                        {this.renderParents(individualOpt)}
                        {this.renderUnions(individualOpt)}
                    </Card.Body>
                </Card>

                {this.renderAncestorsCard(individual)}
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
