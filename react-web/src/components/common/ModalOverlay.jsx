import React from "react";
import { Modal } from "@mui/material";
import { ReactComponent as CancelIcon } from '../../assets/svgIcons/cancel.svg';

const ModalOverlay = ({ modalType, closeModal, modalName, formData, children }) => {
    return (
        <>
            {/* Modal */}
            <Modal
                open={!!modalType}
                onClose={closeModal}
                aria-labelledby="add-category-modal-title"
                aria-describedby="add-category-modal-description"
            >
                <div className="fixed inset-0 m-4 flex items-center justify-center">
                    <div className="bg-white w-1/3 md:w-3/6 shadow-lg flex flex-col items-center space-y-4 overflow-y-auto px-4 py-4 md:px-8 rounded border border-3 border-dark">
                        <div className="flex items-center justify-between w-100">
                            <span className="text-left font-semibold text-2xl tracking-wider">
                                {/* Modal Name depending on modalType*/}
                                {modalName}
                            </span>
                            <span
                                style={{ background: "#303031" }}
                                onClick={closeModal}
                                className="cursor-pointer text-gray-100 c-py-1 c-px-2 rounded-full cancelIcon"
                            >
                                <CancelIcon className="w-6 h-6 font-bold cancelSvg" />
                            </span>
                        </div>
                        {formData.error && (
                            <div className="bg-red-200 py-2 px-4 w-100">{formData.error}</div>
                        )}
                        {formData.success && (
                            <div className="bg-green-200 py-2 px-4 w-100">{formData.success}</div>
                        )}
                        {/* Render children */}
                        {children}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ModalOverlay;

