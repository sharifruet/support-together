import React from 'react';
import { CircularProgress } from "@mui/material";

const CustomButton = ({ isLoading, type, icon, label, disabled }) => {

    return (
        <button
            style={{ background: "#303031" }}
            type={type}
            // onClick={onClick}
            className={`bg-gray-800 text-gray-100 rounded-full text-lg font-semibold font-medium py-2 ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
            disabled={isLoading || disabled}
        >
            {isLoading ? (
                <CircularProgress color="inherit" size={24} />
            ) : (
                <div className="flex justify-center">
                    <div className="mr-2">{icon}</div>
                    <div style={{ marginTop: "2px" }}>{label}</div>
                </div>
            )}
        </button>
    );
};
export default CustomButton;
