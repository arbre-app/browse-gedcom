import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Badge, Button, Card, Col, Dropdown, DropdownButton, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import {
    Bug,
    CalendarWeek, Cpu,
    Diagram2,
    HouseDoor,
    Percent,
    Person,
    Printer,
    ThreeDotsVertical,
} from 'react-bootstrap-icons';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { GedcomTag, GedcomSelection, GedcomValue } from 'read-gedcom';
import { LinkContainer } from 'react-router-bootstrap';
import { DebugGedcom, EventName, IndividualName, IndividualRich } from '../../../components';
import { AncestorsTreeChart } from '../../../components';
import { AppRoutes } from '../../../routes';
import {
    computeAncestors,
    computeDescendants,
    computeInbreedingCoefficient, computeRelated, computeRelatednessCoefficient,
    displayDate,
    displayName,
    isEventEmpty, setIntersectionSize,
} from '../../../util';
import { HelmetBase } from '../../HelmetBase';
import { PageNotFound } from '../../mixed';
import { PrivateLayout } from '../PrivateLayout';
import { StatisticsProxy } from './StatisticsProxy';

export class PageIndividual extends Component {

    renderParents = individual => {
        const familyAsChild = individual.getFamilyAsChild(); // TODO filter adoptive
        return (
            <>
                <h6><FormattedMessage id="page.individual.parents"/></h6>
                <ul>
                    <li><IndividualRich individual={familyAsChild.getHusband().getIndividualRecord()} /></li>
                    <li><IndividualRich individual={familyAsChild.getWife().getIndividualRecord()} /></li>
                </ul>
            </>
        );
    };

    renderUnion = (individual, family) => {
        const otherRef = family.getHusband().value()[0] === individual[0].pointer ? family.getWife() : family.getHusband();
        const other = otherRef.getIndividualRecord();
        const marriage = family.getEventMarriage();
        const children = family.getChild().getIndividualRecord();
        const hadChildren = children.length > 0;
        const spouseData = (
            <>
                <IndividualRich individual={other} simpleDate noPlace simpleRange />
                {!marriage.length === 0 && <>{', '}<EventName event={marriage} name={<FormattedMessage id="common.event.married_plural_lower" />} /></>}
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
                    {children.arraySelect().map((child, i) =>
                        <li key={i}><IndividualRich individual={child} gender simpleDate noPlace simpleRange /></li>)}
                </ul>
            </>
        ) : spouseData;
    };

