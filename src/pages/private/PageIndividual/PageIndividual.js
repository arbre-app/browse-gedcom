import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Diagram2, Person } from 'react-bootstrap-icons';
import { Gedcom } from 'read-gedcom';
import { DebugGedcom, NormalLink } from '../../../components';
import { AncestorsTreeChart } from '../../../components';
import { AppRoutes } from '../../../routes';
import { PageNotFound } from '../../public';
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
                const birthOpt = individualOpt.getEventBirth(1);
                const deathOpt = individualOpt.getEventDeath(1);
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
                    const birth = birthOpt.getDate(1).array().map(e => displayDate(e, true))[0];
                    const death = deathOpt.getDate(1).array().map(e => displayDate(e, true))[0];
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
                    <NormalLink to={AppRoutes.individualFor(individualOpt.pointer().one())}>
                        {this.renderFullname(individualOpt)}
                    </NormalLink>
                    {strEvents ? ` (${strEvents})` : ''}
                </>
            );
        }
    };

    renderParents = individual => {
        const familyAsChild = individual.getFamilyAsChild(1); // TODO filter adoptive
        return (
            <>
                <h6>Parents</h6>
                <ul>
                    <li>{this.renderIndividualLink(familyAsChild.getHusband(1).getIndividualRecord(1), true, true)}</li>
                    <li>{this.renderIndividualLink(familyAsChild.getWife(1).getIndividualRecord(1), true, true)}</li>
                </ul>
            </>
        );
    };

    renderUnion = (individual, family) => {
        const otherRef = family.getHusband().value().option() === individual.pointer().one() ? family.getWife() : family.getHusband();
        const other = otherRef.getIndividualRecord();
        const marriage = family.getEventMarriage(1);
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
                            <li key={i}>{this.renderIndividualLink(child, true, false)}</li>)}
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
        const birth = individual.getEventBirth(1).array().map(e => displayEvent(e, 'Birth', false));
        const death = individual.getEventDeath(1).array().map(e => displayEvent(e, 'Deceased', true));
        const events = [birth, death].flatMap(e => e).filter(e => e);
        return (
            <ul>
                {events.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
        );
    };

    renderSiblings = individual => {
        const siblings = individual.getFamilyAsChild(1).getChild().getIndividualRecord().filter(s => s.pointer().one() !== individual.pointer().one());
        if (siblings.isEmpty()) {
            return null;
        } else {
            return (
                <>
                    <h6>Siblings</h6>
                    <ul>
                        {siblings.array().filter(child => child.pointer().one() !== individual.pointer().one()).map((child, i) =>
                            <li key={i}>{this.renderIndividualLink(child, true, false)}</li>)}
                    </ul>
                </>
            );
        }
    };

    renderHalfSiblingSide = (individual, parent) => {
        const originalFamilyId = individual.getFamilyAsChild();
        const otherFamilies = parent.getFamilyAsSpouse().filter(family => family.pointer().one() !== originalFamilyId.pointer().option());
        return !otherFamilies.getChild().getIndividualRecord().isEmpty() && (
            <Col>(not implemented)</Col>
        ); // TODO
    };

    renderHalfSiblings = individual => {
        const familyAsChild = individual.getFamilyAsChild();
        const father = familyAsChild.getHusband().getIndividualRecord(1);
        const mother = familyAsChild.getWife().getIndividualRecord(1);
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
                        <Diagram2 className="icon flip-vertical mr-2"/>
                        Ancestors chart
                    </h5>
                    <Row>
                        <Col className="d-none d-lg-block">
                            <AncestorsTreeChart individual={individual} maxDepth={3}/>
                        </Col>
                        <Col className="d-none d-sm-block d-lg-none">
                            <AncestorsTreeChart individual={individual} maxDepth={2}/>
                        </Col>
                        <Col className="d-block d-sm-none">
                            <AncestorsTreeChart individual={individual} maxDepth={1}/>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        );
    };

    render() {
        const { file, match: { params: { individualId } } } = this.props;
        const individualOpt = file.getIndividualRecord(individualId, 1);
        if (individualOpt.isEmpty()) {
            return <PageNotFound/>;
        }
        return (
            <PrivateLayout>
                <Card>
                    <Card.Header>
                        <Card.Title>
                            <Person className="icon mr-1"/>
                            {this.renderFullname(individualOpt)}
                            <DebugGedcom node={individualOpt}
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
                        {this.renderSiblings(individualOpt)}
                        {/*{this.renderHalfSiblings(individual)}*/}
                    </Card.Body>
                </Card>

                {this.renderAncestorsCard(individualOpt)}
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
