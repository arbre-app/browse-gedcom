import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';
import { SelectionGedcom } from 'read-gedcom';
import { GedcomTreeNodeType } from '../../util';
import { NodeTree } from './NodeTree';

export function DebugGedcom({ node, root, triggerComponent: TriggerComponent, maxDepth, maxNodes, loadMoreCount }) {
    const [visible, setVisible] = useState(false);

    const handleClose = () => setVisible(false);

    const handleShow = event => {
        event.preventDefault();
        event.stopPropagation();

        setVisible(true);
    }

    return (
        <>
            <TriggerComponent onClick={handleShow} />
            <Modal size="lg" show={visible} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title><FormattedMessage id="component.debug.title"/></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NodeTree
                        nodes={node.children}
                        root={root}
                        maxDepth={maxDepth}
                        maxNodes={maxNodes}
                        loadMoreCount={loadMoreCount}
                        first
                    />
                </Modal.Body>
            </Modal>
        </>
    );
}

DebugGedcom.propTypes = {
    node: GedcomTreeNodeType.isRequired,
    root: PropTypes.instanceOf(SelectionGedcom).isRequired,
    triggerComponent: PropTypes.any.isRequired,
    maxDepth: PropTypes.number,
    maxNodes: PropTypes.number,
    loadMoreCount: PropTypes.number,
};

DebugGedcom.defaultProps = {
    maxDepth: 1,
    maxNodes: 25,
    loadMoreCount: 25,
};
