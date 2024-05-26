import React, { useState, useEffect } from "react";
import { Modal, TextField, CircularProgress, Autocomplete } from "@mui/material";
import useProjectService from '../../hooks/useProjectService';
import useOrganizationService from '../../hooks/useOrganizationService';
import { v4 as uuidv4 } from 'uuid';
import { ReactComponent as CancelIcon } from '../../assets/svgIcons/cancel.svg';
import CustomButton from "../common/CustomButton";
import DeleteText from "../common/DeleteText";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
const ProjectModal = ({ modalType, project, closeModal, fetchProjects }) => {
    // Destructuring service or api calls form ba
    const { createProject, updateProject, deleteProject } = useProjectService();
    const { getAllOrganizations } = useOrganizationService();

    // State to manage form data
    const [formData, setFormData] = useState({
        code: uuidv4(),
        organizationId: "",
        name: "",
        description: "",
        success: "",
        error: "",
        id: "",
    });

    // State to manage loading status
    const [loading, setLoading] = useState(false);
    // State to manage Material Ui AutoComplete UI loading status
    const [autocompleteLoading, setAutocompleteLoading] = useState(false);
    // State to manage Material Ui AutoComplete UI options
    const [options, setOptions] = useState([]);
    // State to manage Material Ui AutoComplete UI selected option
    const [selectedOrganization, setSelectedOrganization] = useState(null);

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
            }, 1000);
        } else setSelectedOrganization(null);
    }, [modalType]);

    // Fetch all organizations for the Autocomplete options
    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const data = await getAllOrganizations();
                const formattedOptions = data.map(organization => ({ id: organization.id, label: organization.name, value: organization.id }));
                setOptions(data);
            } catch (error) {
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
        if (modalType === 'edit' && project && options && options.length > 0) {
            const { name, code, description, id, OrganizationId } = project;

            // Find the organization corresponding to the project's organizationId
            const selectedOrg = options?.find(option => option.id === OrganizationId);

            // Update selectedOrganization state with the found organization
            setSelectedOrganization(selectedOrg);

            setFormData({
                ...formData,
                organizationId: OrganizationId || "",
                code: code, //uuidv4(),
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
                organizationId: ""
            });

            // Reset selectedOrganization state
            setSelectedOrganization(null);
        }
    }, [modalType]);

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
        console.log(newValue)
        setSelectedOrganization(newValue);
        setFormData((prevData) => ({
            ...prevData,
            organizationId: newValue ? newValue.id : "",
        }));
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
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

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
            const responseData = await actions[modalType]();
            console.log(responseData)
            // Check the response and update the form data with success or error message
            if (responseData.message === successMessages[modalType] || typeof responseData === 'object') {
                fetchProjects();
                setFormData({
                    name: "",
                    code: "",
                    description: "",
                    organizationId: "",
                    success: responseData.message, // responseData.message ? responseData.message : successMessages[modalType]
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
                                {/* Modal Name depending on modalType*/}
                                {modalName[modalType]}
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
                                <CustomButton
                                    isLoading={loading}
                                    type="submit"
                                    icon={buttonIcons[modalType]}
                                    label={buttonLabels[modalType]}
                                    disabled={loading}
                                />
                            </div>
                        </form>

                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ProjectModal;

