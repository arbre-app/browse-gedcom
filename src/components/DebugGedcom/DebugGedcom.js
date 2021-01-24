import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Node as GedcomNode } from 'read-gedcom';
import { Modal } from 'react-bootstrap';
import { NodeTree } from './NodeTree';

export class DebugGedcom extends Component {
    state = {
        visible: false,
    };

    handleClose = () => this.setState({ visible: false });

    handleShow = event => {
        event.preventDefault();
        event.stopPropagation();

        this.setState({ visible: true });
    }

    render() {
        const { node, triggerComponent: TriggerComponent, maxDepth, maxNodes, loadMoreCount } = this.props;
        const { visible } = this.state;
        return (
            <>
                <TriggerComponent onClick={this.handleShow} />
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
