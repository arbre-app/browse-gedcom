import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

export const GenderMale = forwardRef(({ color, size, ...rest }, ref) => {
    return (
        <svg
            ref={ref}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width={size}
            height={size}
            fill={color}
            {...rest}
        >
            <path d="M10.12 1.559v.816h2.868l-2.595 2.594c-2.11-1.781-5.278-1.684-7.264.302a5.381 5.381 0 000 7.6 5.381 5.381 0 007.6 0 5.378 5.378 0 00.302-7.264l2.594-2.595V5.88h.816V1.559H10.12zM6.93 4.695c1.118 0 2.235.427 3.091 1.284a4.366 4.366 0 010 6.185 4.366 4.366 0 01-6.185 0 4.366 4.366 0 010-6.185A4.36 4.36 0 016.93 4.695z" />
        </svg>
    );
});

GenderMale.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

GenderMale.defaultProps = {
    color: 'currentColor',
    size: '1em',
};
