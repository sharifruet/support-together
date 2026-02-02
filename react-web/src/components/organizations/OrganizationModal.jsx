import React, { useState, useEffect, useContext } from "react";
import { TextField, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import useOrganizationService from '../../hooks/useOrganizationService';
import CustomButton from "../common/CustomButton";
import DeleteText from "../common/DeleteText";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import ModalOverlay from "../common/ModalOverlay";
import GlobalContext from "../../GlobalContext";

const OrganizationModal = ({ modalType, organization, closeModal, fetchOrganizations }) => {
    const { projects } = useContext(GlobalContext);
    const organizationProjects = organization?.id
        ? (projects || []).filter((p) => p.OrganizationId === organization.id)
        : [];
    // Destructuring service or api calls functions
    const { createOrganization, updateOrganization, deleteOrganization } = useOrganizationService();

    // State to manage form data
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        address: "",
        success: "",
        error: "",
        id: ""
    });

    // State to manage individual field errors
    const [fieldErrors, setFieldErrors] = useState({
        code: "",
        name: "",
        address: "",
    });

    // State to manage loading status
    const [loading, setLoading] = useState(false);

    // Object to show button labels based on the modal type
    const buttonLabels = {
        add: "Create Organization", // Label for the "add" modal type
        edit: "Update Organization", // Label for the "edit" modal type
        delete: "Confirm" // Label for the "delete" modal type
    };

    // Object to show button icons based on the modal type
    const buttonIcons = {
        add: <FaCirclePlus />, // Label for the "add" modal type
        edit: <FaEdit />, // Label for the "edit" modal type
        delete: <FaTrashAlt /> // Label for the "delete" modal type
    };

    // Object to show Modal Header Name based on the modal type
    const modalName = {
        add: "Add Organization", // Label for the "add" modal type
        edit: "Edit Organization", // Label for the "edit" modal type
        delete: "Delete Organization", // Label for the "delete" modal type
        view: "View Organization" // Label for the "view" modal type
    };

    // Effect to initialize form data based on modal type and organization(passed props)
    useEffect(() => {
        if (modalType === 'edit' || modalType === 'view') {
            const { name, code, address, id } = organization;
            setFormData({
                ...formData,
                code: code,
                name: name || "",
                address: address || "",
                id: id || "",
                success: false,
                error: false,
            });
        } else {
            // Clear form data if modalType is not 'edit' or 'view'
            setFormData({
                ...formData,
                code: "",
                name: "",
                address: "",
                id: "",
            });

            // Clear empty field error on close modal
            setFieldErrors({
                code: "",
                name: "",
                address: "",
            });
        }
    }, [modalType, organization]);

    // Effect to reset error and success messages after 2 seconds
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

    // Function to handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            success: false,
            error: "",
        }));

        // Clear error message for the field when it receives a value
        if (value.trim()) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                [name]: "", // Clear error message if field has a value
            }));
        } else {
            // If field value becomes empty, show error message
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required`,
            }));
        }
    };

    // Function to handle empty input or select field
    const validateForm = (fields) => {
        const errors = {};
        fields.forEach(({ name, value }) => {
            if (!value && !value.trim()) {
                errors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
            }
        });
        return errors;
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Define fields to validate
        const fieldsToValidate = [
            { name: "code", value: formData.code },
            { name: "name", value: formData.name },
            { name: "address", value: formData.address }
        ];

        // Validate all fields before submission
        const errors = validateForm(fieldsToValidate);

        // Update field errors
        setFieldErrors(errors);

        // Define success messages for different modal types
        const successMessages = {
            add: "Organization added successfully",
            edit: "Organization updated successfully",
            delete: "Organization deleted successfully"
        };

        // Define actions for different modal types
        const actions = {
            add: () => createOrganization(formData),
            edit: () => updateOrganization(formData.id, formData),
            delete: () => deleteOrganization(Number(organization.id))
        };

        try {
            setLoading(true);
            const responseData = Object.keys(errors).length === 0 && await actions[modalType]();
            console.log(responseData)

            // Check the response and update the form data with success or error message
            if (responseData.message === successMessages[modalType] || typeof responseData === 'object') {
                fetchOrganizations && fetchOrganizations();
                setFormData({
                    name: "",
                    code: "",
                    address: "",
                    success: responseData.message ? responseData.message : successMessages[modalType],
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
            <ModalOverlay
                modalType={modalType}
                closeModal={closeModal}
                modalName={modalName[modalType]}
                formData={formData}
            >
                {/* Content of the modal */}
                <form className="w-100" onSubmit={handleSubmit}>
                    {modalType === 'delete' ? (
                        <DeleteText message={"Organization"} />
                    ) : (
                        <div>
                            <div className="flex flex-col space-y-1 w-100 py-4">
                                <TextField
                                    id="code"
                                    variant="outlined"
                                    name="code"
                                    autoComplete="code"
                                    label="Code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    fullWidth
                                    autoFocus
                                    disabled={modalType === 'view'}
                                    error={!!(fieldErrors.code)} // Set error prop based on field error
                                    helperText={fieldErrors.code} // Provide the error message
                                />
                            </div>
                            <div className="d-flex flex-column w-100 mb-4">
                                <TextField
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    className="w-100"
                                    id="name"
                                    label="Name"
                                    fullWidth
                                    autoComplete="name"
                                    disabled={modalType === 'view'}
                                    error={!!(fieldErrors.name)} // Set error prop based on field error
                                    helperText={fieldErrors.name} // Provide the error message
                                />
                            </div>
                            <div className="d-flex flex-column w-100">
                                <TextField
                                    id="address"
                                    variant="outlined"
                                    name="address"
                                    label="Address"
                                    autoComplete="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    disabled={modalType === 'view'}
                                    error={!!(fieldErrors.address)} // Set error prop based on field error
                                    helperText={fieldErrors.description} // Provide the error message
                                />
                            </div>
                            {modalType === 'view' && organization && (
                                <div className="mt-4">
                                    <Typography variant="subtitle1" fontWeight="600" className="mb-2">Projects</Typography>
                                    {organizationProjects.length === 0 ? (
                                        <Typography variant="body2" color="text.secondary">No projects in this organization.</Typography>
                                    ) : (
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Code</TableCell>
                                                    <TableCell>Name</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {organizationProjects.map((p) => (
                                                    <TableRow key={p.id}>
                                                        <TableCell>{p.code}</TableCell>
                                                        <TableCell>{p.name}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {modalType !== 'view' && (
                        <div className="d-flex flex-column w-100 mt-4">
                            <CustomButton
                                isLoading={loading}
                                type="submit"
                                icon={buttonIcons[modalType]}
                                label={buttonLabels[modalType]}
                                disabled={loading}
                            />
                        </div>
                    )}
                </form>
            </ModalOverlay>
        </>
    );
};

export default OrganizationModal;

