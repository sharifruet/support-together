import React, { useState } from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';

const EmailField = () => {
    const [searchInput, setSearchInput] = useState('');
    const [ccList, setCcList] = useState([]);

    const handleInputChange = (_, value) => {
        setSearchInput(value);
    };

    const handleCcChange = (_, values) => {
        setCcList(values);
    };

    // Filter out selected options from options array
    const optionsWithoutSelected = [searchInput, ...ccList].filter(option => !ccList.includes(option));

    // Regular expression for basic email validation
    const isValidEmail = (email) => {
        // Basic regex for email validation
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Determine whether to show options based on email validation
    const showOptionsTray = isValidEmail(searchInput);

    return (
        <Autocomplete
            multiple
            freeSolo
            id="tags-filled"
            options={showOptionsTray ? optionsWithoutSelected : []} // Only show options if email is valid
            value={ccList}
            inputValue={searchInput}
            onInputChange={handleInputChange}
            onChange={handleCcChange}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip
                        key={option}
                        label={option}
                        onDelete={() => {
                            const filteredList = ccList.filter((email) => email !== option);
                            setCcList(filteredList);
                        }}
                        {...getTagProps({ index })}
                    />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="CC"
                    variant="outlined"
                />
            )}
        />
    );
};

export default EmailField;
