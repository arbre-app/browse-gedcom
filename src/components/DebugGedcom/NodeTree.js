import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Badge, Button } from 'react-bootstrap';
import Linkify from 'react-linkify';
import { GedcomTreeNodeType } from '../../util';
import { GedcomSelection } from 'read-gedcom';

export function NodeLi({ node, root, maxDepth, maxNodes, loadMoreCount, synthetic }) {
    const [xRefResolved, setXRefResolved] = useState(false);

    const characterSubstitution = {
        '\r': '\\r',
        '\n': '\\n',
        '\t': '\\t',
    };
    const rSpecialCharacters = new RegExp(`[${Object.keys(characterSubstitution).join('')}]`);

    const rXRef = /^@[A-Za-z0-9]+@$/;

    const renderTag = () => {
        return <Badge variant={synthetic ? 'info' : 'secondary'}
                      className="text-monospace mr-1">{node.tag}</Badge>;
    };

    const renderPointer = () => {
        const pointer = node.pointer;
        return pointer && <Badge variant="success" className="text-monospace mr-1">{pointer}</Badge>;
    };

    const linkComponentDecorator = (decoratedHref, decoratedText, key) => (
        <a target="blank" href={decoratedHref} key={key}>
            {decoratedText}
        </a>
    );

    const renderValue = () => {
        const value = node.value;
        if (value) {
            let k = 0;
            let cleanedValue = value.split(rSpecialCharacters).map((text, i) => {
                const fragment = (
                    <React.Fragment key={i}>
                        {i > 0 && (<kbd>{characterSubstitution[value[k - 1]]}</kbd>)}
                        {text}
                    </React.Fragment>
                );
                k += text.length + 1;
                return fragment;
            });
            const span = (
                <span className="text-monospace">
                    <Linkify componentDecorator={linkComponentDecorator}>{cleanedValue}</Linkify>
                </span>
            );
            if (rXRef.exec(value) !== null && !xRefResolved) {
                return (
                    <u
                        style={{ cursor: 'pointer' }}
                        onClick={handleResolveXRef}
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

    const handleResolveXRef = () => setXRefResolved(true);

    const renderResolvedNode = () => {
        const pointer = node.value;
        const recordOpt = root.getRecord(null, pointer);
        if (recordOpt.length === 1) {
            return (
                <NodeLi node={recordOpt[0]} root={root} synthetic maxDepth={maxDepth - 1} maxNodes={maxNodes} loadMoreCount={loadMoreCount} />
            );
        } else if (recordOpt.length === 0) {
            return <li><Badge variant="danger" className="text-monospace mr-1"><FormattedMessage id="component.debug.resolution.not_found" values={{ pointer }}/></Badge></li>;
        } else {
            return <li><Badge variant="danger" className="text-monospace mr-1"><FormattedMessage id="component.debug.resolution.ambiguous" values={{ pointer }}/></Badge></li>;
        }
    };

    return (
        <li>
            {renderTag()}
            {renderPointer()}
            {renderValue()}
            <NodeTree nodes={node.children} root={root} maxDepth={maxDepth - 1} maxNodes={maxNodes} loadMoreCount={loadMoreCount}>
                {xRefResolved && renderResolvedNode()}
            </NodeTree>
        </li>
    );
}

NodeLi.propTypes = {
    node: GedcomTreeNodeType.isRequired,
    root: PropTypes.instanceOf(GedcomSelection.Gedcom).isRequired,
    maxDepth: PropTypes.number.isRequired,
    maxNodes: PropTypes.number.isRequired,
    loadMoreCount: PropTypes.number.isRequired,
    synthetic: PropTypes.bool,
};

NodeLi.defaultProps = {
    synthetic: false,
};

export function NodeTree({ nodes, root, maxDepth, maxNodes, loadMoreCount, first, children }) {
    const [nodesDisplayLimit, setNodesDisplayLimit] = useState(maxDepth >= 0 ? maxNodes : 0);

    const handleLoadMore = () => {
        setNodesDisplayLimit(nodesDisplayLimit + loadMoreCount);
    };

    const renderLoadMoreNodes = amount => {
        return (
            <Button variant="light" className="btn-load-more" onClick={handleLoadMore}>
                <FormattedMessage id="component.debug.n_more" values={{amount}}/>
            </Button>
        );
    };

    const allNodes = nodes;
    const displayableNodes = allNodes.slice(0, nodesDisplayLimit);
    const hiddenNodes = allNodes.length - nodesDisplayLimit;

    return (
        <ul className={`list-style-simple${first ? ' pl-0' : ''}`}>
            {children}
            {displayableNodes.map((node, i) => (
                <NodeLi key={i} node={node} root={root} maxDepth={maxDepth} maxNodes={maxNodes} loadMoreCount={loadMoreCount} />
            ))}
            {hiddenNodes > 0 ? renderLoadMoreNodes(hiddenNodes) : null}
        </ul>
    );
}

NodeTree.propTypes = {
    nodes: PropTypes.arrayOf(GedcomTreeNodeType).isRequired,
    root: PropTypes.instanceOf(GedcomSelection.Gedcom).isRequired,
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
