import React, { useState, useEffect, useRef } from "react";
import { TextField, CircularProgress, Autocomplete, Chip } from "@mui/material";
import useSupportTeamService from '../../hooks/useSupportTeamService';
import useUserService from '../../hooks/useUserService';
import CustomButton from "../common/CustomButton";
import DeleteText from "../common/DeleteText";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import ModalOverlay from "../common/ModalOverlay";

const SupportTeamModal = ({ modalType, supportTeam, closeModal, fetchSupportTeams }) => {
    // Destructuring service or api calls functions
    const { createSupportTeam, updateSupportTeam, deleteSupportTeam } = useSupportTeamService();
    const { getAllUsers } = useUserService();

    // State to manage form data
    const [formData, setFormData] = useState({
        name: "",
        userIds: [],
        success: "",
        error: "",
        id: ""
    });

    // State to manage individual field errors
    const [fieldErrors, setFieldErrors] = useState({
        name: "",
        userIds: ""
    });

    // State to manage loading status
    const [loading, setLoading] = useState(false);
    // State to manage Material UI Autocomplete UI loading status
    const [autocompleteLoading, setAutocompleteLoading] = useState(false);
    // State to manage Material UI Autocomplete UI options
    const [options, setOptions] = useState([]);
    // State to manage Material UI Autocomplete UI selected options
    const [selectedUsers, setSelectedUsers] = useState([]);
    // Reference for the autocomplete field
    const autocompleteRef = useRef(null);

    // Object to show button labels based on the modal type
    const buttonLabels = {
        add: "Create Support Team", // Label for the "add" modal type
        edit: "Update Support Team", // Label for the "edit" modal type
        delete: "Confirm" // Label for the "delete" modal type
    };

    // Object to show button icons based on the modal type
    const buttonIcons = {
        add: <FaCirclePlus />,  // Icon for the "add" modal type
        edit: <FaEdit />, // Icon for the "edit" modal type
        delete: <FaTrashAlt /> // Icon for the "delete" modal type
    };

    // Object to show Modal Header Name based on the modal type
    const modalName = {
        add: "Add Support team", // Header for the "add" modal type
        edit: "Edit Support team", // Header for the "edit" modal type
        delete: "Delete Support team" // Header for the "delete" modal type
    };

    // Effect to focus on the autocomplete field when the modal opens
    useEffect(() => {
        if (modalType === 'add' || modalType === 'edit') {
            setAutocompleteLoading(true);
            setTimeout(() => {
                setAutocompleteLoading(false);
                if (autocompleteRef.current) {
                    autocompleteRef.current.focus();  // AutoFocus on the autocomplete field
                }
            }, 1000);
        }
    }, [modalType]);

    // Fetch all users for the Autocomplete options
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                const formattedOptions = data.map(user => ({ id: user.id, name: user.name, value: user.id }));
                setOptions(formattedOptions);
            } catch (error) {
                console.log(error);
            } finally {
                setAutocompleteLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Effect to initialize form data based on modal type and supportTeam prop
    useEffect(() => {
        if (modalType === 'edit' && supportTeam && options.length > 0) {
            const { name, id, Users } = supportTeam;
            const matchedUsers = Users.map(user => options.find(option => option.id === user.id));

            // To prefilled the material ui AutoComplete component
            setSelectedUsers(matchedUsers);

            setFormData({
                ...formData,
                userIds: matchedUsers.map(user => user.id) || [],
                name: name || "",
                id: id || "",
                success: false,
                error: false,
            });
        } else if (modalType === 'add') {
            setFormData({
                name: "",
                userIds: [],
                success: false,
                error: false,
            });
        }

        // Clear empty field error on close modal
        setFieldErrors({
            name: "",
            userIds: "",
        });
    }, [modalType, supportTeam, options]);

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

    // Handle changes in Autocomplete selection
    const handleAutocompleteChange = (event, newValue) => {
        setSelectedUsers(newValue);
        setFormData((prevData) => ({
            ...prevData,
            userIds: newValue ? newValue.map(user => user.id) : [],
        }));

        // Clear error message for the field when it receives a value
        if (newValue) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                userIds: "", // Clear error message if field has a value
            }));
        } else {
            // If field value becomes empty, show error message
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                userIds: "Users is required",
            }));
        }
    };

    // Handle changes in input fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Define fields to validate
        const fieldsToValidate = [
            { name: "name", value: formData.name },
            { name: "userIds", value: formData.userIds }
        ];

        // Validate all fields before submission
        const errors = validateForm(fieldsToValidate);

        // Update field errors
        setFieldErrors(errors);

        // Define success messages for different modal types
        const successMessages = {
            add: "Support Team added successfully",
            edit: "Support Team updated successfully",
            delete: "Support Team deleted successfully"
        };

        // Define actions for different modal types
        const actions = {
            add: () => createSupportTeam(formData),
            edit: () => updateSupportTeam(formData.id, formData),
            delete: () => deleteSupportTeam(supportTeam.id)
        };

        // const userIds = selectedUsers?.map(u => u.id);
        // let supportTeam = { name: formData.name, userIds: userIds };

        try {
            setLoading(true);
            console.log(formData);
            // return;
            const responseData = Object.keys(errors).length === 0 && await actions[modalType]();
            console.log(responseData)

            // Check the response and update the form data with success or error message
            if (responseData.message === successMessages[modalType] || typeof responseData === 'object') {
                fetchSupportTeams();
                setFormData({
                    name: "",
                    userIds: [],
                    success: responseData.message ? responseData.message : successMessages[modalType],
                    error: "",
                });
                setSelectedUsers([]);
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
        <ModalOverlay
            modalType={modalType}
            closeModal={closeModal}
            modalName={modalName[modalType]}
            formData={formData}
        >
            <form className="w-100" onSubmit={handleSubmit}>
                {modalType === 'delete' ? (
                    <DeleteText message={"Support team"} />
                ) : (
                    <div>
                        <div className="d-flex flex-column w-100 mb-4">
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
                                autoFocus
                            />
                        </div>
                        <div className="d-flex flex-column w-100 mb-4">
                            <Autocomplete
                                multiple
                                id="controllable-states-demo"
                                loading={autocompleteLoading}
                                value={selectedUsers}
                                onChange={handleAutocompleteChange}
                                options={options}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Users"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {autocompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                        error={!!(fieldErrors.userIds)} // Set error prop based on field error
                                        helperText={fieldErrors.userIds} // Provide the error message
                                    />
                                )}
                                getOptionKey={(option) => option.id}
                            />
                        </div>
                    </div>
                )}
                <div className="d-flex flex-column w-100 mt-4">
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
    );
};

export default SupportTeamModal;
