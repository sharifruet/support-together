import React, { useState, useEffect } from "react";
import { Modal, TextField, CircularProgress } from "@mui/material";
import useOrganizationService from '../../hooks/useOrganizationService';
import { v4 as uuidv4 } from 'uuid';
import { ReactComponent as CancelIcon } from '../../assets/svgIcons/cancel.svg';

const OrganizationModal = ({ modalType, organization, closeModal, fetchOrganizations }) => {
    const { createOrganization, updateOrganization, deleteOrganization } = useOrganizationService();

    const [formData, setFormData] = useState({
        code: uuidv4(),
        name: "",
        address: "",
        success: "",
        error: "",
        id: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (modalType === 'edit') {
            const { name, code, address, id } = organization;
            setFormData({
                ...formData,
                name: name || "",
                address: address || "",
                id: id || "",
                success: false,
                error: false,
            });
        } else {
            setFormData({
                ...formData,
                name: "",
                address: "",
                id: "",
            });
        }
    }, [organization]);

    // Reset error and success messages after 2 seconds
    useEffect(() => {
        if (formData.error || formData.success) {
            const timer = setTimeout(() => {
                setFormData((prevData) => ({
                    ...prevData,
                    success: false,
                    error: "",
                }));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [formData.error, formData.success]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            success: false,
            error: "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const createMessage = "Organization added successfully"
            const updateMessage = "Organization updated successfully"
            const responseData = modalType === "add" ? await createOrganization(formData) : modalType === "edit" ? await updateOrganization(formData.id, formData) : await deleteOrganization(organization.id);
            console.log(responseData)
            console.log(typeof responseData)
            if (responseData.message === updateMessage || typeof responseData === 'object') {
                fetchOrganizations();
                setFormData({
                    name: "",
                    code: "",
                    address: "",
                    success: responseData.message ? responseData.message : createMessage,
                    error: "",
                });
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    error: responseData.message,
                }));
            }
        } catch (error) {
            console.error(error);
            setFormData((prevData) => ({
                ...prevData,
                error: error,
            }));
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            {/* Black Overlay */}
            <div
                onClick={closeModal}
                className={`${modalType ? "" : "hidden"
                    } fixed top-0 left-0 z-30 w-full h-full bg-black opacity-50`}
            />
            {/* Modal */}
            <Modal
                open={!!modalType}
                onClose={closeModal}
                aria-labelledby="add-category-modal-title"
                aria-describedby="add-category-modal-description"
            >
                <div className="fixed inset-0 m-4 flex items-center justify-center">
                    <div className="bg-white w-1/3 md:w-3/6 shadow-lg flex flex-col items-center space-y-4 overflow-y-auto px-4 py-4 md:px-8">
                        <div className="flex items-center justify-between w-full">
                            <span className="text-left font-semibold text-2xl tracking-wider">
                                {modalType === "add" ? "Add Organization" : modalType === "edit" ? "Edit Organization" : "Delete Organization"}
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
                            <div className="bg-red-200 py-2 px-4 w-full">{formData.error}</div>
                        )}
                        {formData.success && (
                            <div className="bg-green-200 py-2 px-4 w-full">{formData.success}</div>
                        )}

                        <form className="w-full" onSubmit={handleSubmit}>
                            {modalType === 'delete' ? (
                                <>
                                    <h4> Are you sure you want to delete this organization?</h4>
                                </>
                            ) : (
                                <div>
                                    <div className="flex flex-col space-y-1 w-full py-4">
                                        {/* <label htmlFor="cName">Organization Name</label> */}
                                        <TextField
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            className="w-full"
                                            id="name"
                                            label="Name"
                                            fullWidth
                                            autoComplete="name"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1 w-full">
                                        <TextField
                                            id="address"
                                            variant="outlined"
                                            name="address"
                                            label="Address"
                                            autoComplete="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                            autoFocus
                                            multiline
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col space-y-1 w-full pb-4 md:pb-6 mt-4">
                                <button
                                    style={{ background: "#303031" }}
                                    type="submit"
                                    className={`bg-gray-800 text-gray-100 rounded-full text-lg font-medium py-2 ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <CircularProgress color="inherit" size={24} />
                                    ) : (
                                        modalType === "add" ? "Add Organization" : modalType === "edit" ? "Edit Organization" : "Delete Organization"
                                    )}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </Modal>
        </>
    );
};

export default OrganizationModal;

