import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Card, Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import { Bug, Diagram2, HouseDoor, Person, Printer, ThreeDotsVertical } from 'react-bootstrap-icons';
import { FormattedMessage } from 'react-intl';
import { Gedcom } from 'read-gedcom';
import { LinkContainer } from 'react-router-bootstrap';
import { DebugGedcom, EventName, IndividualName, IndividualRich } from '../../../components';
import { AncestorsTreeChart } from '../../../components';
import { AppRoutes } from '../../../routes';
import { displayName, isEventEmpty } from '../../../util';
import { HelmetBase } from '../../HelmetBase';
import { PageNotFound } from '../../mixed';
import { PrivateLayout } from '../PrivateLayout';

export class PageIndividual extends Component {

    renderParents = individual => {
        const familyAsChild = individual.getFamilyAsChild(1); // TODO filter adoptive
        return (
            <>
                <h6><FormattedMessage id="page.individual.parents"/></h6>
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
        const spouseData = (
            <>
                <IndividualRich individual={other} simpleDate noPlace simpleRange />
                {!marriage.isEmpty() && <>{', '}<EventName event={marriage} name={<FormattedMessage id="common.event.married_plural_lower" />} /></>}
            </>
        );
        return hadChildren ? (
            <>
                <FormattedMessage
                    id="page.individual.spouse_with"
                    values={{
                        spouse: spouseData,
                    }}
                />
                <ul>
                    {children.array().map((child, i) =>
                        <li key={i}><IndividualRich individual={child} gender simpleDate noPlace simpleRange /></li>)}
                </ul>
            </>
        ) : spouseData;
    };

    renderUnions = individual => {
        const familiesAsSpouse = individual.getFamilyAsSpouse();
        const orderIfSpecified = individual.getSpouseFamilyLink().value().all();
        if (familiesAsSpouse.isEmpty()) {
            return null;
        } else {
            // Sort the families in the order of the FAMS tags (rather than in the order of their ids)
            const available = Object.fromEntries(familiesAsSpouse.array().map(family => [family.pointer().one(), family]));
            const processed = new Set();
            const ordered = [];
            orderIfSpecified.forEach(id => {
                if(!processed.has(id)) { // Weird but could happen
                    const family = available[id];
                    if(family) {
                        ordered.push(family);
                        processed.add(id);
                    }
                }
            });
            Object.entries(available).forEach(([id, family]) => {
                if(!processed.has(id)) {
                    ordered.push(family);
                }
            });
            return (
                <>
                    <h6><FormattedMessage id="page.individual.unions_children"/></h6>
                    <ul>
                        {ordered.map((family, i) =>
                            <li key={i}>{this.renderUnion(individual, family)}</li>)}
                    </ul>
                </>
            );
        }
    };

    renderGeneral = individual => {
        const birth = individual.getEventBirth(), death = individual.getEventDeath();
        const gender = individual.getSex().value().option();
        const events = [
            { event: birth, name: <FormattedMessage id="common.event.born_upper" values={{ gender }}/>, silent: true },
            { event: death, name: <FormattedMessage id="common.event.deceased_upper" values={{ gender }}/> }
            ].filter(({ event, silent }) => !event.isEmpty() && (!silent || !isEventEmpty(event)));
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
                    <h6><FormattedMessage id="page.individual.siblings"/></h6>
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
                <h6><FormattedMessage id="page.individual.half_siblings"/></h6>
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
                        <FormattedMessage id="page.individual.ancestors_chart.title"/>
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
        const { file, match: { params: { individualId } }, settings: { rootIndividual }, setRootIndividual } = this.props;
        const individualOpt = file.getIndividualRecord(individualId, 1);
        if (individualOpt.isEmpty()) {
            return <PageNotFound/>;
        }
        return (
            <PrivateLayout>
                <HelmetBase title={displayName(individualOpt)}/>
                <Card>
                    <Card.Header>
                        <Card.Title>
                            <Person className="icon mr-2"/>
                            <IndividualName individual={individualOpt} gender noLink />
                            <DropdownButton title={<ThreeDotsVertical className="icon" />} variant="outline-secondary" size="sm" style={{ position: 'absolute', right: '0.5rem', top: '0.5rem' }}>
                                <Dropdown.Item href="#" disabled={individualOpt.pointer().one() === rootIndividual.pointer().one()} onClick={() => setRootIndividual(file, individualOpt)}>
                                    <HouseDoor className="icon mr-2" />
                                    <FormattedMessage id="page.individual.actions.define_root"/>
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <LinkContainer to={{
                                    pathname: AppRoutes.print,
                                    state: { initialIndividualId: individualOpt.pointer().one() },
                                }}>
                                    <Dropdown.Item disabled>
                                        <Printer className="icon mr-2" />
                                        <FormattedMessage id="page.individual.actions.print"/>
                                    </Dropdown.Item>
                                </LinkContainer>
                                <Dropdown.Divider />
                                <DebugGedcom triggerComponent={({ onClick }) =>
                                    <Dropdown.Item href="#" onClick={onClick}>
                                        <Bug className="icon mr-2" />
                                        <FormattedMessage id="page.individual.actions.debug"/>
                                    </Dropdown.Item>
                                } node={individualOpt} />
                            </DropdownButton>
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
    /* Redux */
    settings: PropTypes.object.isRequired,
    setRootIndividual: PropTypes.func.isRequired,
};
