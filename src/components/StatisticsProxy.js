import PropTypes from 'prop-types';
import React, { useState } from 'react';

export function StatisticsProxy({ computeData, buttonComponent: Button, contentComponent: Content }) {
    const [data, setData] = useState(null);

    const clickHandler = () => setData(computeData());

    return data !== null ? (
        <Content {...data}/>
    ) : (
        <Button onClick={clickHandler}/>
    );
}

StatisticsProxy.propTypes = {
    computeData: PropTypes.func.isRequired,
    buttonComponent: PropTypes.any.isRequired,
    contentComponent: PropTypes.any.isRequired,
};
