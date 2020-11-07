import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Diagram2, Person } from 'react-bootstrap-icons';
import { Gedcom } from 'read-gedcom';
import { DebugGedcom, NormalLink } from '../../../components';
import { AncestorsTreeChart } from '../../../components/AncestorsTreeChart';
import { AppRoutes } from '../../../routes';
import { PageNotFound } from '../../public/PageNotFound';
import { displayDate, displayEvent, displayName } from '../../../util';
import { PrivateLayout } from '../PrivateLayout';

export class PageIndividual extends Component {
    placeholderString = '?';

    renderFullname = individual => displayName(individual, this.placeholderString);

    renderIndividualLink = (individualOpt, withDates, isDetailed) => {
        if (individualOpt.isEmpty()) {
            return this.placeholderString;
        } else {
            let strEvents;
            if (withDates) {
                const birthOpt = individualOpt.getEventBirth().option();
                const deathOpt = individualOpt.getEventDeath().option();
                if (isDetailed) {
                    const birth = birthOpt.array().map(e => displayEvent(e, 'born', false))[0];
                    const death = deathOpt.array().map(e => displayEvent(e, 'died', true))[0];

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
                    const birth = birthOpt.getDate().option().array().map(e => displayDate(e, true))[0];
                    const death = deathOpt.getDate().option().array().map(e => displayDate(e, true))[0];
                    if (death === undefined) {
                        strEvents = birth;
                    } else {
                        strEvents = `${birth ? birth : this.placeholderString} - ${death ? death : this.placeholderString}`;
                    }
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
                    <li>{this.renderIndividualLink(familyAsChild.getHusband().getIndividualRecord().option(), true, true)}</li>
                    <li>{this.renderIndividualLink(familyAsChild.getWife().getIndividualRecord().option(), true, true)}</li>
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
        const hadChildren = !children.isEmpty();
        const spouseData = <>{this.renderIndividualLink(other, false, undefined)}{strMarriage ? ` (${strMarriage})` : ''}</>;
        return (
            <>
                {hadChildren ? <>With {spouseData}:</> : spouseData}
                {hadChildren && (
                    <ul>
                        {children.array().map((child, i) =>
                            <li key={i}>{this.renderIndividualLink(child.option(), true, false)}</li>)}
                    </ul>
                )}
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

    renderSiblings = individual => {
        const siblings = individual.getFamilyAsChild().option().getChild().getIndividualRecord().filter(s => s.pointer() !== individual.pointer());
        if (siblings.isEmpty()) {
            return null;
        } else {
            return (
                <>
                    <h6>Siblings</h6>
                    <ul>
                        {siblings.array().filter(child => child.pointer() !== individual.pointer()).map((child, i) =>
                            <li key={i}>{this.renderIndividualLink(child.option(), true, false)}</li>)}
                    </ul>
                </>
            );
        }
    };

    renderHalfSiblingSide = (individual, parent) => {
        const originalFamilyId = individual.getFamilyAsChild();
        const otherFamilies = parent.getFamilyAsSpouse().filter(family => family.pointer() !== originalFamilyId.pointer()[0]);
        return !otherFamilies.getChild().getIndividualRecord().isEmpty() && (
            <Col>(not implemented)</Col>
        ); // TODO
    };

    renderHalfSiblings = individual => {
        const familyAsChild = individual.getFamilyAsChild();
        const father = familyAsChild.getHusband().getIndividualRecord().option();
        const mother = familyAsChild.getWife().getIndividualRecord().option();
        const left = this.renderHalfSiblingSide(individual, father),
            right = this.renderHalfSiblingSide(individual, mother);
        return left && right && (
            <>
                <h6>Half-siblings</h6>
                <Row>
                    {left}
                    {right}
                </Row>
            </>
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
            <PrivateLayout>
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
                        {this.renderSiblings(individual)}
                        {/*{this.renderHalfSiblings(individual)}*/}
                    </Card.Body>
                </Card>

                {this.renderAncestorsCard(individual)}
            </PrivateLayout>
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
