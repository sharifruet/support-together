import React, { useState, useEffect, useRef, useContext } from "react";
import { TextField, CircularProgress, Autocomplete } from "@mui/material";
import useCrud from '../../hooks/useCrud';
import CustomButton from "../common/CustomButton";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import EmailField from "./EmailField";
import CustomFileAttachment from "../common/CustomFileAttachment";
import { toast } from 'react-toastify';
import GlobalContext from "../../GlobalContext";


const TicketModal = () => {
    // Destructuring service or api calls functions
    const { getAll, create, update, remove } = useCrud();

    // State to manage loading status
    const [loading, setLoading] = useState(false);
    // State to manage selected priority option
    const [selectedPriority, setSelectedPriority] = useState(null);
    // State to manage Material Ui AutoComplete UI loading status
    const [autocompleteLoading, setAutocompleteLoading] = useState(false);
    // State to manage Topic loading status
    const [topicLoading, setTopicLoading] = useState(false);
    // State to manage Material Ui AutoComplete UI options
    const [topicOptions, setTopicOptions] = useState([]);
    // State to manage Material Ui AutoComplete UI selected option
    const [selectedTopic, setSelectedTopic] = useState(null);
    // Reference for the autocomplete field
    const projectRef = useRef(null);
    // State to manage fyiTo
    const [selectedCcEmails, setSelectedCcEmails] = useState([]);
    // State to manage attachments
    const [selectedAttachments, setSelectedAttachments] = useState([]);
    // State to clear child component data
    const [clear, setClear] = useState(false);
    // url for fetch all topic for material ui AutoComplete component
    const topicUrl = "/topics";
    // url for ticket crud
    const ticketUrl = "/tickets";
    const projectUrl = "/projects";
    const getTicketByProjectUrl = "/tickets/project";
    const { user } = useContext(GlobalContext);
    const [projects, setProjects] = useState([]);
    const [fyiToError, setFyiToError] = useState([]);

    // State to manage Material Ui AutoComplete UI options
    const [projectOptions, setProjectOptions] = useState([]);

    // State to manage Material Ui AutoComplete UI selected option
    const [selectedProject, setSelectedProject] = useState(null);

    // State to manage form data
    const [formData, setFormData] = useState({
        project: "",
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
        project: "",
        topicId: "",
        title: "",
        description: "",
        priority: "",
        requestedBy: "",
        // attachments: "",
        // fyiTo: "",
    });

    // Priority AutoComplete's options
    const priorityOptions = [
        { id: 1, name: "P1", value: "P1" },
        { id: 2, name: "P2", value: "P2" },
        { id: 3, name: "P3", value: "P3" },
        { id: 4, name: "P4", value: "P4" },
        { id: 5, name: "P5", value: "P5" },
    ];

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
        setAutocompleteLoading(true);
        setTimeout(() => {
            setAutocompleteLoading(false);
            if (projectRef.current) {
                projectRef.current.focus();  // AutoFocus on the autocomplete field
            }
        }, 1000);
    }, []);




    // Fetch all topics for the Autocomplete options
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getAll(projectUrl);
                const filteredProjects = data?.filter(project => {
                    return user?.roles?.some(role => role.projectId === project.id);
                });
                setProjects(filteredProjects);
                const formattedProjectOptions = filteredProjects?.map(project => ({ id: project.id, name: project.name, value: project.id }));
                setProjectOptions(formattedProjectOptions);
            } catch (error) {
                console.error(error);
            }
        };

        if (user) fetchProjects();
    }, [user]);


    // Function to show topic dropdown options
    const fetchTopicsByProjectId = async (projectId) => {
        try {
            setTopicLoading(true);
            const data = await getAll(topicUrl);
            const filteredTopics = data?.filter(topic => {
                return topic.ProjectId === projectId;
            });
            const formattedTopicOptions = filteredTopics?.map(topic => ({ id: topic.id, name: topic.name, value: topic.id }));
            setTopicOptions(formattedTopicOptions);
        } catch (error) {
            // Handle error here
            console.log(error);
        } finally {
            // Set autocompleteLoading to false when data is fetched
            setTimeout(() => {
                setTopicLoading(false);
            }, 1000);
        }
    };

    // Effect to set Fyi to
    useEffect(() => {
        if (selectedCcEmails?.length > 0) {
            setFormData(prevData => ({
                ...prevData,
                fyiTo: selectedCcEmails,
            }));
        }
    }, [selectedCcEmails]);

    // Effect to set Attachments
    useEffect(() => {
        if (selectedAttachments?.length > 0) {
            setFormData(prevData => ({
                ...prevData,
                attachments: selectedAttachments,
            }));
        }
    }, [selectedAttachments]);

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
    const handleProjectChange = (event, newValue) => {
        setSelectedProject(newValue);
        newValue && fetchTopicsByProjectId(newValue.id)
        console.log(newValue)
        setFormData((prevData) => ({
            ...prevData,
            project: newValue ? newValue.id : "",
        }));


        // Clear error message for the field when it receives a value
        if (newValue) {
            console.log(formData)
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                project: "", // Clear error message if field has a value
            }));
        } else {
            // If field value becomes empty, show error message
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                project: "Project is required",
            }));
        }
    };

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
                topicId: "Topic is required",
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
            { name: "project", value: formData.project },
            { name: "topicId", value: formData.topicId },
            { name: "title", value: formData.title },
            { name: "description", value: formData.description },
            { name: "priority", value: formData.priority },
            { name: "requestedBy", value: formData.requestedBy },
            // { name: "attachments", value: formData.attachments },
            // { name: "fyiTo", value: formData.fyiTo }
        ];

        if (fieldErrors.fyiTo !== "") setFyiToError(true);
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
            add: () => create(ticketUrl, formData),
            edit: () => update(ticketUrl, formData.id, formData),
            // delete: () => remove(Number(ticketUrl, ticket.id))
        };

        try {
            console.log(formData)
            setLoading(true);
            // const responseData = Object.keys(errors).length === 0 && await actions[modalType]();
            const responseData = Object.keys(errors).length === 0 && await create(ticketUrl, formData);
            console.log(responseData)

            // Check the response and update the form data with success or error message
            if (responseData.message === successMessages.add || typeof responseData === 'object') {
                // fetchTickets && fetchTickets();
                setFormData({
                    project: "",
                    topicId: "",
                    title: "",
                    description: "",
                    priority: "",
                    requestedBy: "",
                    attachments: [],
                    fyiTo: "",
                    success: responseData.message ? responseData.message : successMessages.add,
                    error: "",
                });
                toast.success('🎉 Ticket created successfully!', { className: 'toast-success' });
                setFyiToError(false);
                setClear(true);
                setSelectedProject(null);
                setSelectedTopic(null);
                setSelectedPriority(null);
                setSelectedCcEmails(null);
                setSelectedAttachments(null);
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
            <div className="text-left font-semibold text-2xl tracking-wider">Create Ticket</div>
            <form className="w-full" onSubmit={handleSubmit}>
                <div>
                    <div className="d-flex py-4">
                        <div className="flex flex-col space-y-1 w-full me-3">
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                loading={autocompleteLoading}
                                value={selectedProject}
                                onChange={handleProjectChange}
                                options={projectOptions}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Project"
                                        inputRef={projectRef}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {autocompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                        error={Boolean(fieldErrors.project)} // Set error prop based on field error
                                        helperText={fieldErrors.project} // Provide the error message
                                    />
                                )}
                                getOptionKey={(option) => option.id}
                                autoFocus
                            />
                        </div>
                        <div className="flex flex-col space-y-1 w-full me-3">
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                loading={topicLoading}
                                value={selectedTopic}
                                onChange={handleAutocompleteChange}
                                options={topicOptions}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Topic"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {topicLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                        error={Boolean(fieldErrors.topicId)} // Set error prop based on field error
                                        helperText={fieldErrors.topicId} // Provide the error message
                                    />
                                )}
                                getOptionKey={(option) => option.id}
                            />
                        </div>
                        <div className="flex flex-col space-y-1 w-full">
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
                    </div>
                    <div className="d-flex mb-4">
                        <div className="flex flex-col space-y-1 w-full me-3">
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
                        <div className="flex flex-col space-y-1 w-full me-3">
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
                        <div className="flex flex-col space-y-1 w-full">
                            <EmailField setSelectedCcEmails={setSelectedCcEmails} clear={clear} error={fyiToError} helperText={fieldErrors.fyiTo} />
                        </div>
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
                        <CustomFileAttachment setSelectedAttachments={setSelectedAttachments} clear={clear} error={fieldErrors.attachments} helperText={fieldErrors.attachments} />
                    </div>
                </div>
                <div className="flex flex-col space-y-1 justify-center pb-4 md:pb-6 mt-4">
                    {/* <div className=""> */}
                        <CustomButton
                            isLoading={loading}
                            type="submit"
                            icon={buttonIcons.add}
                            label={buttonLabels.add}
                            disabled={loading}
                            style={{maxWidth: "40px"}}
                        />
                    {/* </div> */}
                </div>
            </form>
        </>
    );
};

export default TicketModal;

