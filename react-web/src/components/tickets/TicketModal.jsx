import React, { useState, useEffect, useRef } from "react";
import { TextField, CircularProgress, Autocomplete, Chip, Paper, IconButton } from "@mui/material";
import useCrud from '../../hooks/useCrud';
import CustomButton from "../common/CustomButton";
import DeleteText from "../common/DeleteText";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import ModalOverlay from "../common/ModalOverlay";
import EmailField from "./EmailField";

const TicketModal = ({ modalType, ticket, closeModal, fetchTickets, topic }) => {
    // Destructuring service or api calls functions
    const { getAll, create, update, remove, loading } = useCrud();

    // State to manage form data
    const [formData, setFormData] = useState({
        topicId: "",
        title: "",
        description: "",
        priority: "",
        requestedBy: "",
        attachments: [],
        fyiTo: [],
        success: "",
        error: "",
        id: ""
    });

    // State to manage individual field errors
    const [fieldErrors, setFieldErrors] = useState({
        topicId: "",
        title: "",
        description: "",
        priority: "",
        requestedBy: "",
        attachments: "",
        fyiTo: "",
    });

    // Priority AutoComplete's options
    const priorityOptions = [
        { id: 1, name: "Urgent", value: "P1" },
        { id: 2, name: "High", value: "P2" },
        { id: 3, name: "Medium", value: "P3" },
        { id: 4, name: "Low", value: "P4" },
        { id: 5, name: "Normal", value: "P5" },
    ];


    // State to manage selected priority option
    const [selectedPriority, setSelectedPriority] = useState(null);
    // State to manage Material Ui AutoComplete UI loading status
    const [autocompleteLoading, setAutocompleteLoading] = useState(false);
    // State to manage Material Ui AutoComplete UI options
    const [options, setOptions] = useState([]);
    // State to manage Material Ui AutoComplete UI selected option
    const [selectedTopic, setSelectedTopic] = useState(null);
    // Reference for the autocomplete field
    const autocompleteRef = useRef(null);
    // url for fetch all topic for material ui AutoComplete component
    const topicUrl = "/topics";

    // Object to show button labels based on the modal type
    const buttonLabels = {
        add: "Create Ticket", // Label for the "add" modal type
        edit: "Update Ticket", // Label for the "edit" modal type
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
        add: "Create Ticket", // Label for the "add" modal type
        edit: "Edit Ticket", // Label for the "edit" modal type
        delete: "Delete Ticket" // Label for the "delete" modal type
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
        } else setSelectedTopic(null);
    }, [modalType]);

    // Fetch all topics for the Autocomplete options
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const data = await getAll(topicUrl);
                const formattedOptions = data?.map(topic => ({ id: topic.id, name: topic.name, value: topic.id }));
                setOptions(formattedOptions);
            } catch (error) {
                // Handle error here
                console.log(error);
            } finally {
                // Set autocompleteLoading to false when data is fetched
                setAutocompleteLoading(false);
            }
        };

        fetchTopics();
    }, []);

    // Effect to initialize form data based on modal type and ticket(passed props)
    useEffect(() => {
        if (modalType === 'edit' && ticket && options.length > 0) {
            const { topicId, title, description, priority, requestedBy, attachments, fyiTo, id } = ticket;
            const matchedTopic = options?.find(option => option.id === topicId);
            const matchedPriority = priorityOptions?.find(option => option.value === priority);

            // To prefill the material ui AutoComplete component
            matchedTopic && setSelectedTopic(matchedTopic);
            // To prefill Priority material ui AutoComplete component
            matchedPriority && setSelectedPriority(matchedPriority);

            setFormData({
                ...formData,
                id: id || "",
                topicId: topicId || "",
                title: title,
                description: description || "",
                priority: priority || "",
                requestedBy: requestedBy || "",
                attachments: attachments || [],
                fyiTo: fyiTo || "",
                success: false,
                error: false,
            });
        } else if (modalType === 'add' && topic !== null) {
            const matchedTopic = options.find(option => option.id === topic.id);

            setSelectedTopic(matchedTopic);
            setFormData(prevData => ({
                ...prevData,
                topicId: topic.id,
            }));
        } else {
            // Clear form data if modalType is not 'edit'
            setFormData({
                ...formData,
                topicId: "",
                title: "",
                description: "",
                priority: "",
                requestedBy: "",
                attachments: "",
                fyiTo: "",
                id: "",
            });

            // Clear empty field error on close modal
            setFieldErrors({
                topicId: "",
                title: "",
                description: "",
                priority: "",
                requestedBy: "",
                attachments: "",
                fyiTo: "",
            });

            // Reset selectedTopic state
            setSelectedTopic(null);
            setSelectedCcEmails([])
        }
    }, [modalType, ticket, options, topic]);

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
        setSelectedTopic(newValue);
        setFormData((prevData) => ({
            ...prevData,
            topicId: newValue ? newValue.id : "",
        }));

        // Clear error message for the field when it receives a value
        if (newValue) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                topicId: "", // Clear error message if field has a value
            }));
        } else {
            // If field value becomes empty, show error message
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                topicId: "Organization is required",
            }));
        }
    };

    // Function to handle form Material UI Autocomplete component changes
    const handlePriorityChange = (event, newValue) => {
        setSelectedPriority(newValue);
        console.log(newValue);
        setFormData((prevData) => ({
            ...prevData,
            priority: newValue ? newValue.value : "",
        }));

        // Clear error message for the field when it receives a value
        if (newValue) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                priority: "", // Clear error message if field has a value
            }));
        } else {
            // If field value becomes empty, show error message
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                priority: "Priority is required",
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

    const [selectedCcEmails, setSelectedCcEmails] = useState([]);

    useEffect(() => {
        { console.log(selectedCcEmails) }
    },[selectedCcEmails])

    // Callback function to receive selected values
    // const handleCcEmailsChange = (emails) => {
    //     setSelectedCcEmails(emails);
    //     console.log(selectedCcEmails)
    // };

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
            { name: "topicId", value: formData.topicId },
            { name: "title", value: formData.title },
            { name: "description", value: formData.description },
            { name: "priority", value: formData.priority },
            { name: "requestedBy", value: formData.requestedBy },
            { name: "attachments", value: formData.attachments },
            { name: "fyiTo", value: formData.fyiTo }
        ];

        // Validate all fields before submission
        const errors = validateForm(fieldsToValidate);

        // Update field errors
        setFieldErrors(errors);

        // Define success messages for different modal types
        const successMessages = {
            add: "Ticket created successfully",
            edit: "Ticket updated successfully",
            delete: "Ticket deleted successfully"
        };

        // Define actions for different modal types
        const actions = {
            add: () => create(formData),
            edit: () => update(formData.id, formData),
            delete: () => remove(Number(ticket.id))
        };

        try {
            const responseData = Object.keys(errors).length === 0 && await actions[modalType]();
            console.log(responseData)

            // Check the response and update the form data with success or error message
            if (responseData.message === successMessages[modalType] || typeof responseData === 'object') {
                fetchTickets && fetchTickets();
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
                        <DeleteText message={"Ticket"} />
                    ) : (
                        <div>
                            <div className="flex flex-col space-y-1 w-full py-4">
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    loading={autocompleteLoading}
                                    value={selectedTopic}
                                    onChange={handleAutocompleteChange}
                                    options={options}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Topic"
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
                                            error={Boolean(fieldErrors.topicId)} // Set error prop based on field error
                                            helperText={fieldErrors.topicId} // Provide the error message
                                        />
                                    )}
                                    getOptionKey={(option) => option.id}
                                    autoFocus
                                />
                            </div>
                            <div className="flex flex-col space-y-1 w-full mb-4">
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo1"
                                    loading={autocompleteLoading}
                                    value={selectedPriority}
                                    onChange={handlePriorityChange}
                                    options={priorityOptions}
                                    getOptionLabel={(priorityOption) => priorityOption.name}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Priority"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {autocompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                            error={Boolean(fieldErrors.priority)} // Set error prop based on field error
                                            helperText={fieldErrors.priority} // Provide the error message
                                        />
                                    )}
                                    getOptionKey={(priorityOptions) => priorityOptions.id}
                                />
                            </div>
                            <div className="flex flex-col space-y-1 w-full mb-4">
                                <TextField
                                    id="title"
                                    variant="outlined"
                                    name="title"
                                    autoComplete="title"
                                    label="Title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    fullWidth
                                    error={Boolean(fieldErrors.title)} // Set error prop based on field error
                                    helperText={fieldErrors.title} // Provide the error message
                                />
                            </div>
                            <div className="flex flex-col space-y-1 w-full mb-4">
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
                                    error={Boolean(fieldErrors.description)} // Set error prop based on field error
                                    helperText={fieldErrors.description} // Provide the error message
                                />
                            </div>
                            <div className="flex flex-col space-y-1 w-full mb-4">
                                <TextField
                                    name="requestedBy"
                                    value={formData.requestedBy}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    className="w-full"
                                    id="requestedBy"
                                    label="Requested By"
                                    fullWidth
                                    autoComplete="requestedBy"
                                    error={Boolean(fieldErrors.requestedBy)} // Set error prop based on field error
                                    helperText={fieldErrors.requestedBy} // Provide the error message
                                />
                            </div>

                            <div className="flex flex-col space-y-1 w-full mb-4">
                                {/* <EmailField label="To" emails={toEmails} setEmails={setToEmails} /> */}
                                <EmailField setSelectedCcEmails={setSelectedCcEmails} />
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

export default TicketModal;

