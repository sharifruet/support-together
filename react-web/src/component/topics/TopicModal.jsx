import React, { useState, useEffect } from "react";
import { Modal, TextField, Button, CircularProgress, Autocomplete } from "@mui/material";
import useTopicService from '../../hooks/useTopicService';
import useProjectService from '../../hooks/useProjectService';
import { v4 as uuidv4 } from 'uuid';
import { ReactComponent as CancelIcon } from '../../assets/svgIcons/cancel.svg';

const TopicModal = ({ modalType, topic, closeModal, fetchTopics, project }) => {
    const { createTopic, updateTopic, deleteTopic } = useTopicService();
    const { getAllProjects } = useProjectService();

    const [formData, setFormData] = useState({
        code: uuidv4(),
        projectId: "",
        projectId: "",
        name: "",
        description: "",
        success: "",
        error: "",
        id: ""
    });
    const [loading, setLoading] = useState(false);
    const [autocompleteLoading, setAutocompleteLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        if (modalType === 'add' || modalType === 'edit') {
            // Set autocompleteLoading to true when modal is opened
            setAutocompleteLoading(true);
            setTimeout(() => {
                setAutocompleteLoading(false);
            }, 1000);
        } else setSelectedProject(null);
    }, [modalType]);

    const returnMatchedObject = (projectId, options) => {
        // Find the organization corresponding to the project's organizationId
        const selectedMatchedProject = options?.find(option => option.id === projectId);

        // Update selectedProject state with the found organization
        setSelectedProject(selectedMatchedProject);
    }

    // Set autocomplete value when this modal open from projectList Action section
    useEffect(() => {
        if (modalType === 'add' && project !== null && options && options.length > 0) {
            
            // To prefilled the material ui AutoComplete component
            returnMatchedObject(project.id, options);
            
        } else setSelectedProject(null);
    }, [modalType, project]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getAllProjects();
                const formattedOptions = data.map(organization => ({ id: organization.id, label: organization.name, value: organization.id }));
                setOptions(data);
            } catch (error) {
                console.log(error);
            } finally {
                // Set autocompleteLoading to false when data is fetched
                setAutocompleteLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        if (modalType === 'edit' && topic && options && options.length > 0 ) {
            const { name, code, description, id, ProjectId } = topic;

            // To prefilled the material ui AutoComplete component
            returnMatchedObject(ProjectId, options);

            setFormData({
                ...formData,
                projectId: ProjectId || "",
                code: code,
                name: name || "",
                description: description || "",
                id: id || "",
                success: false,
                error: false,
            });
        } else {
            // Clear form data if modalType is not 'edit'
            setFormData({
                ...formData,
                name: "",
                description: "",
                id: "",
                projectId: ""
            });
            // Reset selectedOrganization state
            project === null && setSelectedProject(null);
        }
    }, [modalType, topic, options]);

    // Reset error and success messages after 2 seconds
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

    const handleAutocompleteChange = (event, newValue) => {
        console.log(newValue)
        setSelectedProject(newValue);
        setFormData((prevData) => ({
            ...prevData,
            projectId: newValue ? newValue.id : "",
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            success: false,
            error: "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const createMessage = "Topic added successfully"
            const updateMessage = "Topic updated successfully"
            const responseData = modalType === "add" ? await createTopic(formData) : modalType === "edit" ? await updateTopic(formData.id, formData) : await deleteTopic(topic.id);
            console.log(responseData)
            
            if (responseData.message === updateMessage || typeof responseData === 'object') {
                fetchTopics && fetchTopics();
                setFormData({
                    name: "",
                    code: "",
                    description: "",
                    projectId: "",
                    success: responseData.message ? responseData.message : createMessage,
                    error: "",
                });
                setSelectedProject(null);
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
            {/* Black Overlay */}
            <div
                onClick={closeModal}
                className={`${modalType ? "" : "hidden"
                    } fixed top-0 left-0 z-30 w-full h-full bg-black opacity-50`}
            />
            {/* Modal */}
            <Modal
                open={!!modalType}
                onClose={closeModal}
                aria-labelledby="add-category-modal-title"
                aria-describedby="add-category-modal-description"
            >
                <div className="fixed inset-0 m-4 flex items-center justify-center">
                    <div className="bg-white w-1/3 md:w-3/6 shadow-lg flex flex-col items-center space-y-4 overflow-y-auto px-4 py-4 md:px-8">
                        <div className="flex items-center justify-between w-full">
                            <span className="text-left font-semibold text-2xl tracking-wider">
                                {modalType === "add" ? "Add Topic" : modalType === "edit" ? "Edit Topic" : "Delete Topic"}
                            </span>
                            <span
                                style={{ background: "#303031" }}
                                onClick={closeModal}
                                className="cursor-pointer text-gray-100 c-py-1 c-px-2 rounded-full cancelIcon"
                            >
                                <CancelIcon className="w-6 h-6 font-bold cancelSvg" />
                            </span>
                        </div>
                        {formData.error && (
                            <div className="bg-red-200 py-2 px-4 w-full">{formData.error}</div>
                        )}
                        {formData.success && (
                            <div className="bg-green-200 py-2 px-4 w-full">{formData.success}</div>
                        )}

                        <form className="w-full" onSubmit={handleSubmit}>
                            {modalType === 'delete' ? (
                                <>
                                    <h4> Are you sure you want to delete this Topic?</h4>
                                </>
                            ) : (
                                <div>
                                    <div className="flex flex-col space-y-1 w-full">
                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            loading={autocompleteLoading} // Pass the loading state to the Autocomplete component
                                            value={selectedProject}
                                            onChange={handleAutocompleteChange}
                                            options={options}
                                            getOptionLabel={(option) => option.name}
                                            // renderInput={(params) => <TextField {...params} label="Select Project" />}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Select Project"
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
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1 w-full py-4">
                                        <TextField
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            className="w-full"
                                            id="name"
                                            label="Name"
                                            fullWidth
                                            autoComplete="name"
                                            required
                                            autoFocus
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
                                            required
                                            autoFocus
                                            multiline
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col space-y-1 w-full pb-4 md:pb-6 mt-4">
                                <button
                                    style={{ background: "#303031" }}
                                    type="submit"
                                    className={`bg-gray-800 text-gray-100 rounded-full text-lg font-medium py-2 ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <CircularProgress color="inherit" size={24} />
                                    ) : (
                                        modalType === "add" ? "Add Topic" : modalType === "edit" ? "Edit Topic" : "Delete Topic"
                                    )}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </Modal>
        </>
    );
};

export default TopicModal;

