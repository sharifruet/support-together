import React from 'react';
import { ReactComponent as AddIcon } from '../../assets/svgIcons/add.svg';

const OpenModalButton = ({ label, icon }) => {
    return (
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-start w-full">
            <div
                style={{ background: "#303031" }}
                className="cursor-pointer rounded-full p-2 flex items-center justify-center text-gray-100 font-semibold text-sm uppercase"
            >
                <span className="w-6 h-6 text-gray-100 mr-2">{icon}</span>
                {label}
            </div>
        </div>
    );
};

export default OpenModalButton;
