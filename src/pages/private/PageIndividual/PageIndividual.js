import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Diagram2, Person } from 'react-bootstrap-icons';
import { Gedcom } from 'read-gedcom';
import { DebugGedcom, EventName, IndividualName, IndividualRich } from '../../../components';
import { AncestorsTreeChart } from '../../../components';
import { isEventEmpty } from '../../../util';
import { PageNotFound } from '../../public';
import { PrivateLayout } from '../PrivateLayout';

export class PageIndividual extends Component {

    renderParents = individual => {
        const familyAsChild = individual.getFamilyAsChild(1); // TODO filter adoptive
        return (
            <>
                <h6>Parents</h6>
                <ul>
                    <li><IndividualRich individual={familyAsChild.getHusband(1).getIndividualRecord(1)} /></li>
                    <li><IndividualRich individual={familyAsChild.getWife(1).getIndividualRecord(1)} /></li>
                </ul>
            </>
        );
    };

    renderUnion = (individual, family) => {
        const otherRef = family.getHusband().value().option() === individual.pointer().one() ? family.getWife() : family.getHusband();
        const other = otherRef.getIndividualRecord();
        const marriage = family.getEventMarriage();
        const children = family.getChild().getIndividualRecord();
        const hadChildren = !children.isEmpty();
        return (
            <>
                {hadChildren && 'With '}
                <IndividualRich individual={other} simpleDate noPlace simpleRange />{!marriage.isEmpty() && <>{', '}<EventName event={marriage} name="married" /></>}
                {hadChildren && ':'}
                {hadChildren && (
                    <ul>
                        {children.array().map((child, i) =>
                            <li key={i}><IndividualRich individual={child} gender simpleDate noPlace simpleRange /></li>)}
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
                    <h6>Unions & children</h6>
                    <ul>
                        {familiesAsSpouse.array().map((family, i) =>
                            <li key={i}>{this.renderUnion(individual, family)}</li>)}
                    </ul>
                </>
            );
        }
    };

    renderGeneral = individual => {
        const birth = individual.getEventBirth(), death = individual.getEventDeath();
        const events = [{ event: birth, name: 'Born', silent: true }, { event: death, name: 'Deceased' }].filter(({ event, silent }) => !event.isEmpty() && (!silent || !isEventEmpty(event)));
        return (
            <ul>
                {events.map(({ event, name, silent }, i) =>
                    <li key={i}><EventName event={event} name={name} nameAlt={silent && ''} /></li>
                )}
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
                            <li key={i}><IndividualRich individual={child} gender simpleDate noPlace simpleRange /></li>)}
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
                            <Person className="icon mr-2"/>
                            <IndividualName individual={individualOpt} gender noLink />
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
