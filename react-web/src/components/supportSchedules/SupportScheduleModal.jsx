import React, { useState, useEffect, useRef } from "react";
import { TextField, CircularProgress, Autocomplete } from "@mui/material";
import useCrud from '../../hooks/useCrud';
import CustomButton from "../common/CustomButton";
import DeleteText from "../common/DeleteText";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import ModalOverlay from "../common/ModalOverlay";

const SupportScheduleModal = ({ modalType, supportSchedule, closeModal, fetchSupportSchedules }) => {
    // Destructuring service or api calls functions
    const { create, update, remove, getAll } = useCrud();
    const usersUrl = "/users";
    const supportTeamsUrl = "/support-teams";
    const supportSchedulesUrl = "/support-schedules";

    // State to manage form data
    const [formData, setFormData] = useState({
        startTime: "",
        endTime: "",
        escalationLevel: "",
        supportTeamId: "",
        userId: "",
        success: "",
        error: "",
        id: ""
    });

    // State to manage individual field errors
    const [fieldErrors, setFieldErrors] = useState({
        startTime: "",
        endTime: "",
        escalationLevel: "",
        supportTeamId: "",
        userId: "",
    });

    // State to manage loading status
    const [loading, setLoading] = useState(false);
    // State to manage Material Ui AutoComplete UI loading status
    const [autocompleteLoading, setAutocompleteLoading] = useState(false);
    // State to manage Material Ui AutoComplete UI options
    const [userOptions, setUserOptions] = useState([]);
    // State to manage Material Ui AutoComplete UI options
    const [supportTeamOptions, setSupportTeamOptions] = useState([]);
    // State to manage Material Ui AutoComplete UI selected option
    const [selectedSupportTeam, setSelectedSupportTeam] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    // Reference for the autocomplete field
    const autocompleteRef = useRef(null);

    // Object to show button labels based on the modal type
    const buttonLabels = {
        add: "Create Support Team Schedule", // Label for the "add" modal type
        edit: "Update Support Team Schedule", // Label for the "edit" modal type
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
        add: "Add Support Team Schedule", // Label for the "add" modal type
        edit: "Edit Support Team Schedule", // Label for the "edit" modal type
        delete: "Delete Support Team Schedule" // Label for the "delete" modal type
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

    // Function to handle fetch users
    const fetchUsers = async () => {
        try {
            const data = await getAll(usersUrl);
            console.log(data)
            const formattedOptions = data.map(user => ({ id: user.id, name: user.name, value: user.id }));
            setUserOptions(formattedOptions);
        } catch (error) {
            // Handle error here
            console.log(error);
        } finally {
            // Set autocompleteLoading to false when data is fetched
            setAutocompleteLoading(false);
        }
    };

    // Function to handle fetch support team members
    const fetchSupportTeam = async () => {
        try {
            const data = await getAll(supportTeamsUrl);
            console.log(data)
            const formattedOptions = data.map(supportTeam => ({ id: supportTeam.id, name: supportTeam.name, value: supportTeam.id }));
            setSupportTeamOptions(formattedOptions);
        } catch (error) {
            // Handle error here
            console.log(error);
        } finally {
            // Set autocompleteLoading to false when data is fetched
            setAutocompleteLoading(false);
        }
    };

    // Fetch all users for the Autocomplete user and support team Options
    useEffect(() => {
        fetchUsers();
        fetchSupportTeam();
    }, []);

    // Effect to initialize form data based on modal type and supportSchedule(passed props)
    useEffect(() => {
        if (modalType === 'edit' && supportSchedule && userOptions.length > 0 && supportTeamOptions.length > 0 ) {
            const { startTime, endTime, escalationLevel, supportTeamId, id, userId } = supportSchedule;
            const matchedUser = userOptions.find(userOption => userOption.id === userId);
            const matchedSupport = supportTeamOptions.find(supportTeamOption => supportTeamOption.id === supportTeamId);

            // To prefilled the material ui AutoComplete component
            setSelectedUser(matchedUser);
            setSelectedSupportTeam(matchedSupport);
            setFormData({
                ...formData,
                userId: userId || "",
                startTime: startTime || "",
                endTime: endTime || "",
                escalationLevel: escalationLevel || "",
                supportTeamId: supportTeamId || "",
                id: id || "",
                success: false,
                error: false,
            });
        } else {
            // Clear form data if modalType is not 'edit'
            setFormData({
                ...formData,
                startTime: "",
                endTime: "",
                escalationLevel: "",
                supportTeamId: "",
                userId: "",
                success: "",
                error: "",
                id: ""
            });

            // Clear empty field error on close modal
            setFieldErrors({
                startTime: "",
                endTime: "",
                escalationLevel: "",
                supportTeamId: "",
                userId: "",
            });

            // Reset selectedUser state
            setSelectedUser(null);
            // Reset selectedSupportTeam state
            setSelectedSupportTeam(null);
        }
    }, [modalType, supportSchedule, userOptions, supportTeamOptions]);

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

    // Function to handle form User component changes
    const handleUserChange = (event, newValue) => {
        setSelectedUser(newValue);
        setFormData((prevData) => ({
            ...prevData,
            userId: newValue ? newValue.id : "",
        }));

        // Clear error message for the field when it receives a value
        if (newValue) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                userId: "", // Clear error message if field has a value
            }));
        } else {
            // If field value becomes empty, show error message
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                userId: "User is required",
            }));
        }
    };

    // Function to handle form User component changes
    const handleSupportTeamChange = (event, newValue) => {
        setSelectedSupportTeam(newValue);
        setFormData((prevData) => ({
            ...prevData,
            supportTeamId: newValue ? newValue.id : "",
        }));

        // Clear error message for the field when it receives a value
        if (newValue) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                supportTeamId: "", // Clear error message if field has a value
            }));
        } else {
            // If field value becomes empty, show error message
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                supportTeamId: "Support Team is required",
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
            { name: "startTime", value: formData.startTime },
            { name: "endTime", value: formData.endTime },
            { name: "escalationLevel", value: formData.escalationLevel },
            { name: "supportTeamId", value: formData.supportTeamId },
            { name: "userId", value: formData.userId }
        ];

        // Validate all fields before submission
        const errors = validateForm(fieldsToValidate);

        // Update field errors
        setFieldErrors(errors);

        // Define success messages for different modal types
        const successMessages = {
            add: "Support Schedule added successfully",
            edit: "Support Schedule updated successfully",
            delete: "Support Schedule deleted successfully"
        };

        // Define actions for different modal types
        const actions = {
            add: () => create(supportSchedulesUrl, formData),
            edit: () => update(supportSchedulesUrl, formData.id, formData),
            delete: () => remove(supportSchedulesUrl, supportSchedule.id)
        };

        try {
            setLoading(true);
            const responseData = Object.keys(errors).length === 0 && await actions[modalType]();
            console.log(responseData)

            // Check the response and update the form data with success or error message
            if (responseData.message === successMessages[modalType] || typeof responseData === 'object') {
                fetchSupportSchedules && fetchSupportSchedules();
                setFormData({
                    startTime: "",
                    endTime: "",
                    escalationLevel: "",
                    supportTeamId: "",
                    userId: "",
                    success: responseData.message ? responseData.message : successMessages[modalType],
                    error: "",
                });
                setSelectedUser(null);
                setSelectedSupportTeam(null);
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
                        <DeleteText message={"SupportSchedule"} />
                    ) : (
                        <div>
                            <div className="flex flex-col space-y-1 w-full mb-4">
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    loading={autocompleteLoading}
                                    value={selectedUser}
                                    onChange={handleUserChange}
                                    options={userOptions}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select User"
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
                                            error={Boolean(fieldErrors.userId)} // Set error prop based on field error
                                            helperText={fieldErrors.userId} // Provide the error message
                                        />
                                    )}
                                    getOptionKey={(option) => option.id}
                                    autoFocus
                                />
                            </div>
                            <div className="flex flex-col space-y-1 w-full mb-4">
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    loading={autocompleteLoading}
                                    value={selectedSupportTeam}
                                    onChange={handleSupportTeamChange}
                                    options={supportTeamOptions}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Support Team"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {autocompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                            error={Boolean(fieldErrors.supportTeamId)} // Set error prop based on field error
                                            helperText={fieldErrors.supportTeamId} // Provide the error message
                                        />
                                    )}
                                    getOptionKey={(option) => option.id}
                                />
                            </div>
                            <div className="flex flex-col space-y-1 w-full mb-4">
                                <TextField
                                    id="startTime"
                                    variant="outlined"
                                    name="startTime"
                                    autoComplete="startTime"
                                    label="Start Time"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    fullWidth
                                    error={Boolean(fieldErrors.startTime)} // Set error prop based on field error
                                    helperText={fieldErrors.startTime} // Provide the error message
                                />
                            </div>
                            <div className="flex flex-col space-y-1 w-full">
                                <TextField
                                    id="endTime"
                                    variant="outlined"
                                    name="endTime"
                                    autoComplete="endTime"
                                    label="End Time"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    error={Boolean(fieldErrors.endTime)} // Set error prop based on field error
                                    helperText={fieldErrors.endTime} // Provide the error message
                                />
                            </div>
                            <div className="flex flex-col space-y-1 w-full">
                                <TextField
                                    id="escalationLevel"
                                    variant="outlined"
                                    name="escalationLevel"
                                    autoComplete="escalationLevel"
                                    label="Escalation Level"
                                    value={formData.escalationLevel}
                                    onChange={handleInputChange}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    error={Boolean(fieldErrors.escalationLevel)} // Set error prop based on field error
                                    helperText={fieldErrors.escalationLevel} // Provide the error message
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

export default SupportScheduleModal;

