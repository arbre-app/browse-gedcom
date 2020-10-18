import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Node as GedcomNode } from 'read-gedcom';
import { Badge, Button } from 'react-bootstrap';

class NodeLi extends Component {
    state = {
        xRefResolved: false,
    };

    characterSubstitution = {
        '\r': '\\r',
        '\n': '\\n',
        '\t': '\\t',
    };

    rXRef = /^@[A-Za-z0-9]+@$/;

    rUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/g;

    renderTag = () => {
        const { node, synthetic } = this.props;
        return <Badge variant={synthetic ? 'primary' : 'secondary'}
                      className="text-monospace mr-2">{node.tag()}</Badge>;
    };

    renderValue = () => {
        const { node } = this.props;
        const { xRefResolved } = this.state;
        const value = node.value();
        if (value) {
            let cleanedValue = value;
            for (const currentChar in this.characterSubstitution) { // Blank characters
                const substitution = this.characterSubstitution[currentChar];
                cleanedValue = cleanedValue.replaceAll(currentChar, `<kbd>${substitution}</kbd>`);
            }
            cleanedValue = cleanedValue.replaceAll(this.rUrl, `<a href="$&" target="_blank">$&</a>`);
            const span = <span className="text-monospace" dangerouslySetInnerHTML={{ __html: cleanedValue }}/>;
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
        const pointer = node.value();
        const byTagPointers = root._data.tree.by_tag_pointer; // TODO: API for that
        for (const tag in byTagPointers) {
            const pointers = byTagPointers[tag];
            if (pointers[pointer] !== undefined) { // Found
                const syntheticNode = root.getByTagPointer(tag, pointer).first();
                return (
                    <NodeLi node={syntheticNode} synthetic maxDepth={maxDepth - 1} {...otherProps} />
                );
            }
        }
        // Not found
        return <li><Badge variant="danger" className="text-monospace">Not found: {pointer}</Badge></li>;
    };

    render() {
        const { node, synthetic, maxDepth, ...otherProps } = this.props;
        const { xRefResolved } = this.state;
        return (
            <li>
                {this.renderTag()}
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
                {amount} more...
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
