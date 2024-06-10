import React, { useState, useEffect, useRef } from "react";
import { TextField, CircularProgress, Autocomplete } from "@mui/material";
import useProjectService from '../../hooks/useProjectService';
import useOrganizationService from '../../hooks/useOrganizationService';
import CustomButton from "../common/CustomButton";
import DeleteText from "../common/DeleteText";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import ModalOverlay from "../common/ModalOverlay";

const ProjectModal = ({ modalType, project, closeModal, fetchProjects, organization }) => {
    // Destructuring service or api calls functions
    const { createProject, updateProject, deleteProject } = useProjectService();
    const { getAllOrganizations } = useOrganizationService();

    // State to manage form data
    const [formData, setFormData] = useState({
        code: "",
        organizationId: organization !== null ? organization.id : "",
        name: "",
        description: "",
        success: "",
        error: "",
        id: "",
    });

    // State to manage individual field errors
    const [fieldErrors, setFieldErrors] = useState({
        code: "",
        name: "",
        description: "",
        organizationId: "",
    });

    // State to manage loading status
    const [loading, setLoading] = useState(false);
    // State to manage Material Ui AutoComplete UI loading status
    const [autocompleteLoading, setAutocompleteLoading] = useState(false);
    // State to manage Material Ui AutoComplete UI options
    const [options, setOptions] = useState([]);
    // State to manage Material Ui AutoComplete UI selected option
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    // Reference for the autocomplete field
    const autocompleteRef = useRef(null);

    // Object to show button labels based on the modal type
    const buttonLabels = {
        add: "Create Project", // Label for the "add" modal type
        edit: "Update Project", // Label for the "edit" modal type
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
        add: "Add Project", // Label for the "add" modal type
        edit: "Edit Project", // Label for the "edit" modal type
        delete: "Delete Project" // Label for the "delete" modal type
    };

    // loader for Material UI Autocomplete
    useEffect(() => {
        if (modalType === 'add' || modalType === 'edit') {
            // Set autocompleteLoading to true when modal is opened
            setAutocompleteLoading(true);
            setTimeout(() => {
                setAutocompleteLoading(false);
                if (autocompleteRef.current) {
                    autocompleteRef.current.focus();  // AutoFocus on the autocomplete field
                }
            }, 1000);
        } else setSelectedOrganization(null);
    }, [modalType]);

    // Fetch all organizations for the Autocomplete options
    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const data = await getAllOrganizations();
                const formattedOptions = data.map(organization => ({ id: organization.id, name: organization.name, value: organization.id }));
                setOptions(formattedOptions);
            } catch (error) {
                // Handle error here
                console.log(error);
            } finally {
                // Set autocompleteLoading to false when data is fetched
                setAutocompleteLoading(false);
            }
        };

        fetchOrganizations();
    }, []);

    // Effect to initialize form data based on modal type and project(passed props)
    useEffect(() => {
        if (modalType === 'edit' && project && options.length > 0) {
            const { name, code, description, id, OrganizationId } = project;
            const matchedOrganization = options.find(option => option.id === OrganizationId);

            // To prefilled the material ui AutoComplete component
            setSelectedOrganization(matchedOrganization);
            setFormData({
                ...formData,
                organizationId: OrganizationId || "",
                code: code,
                name: name || "",
                description: description || "",
                id: id || "",
                success: false,
                error: false,
            });
        } else if (modalType === 'add' && organization !== null) {
            const matchedOrganization = options.find(option => option.id === organization.id);

            setSelectedOrganization(matchedOrganization);
            setFormData(prevData => ({
                ...prevData,
                organizationId: organization.id,
            }));
        } else {
            // Clear form data if modalType is not 'edit'
            setFormData({
                ...formData,
                organizationId: organization !== null ? organization.id : "",
                code: "",
                name: "",
                description: "",
                success: "",
                error: "",
                id: "",
            });

            // Clear empty field error on close modal
            setFieldErrors({
                code: "",
                name: "",
                description: "",
                organizationId: "",
            });

            // Reset selectedOrganization state
            setSelectedOrganization(null);
        }
    }, [modalType, project, options, organization]);

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

    // Function to handle form Material UI Autocomplete component changes
    const handleAutocompleteChange = (event, newValue) => {
        setSelectedOrganization(newValue);
        setFormData((prevData) => ({
            ...prevData,
            organizationId: newValue ? newValue.id : "",
        }));

        // Clear error message for the field when it receives a value
        if (newValue) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                organizationId: "", // Clear error message if field has a value
            }));
        } else {
            // If field value becomes empty, show error message
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                organizationId: "Organization is required",
            }));
        }
    };

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
            { name: "description", value: formData.description },
            { name: "organizationId", value: formData.organizationId }
        ];

        // Validate all fields before submission
        const errors = validateForm(fieldsToValidate);

        // Update field errors
        setFieldErrors(errors);

        // Define success messages for different modal types
        const successMessages = {
            add: "Project added successfully",
            edit: "Project updated successfully",
            delete: "Project deleted successfully"
        };

        // Define actions for different modal types
        const actions = {
            add: () => createProject(formData),
            edit: () => updateProject(formData.id, formData),
            delete: () => deleteProject(Number(project.id))
        };

        try {
            setLoading(true);
            const responseData = Object.keys(errors).length === 0 && await actions[modalType]();
            console.log(responseData)

            // Check the response and update the form data with success or error message
            if (responseData.message === successMessages[modalType] || typeof responseData === 'object') {
                fetchProjects && fetchProjects();
                setFormData({
                    name: "",
                    code: "",
                    description: "",
                    organizationId: "",
                    success: responseData.message ? responseData.message : successMessages[modalType],
                    error: "",
                });
                setSelectedOrganization(null);
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    error: responseData.message,
                }));
            }
        } catch (error) {
            console.log(error);
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
                        <DeleteText message={"Project"} />
                    ) : (
                        <div>
                            <div className="flex flex-col space-y-1 w-full">
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    loading={autocompleteLoading}
                                    value={selectedOrganization}
                                    onChange={handleAutocompleteChange}
                                    options={options}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Organization"
                                            inputRef={autocompleteRef}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {autocompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                            error={!!(fieldErrors.organizationId)} // Set error prop based on field error
                                            helperText={fieldErrors.organizationId} // Provide the error message
                                        />
                                    )}
                                    getOptionKey={(option) => option.id}
                                    autoFocus
                                />
                            </div>
                            <div className="flex flex-col space-y-1 w-full py-4">
                                <TextField
                                    id="code"
                                    variant="outlined"
                                    name="code"
                                    autoComplete="code"
                                    label="Code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    fullWidth
                                    error={!!(fieldErrors.code)} // Set error prop based on field error
                                    helperText={fieldErrors.code} // Provide the error message
                                />
                            </div>
                            <div className="flex flex-col space-y-1 w-full mb-4">
                                <TextField
                                    id="name"
                                    variant="outlined"
                                    name="name"
                                    autoComplete="name"
                                    label="Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    fullWidth
                                    error={!!(fieldErrors.name)} // Set error prop based on field error
                                    helperText={fieldErrors.name} // Provide the error message
                                />
                            </div>
                            <div className="flex flex-col space-y-1 w-full">
                                <TextField
                                    id="description"
                                    variant="outlined"
                                    name="description"
                                    label="Description"
                                    autoComplete="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    error={!!(fieldErrors.description)} // Set error prop based on field error
                                    helperText={fieldErrors.description} // Provide the error message
                                />
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col space-y-1 w-full pb-4 md:pb-6 mt-4">
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

export default ProjectModal;

