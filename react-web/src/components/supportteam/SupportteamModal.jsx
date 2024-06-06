import React, { useState, useEffect, useRef } from "react";
import { TextField, CircularProgress, Autocomplete } from "@mui/material";
import useSupportteamService from '../../hooks/useSupportteamService';
import useUserService from '../../hooks/useUserService';
import CustomButton from "../common/CustomButton";
import DeleteText from "../common/DeleteText";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import ModalOverlay from "../common/ModalOverlay";

const SupportteamModal = ({ modalType, supportteam, closeModal, fetchSupportteam, users }) => {
    // Destructuring service or api calls functions
    const { createSupportteam, updateSupportteam, deleteSupportteam } = useSupportteamService();
    const { getAllUsers } = useUserService();

    // State to manage form data
    const [formData, setFormData] = useState({
        userIds: users !== null ? users.id : "",
        name: "",
        success: "",
        error: "",
        id: ""
    });

    // State to manage individual field errors
    const [fieldErrors, setFieldErrors] = useState({
        name: "",
        userIds: "",
    });

    // State to manage loading status
    const [loading, setLoading] = useState(false);
    // State to manage Material Ui AutoComplete UI loading status
    const [autocompleteLoading, setAutocompleteLoading] = useState(false);
    // State to manage Material Ui AutoComplete UI options
    const [options, setOptions] = useState([]);
    // State to manage Material Ui AutoComplete UI selected option
    const [selectedUser, setSelectedUser] = useState([]);
    // Reference for the autocomplete field
    const autocompleteRef = useRef(null);

    // Object to show button labels based on the modal type
    const buttonLabels = {
        add: "Create Support team", // Label for the "add" modal type
        edit: "Update Support team", // Label for the "edit" modal type
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
        add: "Add Support team", // Label for the "add" modal type
        edit: "Edit Support team", // Label for the "edit" modal type
        delete: "Delete Support team" // Label for the "delete" modal type
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
        } else setSelectedUser(null);
    }, [modalType]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                const formattedOptions = data.map(users => ({ id: users.id, name: users.name, value: users.id }));
                setOptions(formattedOptions);
            } catch (error) {
                // Handle error here
                console.log(error);
            } finally {
                // Set autocompleteLoading to false when data is fetched
                setAutocompleteLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (modalType === 'edit' && supportteam && options.length > 0) {
            const { name, id, userIds } = supportteam;
            const matchedUser = options.find(option => option.id === userIds);

            setSelectedUser(matchedUser);
            setFormData({
                ...formData,
                userIds: userIds || "",
                name: name || "",
                id: id || "",
                success: false,
                error: false,
            });
        } else if (modalType === 'add') {
            const matchedUser = options.find(option => option.id === users.id);

            setSelectedUser(matchedUser);
            setFormData(prevData => ({
                ...prevData,
                userIds: users.id,
            }));
        } else {
            // Clear form data if modalType is not 'edit'
            setFormData({
                ...formData,
                userIds: users !== null ? users.id : "",
                name: "",
                success: "",
                error: "",
                id: "",
            });

            // Clear empty field error on close modal
            setFieldErrors({
                name: "",
                userIds: "",
            });

            setSelectedUser(null);
        }
    }, [modalType, supportteam, options, users]);

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
        setSelectedUser(newValue);
        setFormData((prevData) => ({
            ...prevData,
            userIds: newValue ? newValue.id : "",
        }));

        // Clear error message for the field when it receives a value
        if (newValue) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                userIds: "", 
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
        const fieldsToValidate = [
            { name: "name", value: formData.name },
        ];

        const errors = validateForm(fieldsToValidate);
        setFieldErrors(errors);
        const successMessages = {
            add: "Support team added successfully",
            edit: "Support team updated successfully",
            delete: "Support team deleted successfully"
        };

        const actions = {
            add: () => createSupportteam(formData),
            edit: () => updateSupportteam(formData.id, formData),
            delete: () => deleteSupportteam(supportteam.id)
        };

        try {
            setLoading(true);
            const responseData = Object.keys(errors).length === 0 && await actions[modalType]();
            console.log(responseData)

            // Check the response and update the form data with success or error message
            if (responseData.message === successMessages[modalType] || typeof responseData === 'object') {
                fetchSupportteam && fetchSupportteam();
                setFormData({
                    name: "",
                    userIds: "",
                    success: responseData.message ? responseData.message : successMessages[modalType],
                    error: "",
                });
                setSelectedUser(null);
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
                        <DeleteText message={"Support team"} />
                    ) : (
                        <div>
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
                                    error={Boolean(fieldErrors.name)} // Set error prop based on field error
                                    helperText={fieldErrors.name} // Provide the error message
                                />
                            </div>
                            <div className="flex flex-col space-y-1 w-full mb-4">
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    loading={autocompleteLoading}
                                    value={selectedUser}
                                    onChange={handleAutocompleteChange}
                                    options={options}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Users"
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
                                        />
                                    )}
                                    getOptionKey={(option) => option.id}
                                    autoFocus
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

export default SupportteamModal;

