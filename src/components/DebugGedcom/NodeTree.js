import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Node as GedcomNode } from 'read-gedcom';
import { Badge, Button } from 'react-bootstrap';
import Linkify from 'react-linkify';

class NodeLi extends Component {
    state = {
        xRefResolved: false,
    };

    characterSubstitution = {
        '\r': '\\r',
        '\n': '\\n',
        '\t': '\\t',
    };
    rSpecialCharacters = new RegExp(`[${Object.keys(this.characterSubstitution).join('')}]`);

    rXRef = /^@[A-Za-z0-9]+@$/;

    rUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/g;

    renderTag = () => {
        const { node, synthetic } = this.props;
        return <Badge variant={synthetic ? 'info' : 'secondary'}
                      className="text-monospace mr-1">{node.tag().option()}</Badge>;
    };

    renderPointer = () => {
        const { node } = this.props;
        const pointer = node.pointer().option();
        return pointer && <Badge variant="success" className="text-monospace mr-1">{pointer}</Badge>;
    };

    linkComponentDecorator = (decoratedHref, decoratedText, key) => (
        <a target="blank" href={decoratedHref} key={key}>
            {decoratedText}
        </a>
    );

    renderValue = () => {
        const { node } = this.props;
        const { xRefResolved } = this.state;
        const value = node.value().option();
        if (value) {
            let k = 0;
            let cleanedValue = value.split(this.rSpecialCharacters).map((text, i) => {
                const fragment = (
                    <React.Fragment key={i}>
                        {i > 0 && (<kbd>{this.characterSubstitution[value[k - 1]]}</kbd>)}
                        {text}
                    </React.Fragment>
                );
                k += text.length + 1;
                return fragment;
            });
            const span = (
                <span className="text-monospace">
                    <Linkify componentDecorator={this.linkComponentDecorator}>{cleanedValue}</Linkify>
                </span>
            );
            if (this.rXRef.exec(value) !== null && !xRefResolved) {
                return (
                    <u
                        style={{ cursor: 'pointer' }}
                        onClick={this.handleResolveXRef}
                    >
                        {span}
                    </u>
                );
            } else {
                return span;
            }
        } else {
            return null;
        }
    };

    handleResolveXRef = () => this.setState({ xRefResolved: true });

    renderResolvedNode = () => {
        const { node, synthetic, maxDepth, ...otherProps } = this.props;
        const root = node.getGedcom();
        const pointer = node.value().option();
        const recordOpt = root.getRecord(null, pointer);
        if (recordOpt.count() === 1) {
            return (
                <NodeLi node={recordOpt} synthetic maxDepth={maxDepth - 1} {...otherProps} />
            );
        } else if (recordOpt.isEmpty()) {
            return <li><Badge variant="danger" className="text-monospace mr-1"><FormattedMessage id="component.debug.resolution.not_found" values={{ pointer }}/></Badge></li>;
        } else {
            return <li><Badge variant="danger" className="text-monospace mr-1"><FormattedMessage id="component.debug.resolution.ambiguous" values={{ pointer }}/></Badge></li>;
        }
    };

    render() {
        const { node, synthetic, maxDepth, ...otherProps } = this.props;
        const { xRefResolved } = this.state;
        return (
            <li>
                {this.renderTag()}
                {this.renderPointer()}
                {this.renderValue()}
                <NodeTree node={node.children()} maxDepth={maxDepth - 1} {...otherProps}>
                    {xRefResolved && this.renderResolvedNode()}
                </NodeTree>
            </li>
        );
    };
}

NodeLi.propTypes = {
    node: PropTypes.instanceOf(GedcomNode).isRequired, // Unit
    maxDepth: PropTypes.number.isRequired,
    maxNodes: PropTypes.number.isRequired,
    loadMoreCount: PropTypes.number.isRequired,
    synthetic: PropTypes.bool,
};

NodeLi.defaultProps = {
    synthetic: false,
};

export class NodeTree extends Component {
    constructor(props) {
        super(props);
        const { maxNodes, maxDepth } = props;
        this.state = {
            nodesDisplayLimit: maxDepth >= 0 ? maxNodes : 0,
        };
    }

    handleLoadMore = () => {
        const { loadMoreCount } = this.props;
        this.setState(state => {
            return {
                nodesDisplayLimit: state.nodesDisplayLimit + loadMoreCount,
            };
        });
    };

    renderLoadMoreNodes = amount => {
        return (
            <Button variant="light" className="btn-load-more" onClick={this.handleLoadMore}>
                <FormattedMessage id="component.debug.n_more" values={{amount}}/>
            </Button>
        );
    };

    render() {
        const { node, children, first, ...otherProps } = this.props;
        const { nodesDisplayLimit } = this.state;
        const allNodes = node.array();
        const displayableNodes = allNodes.slice(0, nodesDisplayLimit);
        const hiddenNodes = allNodes.length - nodesDisplayLimit;
        return (
            <ul className={`list-style-simple${first ? ' pl-0' : ''}`}>
                {children}
                {displayableNodes.map((node, i) => <NodeLi key={i} node={node} {...otherProps}/>)}
                {hiddenNodes > 0 ? this.renderLoadMoreNodes(hiddenNodes) : null}
            </ul>
        );
    }
}

NodeTree.propTypes = {
    node: PropTypes.instanceOf(GedcomNode).isRequired, // Any
    maxDepth: PropTypes.number.isRequired,
    maxNodes: PropTypes.number.isRequired,
    loadMoreCount: PropTypes.number.isRequired,
    first: PropTypes.bool,
    children: PropTypes.any,
};

NodeTree.defaultProps = {
    first: false,
    children: null,
};
