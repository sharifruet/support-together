import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const Avatar = ({
    src = '',
    alt = 'Avatar',
    size = 'medium',
    shape = 'round',
    border = false,
    borderColor = '#000',
    bgColor = '#ccc',
    textColor = '#fff',
    initials = '',
    name = '',
    className = '',
}) => {
    const sizeClasses = {
        tiny: 'avatar-tiny',
        small: 'avatar-small',
        medium: 'avatar-medium',
        large: 'avatar-large',
        big: 'avatar-big',
    };

    const shapeClasses = {
        round: 'rounded-circle',
        square: 'rounded-0',
        squareRounded: 'rounded',
    };

    const defaultStyles = {
        backgroundColor: bgColor,
        color: textColor,
        borderColor: border ? borderColor : 'transparent',
        borderWidth: border ? '1px' : '0',
        borderStyle: border ? 'solid' : 'none',
    };

    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseEnter = () => {
        if (name) {
            setShowTooltip(true);
        }
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    const avatarInitials = (fullName) => {
        const names = fullName.split(" ");
        const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());
        return initials.join("");
    };

    return (
        <div
            className={`d-flex align-items-center justify-content-center ${sizeClasses[size]} ${shapeClasses[shape]} ${className}`}
            style={defaultStyles}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {name && (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>{name}</Tooltip>}
                    show={showTooltip}
                >
                    <span>
                        {src ? (
                            <img
                                src={src}
                                alt={alt}
                                className={`img-fluid ${shapeClasses[shape]} w-100 h-100`}
                            />
                        ) : (
                            <span className="d-flex align-items-center justify-content-center w-100 h-100">
                                {avatarInitials(initials)}
                            </span>
                        )}
                    </span>
                </OverlayTrigger>
            )}
            {!name && (
                <>
                    {src ? (
                        <img
                            src={src}
                            alt={alt}
                            className={`img-fluid ${shapeClasses[shape]} w-100 h-100`}
                        />
                    ) : (
                        <span className="d-flex align-items-center justify-content-center w-100 h-100">
                            {avatarInitials(initials)}
                        </span>
                    )}
                </>
            )}
        </div>
    );
};

Avatar.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large', 'big']),
    shape: PropTypes.oneOf(['round', 'square', 'squareRounded']),
    border: PropTypes.bool,
    borderColor: PropTypes.string,
    bgColor: PropTypes.string,
    textColor: PropTypes.string,
    initials: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
};

export default Avatar;