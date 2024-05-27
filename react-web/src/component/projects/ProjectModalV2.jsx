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

const ProjectModal = ({ modalType, project, closeModal, fetchProjects, organization }) => {
    const { createProject, updateProject, deleteProject } = useProjectService();
    const { getAllOrganizations } = useOrganizationService();

    const [formData, setFormData] = useState({
        code: uuidv4(),
        organizationId: organization !== null ? organization.id : "",
        name: "",
        description: "",
        success: "",
        error: "",
        id: "",
    });

    const [loading, setLoading] = useState(false);
    const [autocompleteLoading, setAutocompleteLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState(null);

    const buttonLabels = {
        add: "Create Project",
        edit: "Update Project",
        delete: "Confirm"
    };

    const buttonIcons = {
        add: <FaCirclePlus />,
        edit: <FaEdit />,
        delete: <FaTrashAlt />
    };

    const modalName = {
        add: "Add Project",
        edit: "Edit Project",
        delete: "Delete Project"
    };

    useEffect(() => {
        if (modalType === 'add' || modalType === 'edit') {
            setAutocompleteLoading(true);
            setTimeout(() => {
                setAutocompleteLoading(false);
            }, 1000);
        } else setSelectedOrganization(null);
    }, [modalType]);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const data = await getAllOrganizations();
                const formattedOptions = data.map(organization => ({ id: organization.id, name: organization.name, value: organization.id }));
                setOptions(formattedOptions);
            } catch (error) {
                console.error(error);
            } finally {
                setAutocompleteLoading(false);
            }
        };

        fetchOrganizations();
    }, []);

    useEffect(() => {
        if (modalType === 'edit' && project && options.length > 0) {
            const { name, code, description, id, OrganizationId } = project;
            const matchedOrganization = options.find(option => option.id === OrganizationId);

            setSelectedOrganization(matchedOrganization);
            setFormData({
                code,
                organizationId: OrganizationId || "",
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
            setFormData({
                code: uuidv4(),
                organizationId: organization !== null ? organization.id : "",
                name: "",
                description: "",
                success: "",
                error: "",
                id: "",
            });
            setSelectedOrganization(null);
        }
    }, [modalType, project, options, organization]);

    useEffect(() => {
        if (formData.error || formData.success) {
            const timer = setTimeout(() => {
                setFormData(prevData => ({
                    ...prevData,
                    success: false,
                    error: "",
                }));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [formData.error, formData.success]);

    const handleAutocompleteChange = (event, newValue) => {
        setSelectedOrganization(newValue);
        setFormData(prevData => ({
            ...prevData,
            organizationId: newValue ? newValue.id : "",
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
            success: false,
            error: "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const successMessages = {
            add: "Project added successfully",
            edit: "Project updated successfully",
            delete: "Project deleted successfully"
        };

        const actions = {
            add: () => createProject(formData),
            edit: () => updateProject(formData.id, formData),
            delete: () => deleteProject(Number(project.id))
        };

        try {
            setLoading(true);
            const responseData = await actions[modalType]();
            if (responseData.message === successMessages[modalType] || typeof responseData === 'object') {
                fetchProjects && fetchProjects();
                setFormData({
                    code: uuidv4(),
                    organizationId: "",
                    name: "",
                    description: "",
                    success: successMessages[modalType],
                    error: "",
                    id: "",
                });
                setSelectedOrganization(null);
            } else {
                setFormData(prevData => ({
                    ...prevData,
                    error: responseData.message,
                }));
            }
        } catch (error) {
            setFormData(prevData => ({
                ...prevData,
                error: error.message || "Something went wrong",
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                onClick={closeModal}
                className={`${modalType ? "" : "hidden"} fixed top-0 left-0 z-30 w-full h-full bg-black opacity-50`}
            />
            <Modal
                open={!!modalType}
                onClose={closeModal}
                aria-labelledby="project-modal-title"
                aria-describedby="project-modal-description"
            >
                <div className="fixed inset-0 m-4 flex items-center justify-center">
                    <div className="bg-white w-1/3 md:w-3/6 shadow-lg flex flex-col items-center space-y-4 overflow-y-auto px-4 py-4 md:px-8">
                        <div className="flex items-center justify-between w-full">
                            <span className="text-left font-semibold text-2xl tracking-wider">
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
                                            id="organization-autocomplete"
                                            loading={autocompleteLoading}
                                            value={selectedOrganization}
                                            onChange={handleAutocompleteChange}
                                            options={options}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Select Organization"
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
