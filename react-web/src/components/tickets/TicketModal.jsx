import React, { useState, useEffect, useRef, useContext } from "react";
import { TextField, CircularProgress, Autocomplete } from "@mui/material";
import useCrud from "../../hooks/useCrud";
import CustomButton from "../common/CustomButton";
import DeleteText from "../common/DeleteText";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import ModalOverlay from "../common/ModalOverlay";
import EmailField from "./EmailField";
import CustomFileAttachment from "../common/CustomFileAttachment";
import GlobalContext from "../../GlobalContext";
import { PRIORITY_OPTIONS } from "../../conf";

const TicketModal = ({ modalType, ticket, closeModal, fetchTickets, topic, userProject }) => {
    // Destructuring service or api calls functions
    const { getAll, create, update, remove } = useCrud();
    const { user } = useContext(GlobalContext);

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
    // State to manage Material Ui AutoComplete UI options
    const [projectOptions, setProjectOptions] = useState([]);
    // State to manage Material Ui AutoComplete UI selected option
    const [selectedProject, setSelectedProject] = useState(null);
    // url for fetch all topic for material ui AutoComplete component
    const topicUrl = "/topics";
    // url for ticket crud
    const ticketUrl = "/tickets";
    const projectUrl = "/projects";

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
        id: "",
    });

    // State to manage individual field errors
    const [fieldErrors, setFieldErrors] = useState({
        project: "",
        topicId: "",
        title: "",
        description: "",
        priority: "",
        // requestedBy: "",
        // attachments: [],
        // fyiTo: [],
    });

    // Object to show button labels based on the modal type
    const buttonLabels = {
        add: "Create Ticket", // Label for the "add" modal type
        edit: "Update Ticket", // Label for the "edit" modal type
        delete: "Confirm", // Label for the "delete" modal type
    };

    // Object to show button icons based on the modal type
    const buttonIcons = {
        add: <FaCirclePlus />, // Label for the "add" modal type
        edit: <FaEdit />, // Label for the "edit" modal type
        delete: <FaTrashAlt />, // Label for the "delete" modal type
    };

    // Object to show Modal Header Name based on the modal type
    const modalName = {
        add: "Create Ticket", // Label for the "add" modal type
        edit: "Edit Ticket", // Label for the "edit" modal type
        delete: "Delete Ticket", // Label for the "delete" modal type
    };

    // loader for Material UI Autocomplete
    useEffect(() => {
        if (modalType === "add" || modalType === "edit") {
            // Set autocompleteLoading to true when modal is opened
            setAutocompleteLoading(true);
            setTimeout(() => {
                setAutocompleteLoading(false);
                if (projectRef.current) {
                    projectRef.current.focus(); // AutoFocus on the autocomplete field
                }
            }, 1000);
        } else setSelectedTopic(null);
    }, [modalType]);

    // Fetch all topics for the Autocomplete options
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getAll(projectUrl);
                const filteredProjects = data?.filter((project) => {
                    return user?.roles?.some((role) => role.projectId === project.id);
                });
                const formattedProjectOptions = filteredProjects?.map((project) => ({ id: project.id, name: project.name, value: project.id }));
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
            const filteredTopics = data?.filter((topic) => {
                return topic.ProjectId === projectId;
            });
            const formattedTopicOptions = filteredTopics?.map((topic) => ({ id: topic.id, name: topic.name, value: topic.id }));
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

    // Effect to check while the project length is 1 or more
    useEffect(() => {
        if (userProject !== null && projectOptions.length > 0) {
            const filteredProject = projectOptions.find((option) => option.id === userProject.id);
            setSelectedProject(filteredProject);
            setFormData((prevData) => ({
                ...prevData,
                project: filteredProject ? filteredProject.id : "",
            }));
        } else if (userProject === null && projectOptions.length === 1) {
            setSelectedProject(projectOptions[0]);
            setFormData((prevData) => ({
                ...prevData,
                project: projectOptions && projectOptions.length > 0 ? projectOptions[0].id : "",
            }));
        }
    }, [userProject, projectOptions]);

    // Effect to fetch topics if the project length is 1
    useEffect(() => {
        selectedProject && fetchTopicsByProjectId(selectedProject.id);
    }, [selectedProject]);

    // Effect to initialize form data based on modal type and ticket(passed props)
    useEffect(() => {
        if (modalType === "edit" && ticket && topicOptions.length > 0) {
            const { topicId, title, description, priority, requestedBy, attachments, fyiTo, id } = ticket;
            const matchedTopic = topicOptions?.find((option) => option.id === topicId);
            const matchedPriority = PRIORITY_OPTIONS?.find((option) => option.value === priority);

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
        } else if (modalType === "add" && topic !== null) {
            const matchedTopic = topicOptions.find((option) => option.id === topic.id);

            setSelectedTopic(matchedTopic);
            setFormData((prevData) => ({
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
                attachments: [],
                fyiTo: [],
            });

            // Reset selectedTopic state
            setSelectedTopic(null);
            setSelectedPriority(null);
            setSelectedCcEmails(null);
            setSelectedAttachments(null);
        }
    }, [modalType, ticket, topicOptions, topic]);

    // Effect to set Fyi to
    useEffect(() => {
        if (selectedCcEmails?.length > 0) {
            setFormData((prevData) => ({
                ...prevData,
                fyiTo: selectedCcEmails,
            }));
        }
    }, [selectedCcEmails]);

    // Effect to set Attachments
    useEffect(() => {
        if (selectedAttachments?.length > 0) {
            setFormData((prevData) => ({
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
        newValue && fetchTopicsByProjectId(newValue.id);
        console.log(newValue);
        setFormData((prevData) => ({
            ...prevData,
            project: newValue ? newValue.id : "",
        }));

        // Clear error message for the field when it receives a value
        if (newValue) {
            console.log(formData);
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
            // { name: "requestedBy", value: formData.requestedBy },
            // { name: "attachments", value: formData.attachments },
            // { name: "fyiTo", value: formData.fyiTo }
        ];

        // Validate all fields before submission
        const errors = validateForm(fieldsToValidate);

        // Update field errors
        setFieldErrors(errors);

        // Define success messages for different modal types
        const successMessages = {
            add: "Ticket created successfully",
            edit: "Ticket updated successfully",
            delete: "Ticket deleted successfully",
        };

        // Define actions for different modal types
        const actions = {
            add: () => create(ticketUrl, formData),
            edit: () => update(ticketUrl, formData.id, formData),
            delete: () => remove(Number(ticketUrl, ticket.id)),
        };

        try {
            setLoading(true);
            const responseData = Object.keys(errors).length === 0 && (await actions[modalType]());
            console.log(responseData);

            // Check the response and update the form data with success or error message
            if (responseData.message === successMessages[modalType] || typeof responseData === "object") {
                typeof responseData === "object" && fetchTickets(responseData);
                setFormData({
                    project: "",
                    topicId: "",
                    title: "",
                    description: "",
                    priority: "",
                    requestedBy: "",
                    attachments: [],
                    fyiTo: "",
                    success: responseData.message ? responseData.message : successMessages[modalType],
                    error: "",
                });
                setClear(true);
                setSelectedProject(null);
                setSelectedTopic(null);
                setSelectedPriority(null);
                setSelectedCcEmails(null);
                setSelectedAttachments(null);
                closeModal();
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
            setClear(false);
        }
    };
    return (
        <>
            <ModalOverlay modalType={modalType} closeModal={closeModal} modalName={modalName[modalType]} formData={formData}>
                {/* Content of the modal */}
                <form className="w-100" onSubmit={handleSubmit}>
                    {modalType === "delete" ? (
                        <DeleteText message={"Ticket"} />
                    ) : (
                        <div style={{ height: "65vh", overflowY: "auto" }}>
                            <div className="d-flex py-4">
                                <div className="d-flex flex-column w-100 me-3">
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        loading={autocompleteLoading}
                                        value={selectedProject}
                                        onChange={handleProjectChange}
                                        options={projectOptions}
                                        getOptionLabel={(option) => option.name}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        size="small"
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
                                                error={!!fieldErrors.project} // Set error prop based on field error
                                                helperText={fieldErrors.project} // Provide the error message
                                            />
                                        )}
                                        getOptionKey={(option) => option.id}
                                        autoFocus
                                    />
                                </div>
                                <div className="d-flex flex-column w-100">
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo1"
                                        loading={autocompleteLoading}
                                        value={selectedPriority}
                                        onChange={handlePriorityChange}
                                        options={PRIORITY_OPTIONS}
                                        getOptionLabel={(priorityOption) => priorityOption.name}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        size="small"
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
                                                error={!!fieldErrors.priority} // Set error prop based on field error
                                                helperText={fieldErrors.priority} // Provide the error message
                                            />
                                        )}
                                        getOptionKey={(priorityOptions) => priorityOptions.id}
                                    />
                                </div>
                            </div>
                            <div className="d-flex flex-column w-100 mb-4">
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    loading={topicLoading}
                                    value={selectedTopic}
                                    onChange={handleAutocompleteChange}
                                    options={topicOptions}
                                    getOptionLabel={(option) => option.name}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    size="small"
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
                                            error={!!fieldErrors.topicId} // Set error prop based on field error
                                            helperText={fieldErrors.topicId} // Provide the error message
                                        />
                                    )}
                                    getOptionKey={(option) => option.id}
                                    autoFocus
                                />
                            </div>
                            <div className="d-flex flex-column w-100 mb-4">
                                <TextField
                                    id="title"
                                    variant="outlined"
                                    name="title"
                                    autoComplete="title"
                                    label="Title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    fullWidth
                                    size="small"
                                    error={!!fieldErrors.title} // Set error prop based on field error
                                    helperText={fieldErrors.title} // Provide the error message
                                />
                            </div>
                            <div className="d-flex flex-column w-100 mb-4">
                                <TextField
                                    name="requestedBy"
                                    value={formData.requestedBy}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    className="w-100"
                                    id="requestedBy"
                                    label="Requested By"
                                    fullWidth
                                    autoComplete="requestedBy"
                                    size="small"
                                    error={!!fieldErrors.requestedBy} // Set error prop based on field error
                                    helperText={fieldErrors.requestedBy} // Provide the error message
                                />
                            </div>
                            <div className="d-flex flex-column w-100 mb-4">
                                <EmailField
                                    setSelectedCcEmails={setSelectedCcEmails}
                                    clear={clear}
                                    error={!!(fieldErrors.fyiTo ? fieldErrors.fyiTo : "")}
                                    helperText={fieldErrors.fyiTo}
                                    size="small"
                                />
                            </div>
                            <div className="d-flex flex-column w-100 mb-4">
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
                                    size="small"
                                    error={!!fieldErrors.description} // Set error prop based on field error
                                    helperText={fieldErrors.description} // Provide the error message
                                />
                            </div>
                            <div className="d-flex flex-column w-100">
                                <CustomFileAttachment setSelectedAttachments={setSelectedAttachments} clear={clear} error={fieldErrors.attachments} helperText={fieldErrors.attachments} />
                            </div>
                        </div>
                    )}
                    <div className="d-flex flex-column w-100 mt-4">
                        <CustomButton isLoading={loading} type="submit" icon={buttonIcons[modalType]} label={buttonLabels[modalType]} disabled={loading} />
                    </div>
                </form>
            </ModalOverlay>
        </>
    );
};

export default TicketModal;
