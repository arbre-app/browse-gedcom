import PropTypes from 'prop-types';
import React, { Component } from 'react';

export class StatisticsProxy extends Component {
    state = {
        data: null,
    };

    clickHandler = () => {
        const { computeData } = this.props;
        this.setState({ data: computeData() });
    };

    render() {
        const { buttonComponent: Button, contentComponent: Content } = this.props;
        const { data } = this.state;
        return data !== null ? (
            <Content {...data}/>
        ) : (
            <Button onClick={this.clickHandler}/>
        );
    }
}

StatisticsProxy.propTypes = {
    computeData: PropTypes.func.isRequired,
    buttonComponent: PropTypes.any.isRequired,
    contentComponent: PropTypes.any.isRequired,
};
