import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import useEmailTemplateService from '../../hooks/useEmailTemplateService';
import CustomButton from "../common/CustomButton";
import DeleteText from "../common/DeleteText";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import ModalOverlay from "../common/ModalOverlay";

const EmailTemplateModal = ({ modalType, emailTemplate, closeModal, fetchEmailTemplates }) => {
    // Destructuring service or api calls functions
    const { createEmailTemplate, updateEmailTemplate, deleteEmailTemplate } = useEmailTemplateService();

    // State to manage form data
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        body: "",
        success: "",
        error: "",
        id: ""
    });

    // State to manage individual field errors
    const [fieldErrors, setFieldErrors] = useState({
        name: "",
        body: "",
        subject: "",
    });

    // State to manage loading status
    const [loading, setLoading] = useState(false);

    // Object to show button labels based on the modal type
    const buttonLabels = {
        add: "Create Email Template", // Label for the "add" modal type
        edit: "Update Email Template", // Label for the "edit" modal type
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
        add: "Add Email Template", // Label for the "add" modal type
        edit: "Edit Email Template", // Label for the "edit" modal type
        delete: "Delete Email Template" // Label for the "delete" modal type
    };

    // Effect to initialize form data based on modal type and organization(passed props)
    useEffect(() => {
        if (modalType === 'edit') {
            const { name, code, body, id, subject } = emailTemplate;
            setFormData({
                ...formData,
                name: name || "",
                subject: subject || "",
                body: body || "",
                id: id || "",
                success: false,
                error: false,
            });
        } else {
            // Clear form data if modalType is not 'edit'
            setFormData({
                ...formData,
                name: "",
                subject: "",
                body: "",
                id: ""
            });

            // Clear empty field error on close modal
            setFieldErrors({
                name: "",
                subject: "",
                body: "",
            });
        }
    }, [modalType, emailTemplate]);

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
            { name: "name", value: formData.name },
            { name: "subject", value: formData.subject },
            { name: "body", value: formData.body }
        ];

        // Validate all fields before submission
        const errors = validateForm(fieldsToValidate);

        // Update field errors
        setFieldErrors(errors);

        // Define success messages for different modal types
        const successMessages = {
            add: "Email Template added successfully",
            edit: "Email Template updated successfully",
            delete: "Email Template deleted successfully"
        };

        // Define actions for different modal types
        const actions = {
            add: () => createEmailTemplate(formData),
            edit: () => updateEmailTemplate(formData.id, formData),
            delete: () => deleteEmailTemplate(Number(emailTemplate.id))
        };

        try {
            setLoading(true);
            const responseData = Object.keys(errors).length === 0 && await actions[modalType]();
            console.log(responseData)

            // Check the response and update the form data with success or error message
            if (responseData.message === successMessages[modalType] || typeof responseData === 'object') {
                fetchEmailTemplates();
                setFormData({
                    name: "",
                    subject: "",
                    body: "",
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
                                    id="name"
                                    variant="outlined"
                                    name="name"
                                    label="Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    fullWidth
                                    autoFocus
                                    error={!!(fieldErrors.name)} // Set error prop based on field error
                                    helperText={fieldErrors.name} // Provide the error message
                                />
                            </div>
                            <div className="flex flex-col space-y-1 w-full mb-4">
                                <TextField
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    label="Subject"
                                    variant="outlined"
                                    fullWidth
                                    error={!!(fieldErrors.subject)} // Set error prop based on field error
                                    helperText={fieldErrors.subject} // Provide the error message
                                />
                            </div>
                            <div className="flex flex-col space-y-1 w-full mb-4">
                                <TextField
                                    id="body"
                                    name="body"
                                    value={formData.body}
                                    onChange={handleInputChange}
                                    label="Body"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={10}
                                    error={!!(fieldErrors.body)} // Set error prop based on field error
                                    helperText={fieldErrors.body} // Provide the error message
                                />
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

export default EmailTemplateModal;

