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
    const [loading, setLoading] = useState(false);
    const [autocompleteLoading, setAutocompleteLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const autocompleteRef = useRef(null);
    const buttonLabels = {
        add: "Create Support team", 
        edit: "Update Support team", 
        delete: "Confirm" 
    };
    const { createSupportteam, updateSupportteam, deleteSupportteam } = useSupportteamService();
    const { getAllUsers } = useUserService();

    const [formData, setFormData] = useState({
        userIds: users !== null ? users.id : "",
        name: "",
        userIds: "",
        success: "",
        error: "",
        id: ""
    });

    const buttonIcons = {
        add: <FaCirclePlus />, 
        edit: <FaEdit />, 
        delete: <FaTrashAlt /> 
    };

    const modalName = {
        add: "Add Support team", 
        edit: "Edit Support team", 
        delete: "Delete Support team" 
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                const formattedOptions = data.map(users => ({ id: users.id, name: users.name, value: users.id }));
                setOptions(formattedOptions);
            } catch (error) {
                console.log(error);
            } finally {
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
        } 
        setSelectedUser(null);
        
    }, [modalType, supportteam, options, users]);

   
    const handleAutocompleteChange = (event, newValue) => {
        setSelectedUser(newValue);
        setFormData((prevData) => ({
            ...prevData,
            userIds: newValue ? newValue.id : "",
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            name: value,
        })); 
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const userIds = selectedUser?.map(u=>u.id);
        let supportteam = {name: formData.name, userIds:userIds};
        try {
           const add = createSupportteam(supportteam);
           if(add){
            alert('Data inserted successfully.');
            fetchSupportteam();
           }
        } catch (err) {
          if (!err?.response) {
            alert("No Server Response");
          } else if (err.response?.status === 401) {
            alert("Unauthorized");
          } else {
            alert("Failed Added");
          }
        }
      };
     const actions = {
        add: () => createSupportteam(supportteam),
        edit: () => updateSupportteam(supportteam.id, supportteam),
        delete: () => deleteSupportteam(supportteam.id)
     };
     
    return (
        <>
            <ModalOverlay
                modalType={modalType}
                closeModal={closeModal}
                modalName={modalName[modalType]}
                formData={formData}
            >
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
                                />
                            </div>
                            <div className="flex flex-col space-y-1 w-full mb-4">
                                <Autocomplete
                                    multiple
                                    id="combo-box-demo"
                                    loading={autocompleteLoading}
                                   // value={selectedUser}
                                    name={selectedUser}
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