    renderUnions = (individual, familiesFilter = _ => true, title = true) => {
        const familiesAsSpouse = individual.getFamilyAsSpouse().filterSelect(familiesFilter);
        const orderIfSpecified = individual.getSpouseFamilyLink().value();
        if (familiesAsSpouse.length === 0) {
            return null;
        } else {
            // Sort the families in the order of the FAMS tags (rather than in the order of their ids)
            const available = Object.fromEntries(familiesAsSpouse.arraySelect().map(family => [family[0].pointer, family]));
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
                    {title && <h6><FormattedMessage id="page.individual.unions_children"/></h6>}
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
        const occupationValue = individual.getAttributeOccupation().value().filter(s => s).join(', ');
        const gender = individual.getSex().value()[0];
        const events = [
            { event: birth, name: <FormattedMessage id="common.event.born_upper" values={{ gender }}/>, silent: true },
            { event: death, name: <FormattedMessage id="common.event.deceased_upper" values={{ gender }}/> }
        ].filter(({ event, silent }) => event.length > 0 && (!silent || !isEventEmpty(event)));
        return (
            <ul>
                {events.map(({ event, name, silent }, i) =>
                    <li key={i}><EventName event={event} name={name} nameAlt={silent && ''} /></li>
                )}
                {occupationValue && <li>{occupationValue}</li>}
            </ul>
        );
    };

    renderSiblings = individual => {
        const siblings = individual.getFamilyAsChild().getChild().getIndividualRecord().filter(s => s.pointer !== individual[0].pointer);
        if (siblings.length === 0) {
            return null;
        } else {
            return (
                <>
                    <h6><FormattedMessage id="page.individual.siblings"/></h6>
                    <ul>
                        {siblings.filter(child => child.pointer !== individual[0].pointer).arraySelect().map((child, i) =>
                            <li key={i}><IndividualRich individual={child} gender simpleDate noPlace simpleRange /></li>)}
                    </ul>
                </>
            );
        }
    };

    renderHalfSiblingSide = (individual, parent) => {
        const originalFamilyId = individual.getFamilyAsChild().pointer()[0];
        const filter = family => family.pointer()[0] !== originalFamilyId && family.getChild().getIndividualRecord().length > 0;
        return parent.getFamilyAsSpouse().filterSelect(filter).length > 0 && (
            <Col>
                <FormattedMessage id="page.individual.on_the_side" values={{ parent: <IndividualName individual={parent} /> }}/>
                {this.renderUnions(parent, filter, false)}
            </Col>
        );
    };

    renderHalfSiblings = individual => {
        const familyAsChild = individual.getFamilyAsChild();
        const father = familyAsChild.getHusband().getIndividualRecord();
        const mother = familyAsChild.getWife().getIndividualRecord();
        const left = this.renderHalfSiblingSide(individual, father),
            right = this.renderHalfSiblingSide(individual, mother);
        return (left || right) && (
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
        return individual.getFamilyAsChild().length > 0 && (
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

    renderTimelineEvent = (event, i, translationKey) => {
        const value = event.value()[0];
        const date = event.getDate().length > 0 && displayDate(event.getDate());
        const place = event.getPlace().value().map(place => place.split(',').map(s => s.trim()).filter(s => s)).map(parts => parts.join(', '))[0];
        const type = event[0].tag === GedcomTag.Event && event.getType().value()[0];
        return (
            <li key={i}>
                <div>
                    <span className="small-header">
                        <FormattedMessage id={`common.event.title.${translationKey}`}/>
                    </span>
                    {type && (
                        <>
                            {' - '}
                            {type}
                        </>
                    )}
                    {date && (
                        <span className="text-muted">
                            {', '}
                            {date}
                        </span>
                    )}
                </div>
                {value && value !== GedcomValue.Event.Yes && (
                    <div>
                        {value}
                    </div>
                )}
                {place && (
                    <div>
                        <span className="text-muted">
                            {place}
                        </span>
                    </div>
                )}
            </li>
        );
    };

    renderTimelineCard = individual => {
        const eventsWithKeys = {
            [GedcomTag.Birth]: 'birth',
            [GedcomTag.Christening]: 'christening',
            [GedcomTag.Death]: 'death',
            [GedcomTag.Burial]: 'burial',
            [GedcomTag.Cremation]: 'cremation',
            [GedcomTag.Adoption]: 'adoption',
            [GedcomTag.Baptism]: 'baptism',
            [GedcomTag.BarMitzvah]: 'bar_mitzvah',
            [GedcomTag.BatMitzvah]: 'bat_mitzvah',
            [GedcomTag.AdultChristening]: 'adult_christening',
            [GedcomTag.Confirmation]: 'confirmation',
            [GedcomTag.FirstCommunion]: 'first_communion',
            [GedcomTag.Naturalization]: 'naturalization',
            [GedcomTag.Emigration]: 'emigration',
            [GedcomTag.Immigration]: 'immigration',
            [GedcomTag.Census]: 'census',
            [GedcomTag.Probate]: 'probate',
            [GedcomTag.Will]: 'will',
            [GedcomTag.Graduation]: 'graduation',
            [GedcomTag.Retirement]: 'retirement',
            [GedcomTag.Occupation]: 'occupation', // While originally defined as an attribute it is used as an event
            [GedcomTag.Residence]: 'residence', // Same here
            [GedcomTag.Event]: 'event',
        };
        const events = individual.get().filter(node => eventsWithKeys[node.tag] !== undefined).as(GedcomSelection.IndividualEvent);
        if(events.length === 0 || !events.array().some(event => ![GedcomTag.Birth, GedcomTag.Death, GedcomTag.Occupation].includes(event.tag))) {
            return null;
        }
        return (
            <Card className="mt-3">
                <Card.Body>
                    <Card.Title>
                        <CalendarWeek className="icon mr-2"/>
                        <FormattedMessage id="page.individual.events.title"/>
                    </Card.Title>
                    <ul className="timeline">
                        {events.arraySelect().map((event, i) => (
                            this.renderTimelineEvent(event, i, eventsWithKeys[event[0].tag])
                        ))}
                    </ul>
                </Card.Body>
            </Card>
        );
    };

    computeStatistics = individual => {
        const { file, ancestors, descendants, related, topologicalOrdering, inbreedingMap, relatednessMap } = this.props;
        const { settings: { rootIndividual } } = this.props;
        const coefficientInbreeding = computeInbreedingCoefficient(file, topologicalOrdering, inbreedingMap, individual);
        const individualId = individual[0].pointer;
        const individualAncestors = computeAncestors(file, individual), individualDescendants = computeDescendants(file, individual), individualRelated = computeRelated(file, individualAncestors);
        individualAncestors.delete(individualId);
        individualDescendants.delete(individualId);
        individualRelated.delete(individualId);
        const totalAncestors = individualAncestors.size, totalDescendants = individualDescendants.size, totalRelated = individualRelated.size;
        let coefficientRelatedness = null;
        let commonAncestors = null, commonDescendants = null, commonRelated = null;
        if(rootIndividual !== null) {
            coefficientRelatedness = computeRelatednessCoefficient(file, topologicalOrdering, relatednessMap, individual, rootIndividual);
            const rootId = rootIndividual[0].pointer;
            individualAncestors.delete(rootId);
            individualDescendants.delete(rootId);
            individualRelated.delete(rootId);
            commonAncestors = setIntersectionSize(individualAncestors, ancestors);
            commonDescendants = setIntersectionSize(individualDescendants, descendants);
            commonRelated = setIntersectionSize(individualRelated, related);
        }
        return { coefficientInbreeding, coefficientRelatedness, totalAncestors, totalDescendants, totalRelated, commonAncestors, commonDescendants, commonRelated };
    };

    renderStatisticsContent = individual => ({ coefficientInbreeding, coefficientRelatedness, totalAncestors, totalDescendants, totalRelated, commonAncestors, commonDescendants, commonRelated }) => {
        const { settings: { rootIndividual } } = this.props;
        const computeDegrees = x => -Math.log2(x);
        const withCommon = rootIndividual !== null && individual[0].pointer !== rootIndividual[0].pointer;
        return (
            <>
                <div>
                    <FormattedMessage
                        id="page.individual.statistics.coefficient_inbreeding"
                        values={{ percentage: (
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip id="tooltip-inbreeding">
                                            {coefficientInbreeding > 0 ? (
                                                <FormattedMessage
                                                    id="page.individual.statistics.degrees"
                                                    values={{ value: computeDegrees(coefficientInbreeding), degrees: (
                                                            <FormattedNumber
                                                                value={computeDegrees(coefficientInbreeding)}
                                                                style="decimal"
                                                                maximumFractionDigits={2}
                                                            />
                                                        )}}
                                                />
                                            ) : (
                                                <FormattedMessage id="page.individual.statistics.no_inbreeding"/>
                                            )}
                                        </Tooltip>
                                    }
                                >
                                    <Badge variant="secondary">
                                        <FormattedNumber
                                            value={coefficientInbreeding}
                                            style="percent"
                                            maximumFractionDigits={2}
                                        />
                                    </Badge>
                                </OverlayTrigger>
                            )
                        }}
                    />
                </div>
                {withCommon && (
                    <div>
                        <FormattedMessage
                            id="page.individual.statistics.coefficient_relatedness"
                            values={{ name: <IndividualName individual={rootIndividual} noAncestry/>, percentage: (
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip id="tooltip-relatedness">
                                                {coefficientRelatedness > 0 ? (
                                                    <FormattedMessage
                                                        id="page.individual.statistics.degrees"
                                                        values={{ value: computeDegrees(coefficientRelatedness), degrees: (
                                                                <FormattedNumber
                                                                    value={computeDegrees(coefficientRelatedness)}
                                                                    style="decimal"
                                                                    maximumFractionDigits={2}
                                                                />
                                                            )}}
                                                    />
                                                ) : (
                                                    <FormattedMessage id="page.individual.statistics.no_relation"/>
                                                )}
                                            </Tooltip>
                                        }
                                    >
                                        <Badge variant="secondary">
                                            <FormattedNumber
                                                value={coefficientRelatedness}
                                                style="percent"
                                                maximumFractionDigits={2}
                                            />
                                        </Badge>
                                    </OverlayTrigger>
                                )
                            }}
                        />
                    </div>
                )}
                <table className="mt-2 table table-borderless table-striped text-center">
                    <thead>
                    <tr>
                        <th></th>
                        <th>
                            <FormattedMessage id="page.individual.statistics.table.total"/>
                        </th>
                        {withCommon && (
                            <th>
                                <FormattedMessage
                                    id="page.individual.statistics.table.in_common_with"
                                    values={{
                                        name: <span className="font-weight-normal"><IndividualName individual={rootIndividual} noAncestry /></span>,
                                    }}
                                />
                            </th>
                        )
                        }
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="font-weight-bold"><FormattedMessage id="page.individual.statistics.table.ancestors"/></td>
                        <td><FormattedNumber value={totalAncestors}/></td>
                        <td>{withCommon && <FormattedNumber value={commonAncestors}/>}</td>
                    </tr>
                    <tr>
                        <td className="font-weight-bold"><FormattedMessage id="page.individual.statistics.table.descendants"/></td>
                        <td><FormattedNumber value={totalDescendants}/></td>
                        <td>{withCommon && <FormattedNumber value={commonDescendants}/>}</td>
                    </tr>
                    <tr>
                        <td className="font-weight-bold"><FormattedMessage id="page.individual.statistics.table.related"/></td>
                        <td><FormattedNumber value={totalRelated}/></td>
                        <td>{withCommon && <FormattedNumber value={commonRelated}/>}</td>
                    </tr>
                    </tbody>
                </table>
            </>
        )
    };

    renderStatisticsCard = individual => {
        // Beware that the component is not remounted if the root changes
        return (
            <Card className="mt-3">
                <Card.Body>
                    <Card.Title>
                        <Percent className="icon mr-2"/>
                        <FormattedMessage id="page.individual.statistics.title"/>
                    </Card.Title>
                    <StatisticsProxy
                        key={individual[0].pointer}
                        computeData={() => this.computeStatistics(individual)}
                        buttonComponent={({ onClick }) => (
                            <div className="text-center">
                                <Button onClick={onClick}>
                                    <Cpu className="icon mr-2"/>
                                    <FormattedMessage id="page.individual.statistics.compute"/>
                                </Button>
                            </div>
                        )}
                        contentComponent={this.renderStatisticsContent(individual)}
                    />
                </Card.Body>
            </Card>
        )
    };

    render() {
        const { file, match: { params: { individualId } }, settings: { rootIndividual }, setRootIndividual } = this.props;
        const individualOpt = file.getIndividualRecord(individualId, 1);
        if (individualOpt.length === 0) {
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
                                <Dropdown.Item href="#" disabled={rootIndividual !== null && individualOpt[0].pointer === rootIndividual[0].pointer} onClick={() => setRootIndividual(file, individualOpt)}>
                                    <HouseDoor className="icon mr-2" />
                                    <FormattedMessage id="page.individual.actions.define_root"/>
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <LinkContainer to={{
                                    pathname: AppRoutes.print,
                                    state: { initialIndividualId: individualOpt[0].pointer },
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
                                } node={individualOpt[0]} root={file} />
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
                        {this.renderHalfSiblings(individualOpt)}
                    </Card.Body>
                </Card>

                {this.renderAncestorsCard(individualOpt)}

                {this.renderTimelineCard(individualOpt)}

                {this.renderStatisticsCard(individualOpt)}
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
    file: PropTypes.instanceOf(GedcomSelection.Gedcom).isRequired,
    /* Redux */
    settings: PropTypes.object.isRequired,
    ancestors: PropTypes.instanceOf(Set),
    descendants: PropTypes.instanceOf(Set),
    related: PropTypes.instanceOf(Set),
    topologicalOrdering: PropTypes.object.isRequired,
    inbreedingMap: PropTypes.instanceOf(Map).isRequired,
    setRootIndividual: PropTypes.func.isRequired,
};

PageIndividual.defaultProps = {
    ancestors: null,
    descendants: null,
    related: null,
};
