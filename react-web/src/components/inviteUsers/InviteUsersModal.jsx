import React, { useState, useEffect } from "react";
import { TextField, FormControl, RadioGroup, FormControlLabel, Radio, FormHelperText } from "@mui/material";
import useUserInviteService from '../../hooks/useUserInviteService';
import CustomButton from "../common/CustomButton";
import DeleteText from "../common/DeleteText";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import ModalOverlay from "../common/ModalOverlay";
import { FcInvite } from "react-icons/fc";

const InviteUsersModal = ({ modalType, project, closeModal, fetchProjects }) => {
    // Destructuring service or api calls functions
    const { createUserInvite, updateUserInvite, deleteUserInvite } = useUserInviteService();

    // State to manage form data
    const [formData, setFormData] = useState({
        email: "",
        projectId: "",
        role: "",
        success: "",
        error: "",
        id: ""
    });

    // State to manage individual field errors
    const [fieldErrors, setFieldErrors] = useState({
        email: "",
        projectId: "",
        role: "",
    });

    // State to manage loading status
    const [loading, setLoading] = useState(false);

    // Object to show button labels based on the modal type
    const buttonLabels = {
        invite: "Invite", // Label for the "invite" modal type
        edit: "Update", // Label for the "edit" modal type
        delete: "Confirm" // Label for the "delete" modal type
    };

    // Object to show button icons based on the modal type
    const buttonIcons = {
        invite: <FcInvite />, // Label for the "invite" modal type
        edit: <FaEdit />, // Label for the "edit" modal type
        delete: <FaTrashAlt /> // Label for the "delete" modal type
    };

    // Object to show Modal Header Name based on the modal type
    const modalName = {
        invite: "Invite User", // Label for the "invite" modal type
        edit: "Edit Email Template", // Label for the "edit" modal type
        delete: "Delete Email Template" // Label for the "delete" modal type
    };

    useEffect(() => {
        if (modalType === 'invite' && project) {
            const { email, role, id } = project;
            setFormData({
                email: email || "",
                role: role || "",
                projectId: id || "",
                success: false,
                error: false,
            });
        } else {
            setFormData({
                email: "",
                role: "",
                projectId: ""
            });

            setFieldErrors({
                email: "",
                role: "",
                projectId: ""
            });
        }
    }, [modalType, project]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Define fields to validate
        const fieldsToValidate = [
            { name: "email", value: formData.email },
            { name: "role", value: formData.role }
        ];

        // Validate all fields before submission
        const errors = validateForm(fieldsToValidate);

        // Update field errors
        setFieldErrors(errors);

        // Define success messages for different modal types
        const successMessages = {
            invite: "Invitation send successfully",
            edit: "Email Template updated successfully",
            delete: "Email Template deleted successfully"
        };

        // Define actions for different modal types
        const actions = {
            invite: () => createUserInvite(formData),
            edit: () => updateUserInvite(formData.id, formData),
            delete: () => deleteUserInvite(Number(project.id))
        };

        try {
            setLoading(true);
            const responseData = Object.keys(errors).length === 0 && await actions[modalType]();
            console.log(responseData)

            // Check the response and update the form data with success or error message
            if (responseData.message === successMessages[modalType] || typeof responseData === 'object') {
                fetchProjects();
                setFormData({
                    email: "",
                    role: "",
                    projectId: "",
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
                <form className="w-full" onSubmit={handleSubmit}>
                    {modalType === 'delete' ? (
                        <DeleteText message={"Email Template"} />
                    ) : (
                        <div>
                            <div className="flex flex-col space-y-1 w-full mb-4">
                                <TextField
                                    id="email"
                                    variant="outlined"
                                    name="email"
                                    label="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    fullWidth
                                    autoFocus
                                    error={!!(fieldErrors.email)} // Set error prop based on field error
                                    helperText={fieldErrors.email} // Provide the error message
                                />
                            </div>
                            <div className="flex flex-col space-y-1 w-full mb-4">
                                <FormControl component="fieldset" error={!!(fieldErrors.role)}>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                    >
                                        <FormControlLabel 
                                            value="Admin" 
                                            control={<Radio sx={{ color: fieldErrors.role ? 'red' : 'inherit' }} />} 
                                            label="Admin" 
                                            sx={{ color: fieldErrors.role ? 'red' : 'inherit' }}
                                        />
                                        <FormControlLabel 
                                            value="Support" 
                                            control={<Radio sx={{ color: fieldErrors.role ? 'red' : 'inherit' }} />} 
                                            label="Support" 
                                            sx={{ color: fieldErrors.role ? 'red' : 'inherit' }}
                                        />
                                        <FormControlLabel 
                                            value="Customer" 
                                            control={<Radio sx={{ color: fieldErrors.role ? 'red' : 'inherit' }} />} 
                                            label="Customer" 
                                            sx={{ color: fieldErrors.role ? 'red' : 'inherit' }}
                                        />
                                    </RadioGroup>
                                {fieldErrors.role && <FormHelperText>{fieldErrors.role}</FormHelperText>}
                                </FormControl>
                            </div>

                        </div>
                    )}
                    <div className="flex flex-col space-y-1 w-full mt-4">
                        <CustomButton
                            isLoading={loading}
                            type="submit"
                            icon={buttonIcons[modalType]}
                            label={buttonLabels[modalType]}
                            disabled={loading}
                        />
                    </div>
                </form>
            </ModalOverlay>
        </>
    );
};

export default InviteUsersModal;

