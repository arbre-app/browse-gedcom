import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Bug } from 'react-bootstrap-icons';
import { Node as GedcomNode } from 'read-gedcom';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { NodeTree } from './NodeTree';

export class DebugGedcom extends Component {
    state = {
        visible: false,
    };

    handleClose = () => this.setState({ visible: false });

    handleShow = () => this.setState({ visible: true });

    render() {
        const { node, maxDepth, maxNodes, loadMoreCount, ...buttonProps } = this.props;
        const { visible } = this.state;
        return (
            <>
                <OverlayTrigger
                    placement="left"
                    overlay={
                        <Tooltip>
                            Debug Gedcom structure
                        </Tooltip>
                    }
                >
                    <Bug className="icon hoverable" onClick={this.handleShow} {...buttonProps} />
                </OverlayTrigger>

                <Modal size="lg" show={visible} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Original record structure</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <NodeTree
                            node={node}
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
}

DebugGedcom.propTypes = {
    node: PropTypes.instanceOf(GedcomNode).isRequired,
    maxDepth: PropTypes.number,
    maxNodes: PropTypes.number,
    loadMoreCount: PropTypes.number,
};

DebugGedcom.defaultProps = {
    maxDepth: 1,
    maxNodes: 25,
    loadMoreCount: 25,
};
