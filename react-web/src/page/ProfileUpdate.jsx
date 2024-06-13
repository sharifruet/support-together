import React, { useState, useEffect, useContext } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ManageAccountsSharpIcon from '@mui/icons-material/ManageAccountsSharp';
import { toast } from 'react-toastify';
import useCrud from '../hooks/useCrud';
import CustomButton from "../components/common/CustomButton";
import GlobalContext from '../GlobalContext';
import { useNavigate } from 'react-router-dom';


const ProfileUpdate = () => {
    const defaultTheme = createTheme();
    const { user } = useContext(GlobalContext);
    const { updateProfile } = useCrud();
    const profileUpdateUrl = "/update-user";
    const navigate = useNavigate();

    // State to manage form data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        success: "",
        error: ""
    });

    // State to manage individual field errors
    const [fieldErrors, setFieldErrors] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: ""
    });

    // State to manage loading status
    const [loading, setLoading] = useState(false);

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
            if (!value || !value.trim()) {
                const formattedName = name.split(/(?=[A-Z])/).join(" "); // Splits camelCase to separate words
                errors[name] = `${formattedName.charAt(0).toUpperCase() + formattedName.slice(1)} is required`;
            }
        });
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Define fields to validate
        const fieldsToValidate = [
            { name: "name", value: formData.name },
            { name: "email", value: formData.email },
            { name: "phoneNumber", value: formData.phoneNumber },
            { name: "password", value: formData.password }
        ];

        // Validate all fields before submission
        const errors = validateForm(fieldsToValidate);

        // Update field errors
        setFieldErrors(errors);

        // Define success messages for different modal types
        const successMessages = {
            profileUpdate: "Profile Updated successfully",
            edit: "Email Template updated successfully",
            delete: "Email Template deleted successfully"
        };



        try {
            setLoading(true);
            const responseData = Object.keys(errors).length === 0 && await updateProfile(profileUpdateUrl, formData);
            console.log(responseData)

            // Check the response and update the form data with success or error message
            if (responseData.message === successMessages["profileUpdate"] || typeof responseData === 'object') {
                setFormData({
                    name: "",
                    email: "",
                    phoneNumber: "",
                    password: "",
                    success: responseData.message ? responseData.message : successMessages["profileUpdate"],
                    error: "",
                });
                toast.success('🎉 Profile updated successfully!', { className: 'toast-success' });
                navigate("/dashboard");
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
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Change Password
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, mb: 1 }}>
                        <TextField
                            id="name"
                            variant="outlined"
                            name="name"
                            label="Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            sx={{ mb: 4 }}
                            fullWidth
                            autoFocus
                            error={!!(fieldErrors.name)} // Set error prop based on field error
                            helperText={fieldErrors.name} // Provide the error message
                        />
                        <TextField
                            id="email"
                            variant="outlined"
                            name="email"
                            label="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            sx={{ mb: 4 }}
                            fullWidth
                            error={!!(fieldErrors.email)} // Set error prop based on field error
                            helperText={fieldErrors.email} // Provide the error message
                            type="email"
                        />
                        <TextField
                            id="phoneNumber"
                            variant="outlined"
                            name="phoneNumber"
                            label="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            sx={{ mb: 4 }}
                            fullWidth
                            error={!!(fieldErrors.phoneNumber)} // Set error prop based on field error
                            helperText={fieldErrors.phoneNumber} // Provide the error message
                            type="number"
                        />
                        <TextField
                            id="password"
                            variant="outlined"
                            name="password"
                            label="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            fullWidth
                            error={!!(fieldErrors.password)} // Set error prop based on field error
                            helperText={fieldErrors.password} // Provide the error message
                            type="password"
                        />
                        <div className="flex flex-col space-y-1 w-full mt-4">
                            <CustomButton
                                isLoading={loading}
                                type="submit"
                                icon={<ManageAccountsSharpIcon />}
                                label={"Update Profile"}
                                disabled={loading}
                            />
                        </div>
                    </Box>
                </Box>
                <h1><br /><br /><br /></h1>
            </Container>
        </ThemeProvider>
    )
}

export default ProfileUpdate;
