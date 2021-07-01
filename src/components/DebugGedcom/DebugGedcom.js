import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';
import { GedcomSelection } from 'read-gedcom';
import { GedcomTreeNodeType } from '../../util';
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
        const { node, root, triggerComponent: TriggerComponent, maxDepth, maxNodes, loadMoreCount } = this.props;
        const { visible } = this.state;
        return (
            <>
                <TriggerComponent onClick={this.handleShow} />
                <Modal size="lg" show={visible} onHide={this.handleClose}>
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
}

DebugGedcom.propTypes = {
    node: GedcomTreeNodeType.isRequired,
    root: PropTypes.instanceOf(GedcomSelection.Gedcom).isRequired,
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
