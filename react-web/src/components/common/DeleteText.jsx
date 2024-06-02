import React from "react";
import { FaTrashAlt } from "react-icons/fa";

const DeleteText = ({ message }) => {
    return (
        <div className="p-6">
            <div className="flex items-center mb-4">
                <FaTrashAlt className="text-red-600 mr-2" size={24} />
                <h5 className="text-3xl font-semibold text-red-600">Delete {message}</h5>
            </div>
            <div>
                <h5 className="text-gray-600 mb-4">Are you sure you want to delete this {message}?</h5>
            </div>
        </div>
    );
};

export default DeleteText;
