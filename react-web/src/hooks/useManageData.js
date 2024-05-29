// useManageData.js
import { useState, useEffect } from 'react';

const useManageData = (getDataFunction) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(1);
    };

    const handleOpenModal = (item, type) => {
        setSelectedItem(item);
        setModalType(type);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedItem(null);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    const handleSortChange = (field) => {
        setSortField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    useEffect(() => {
        getDataFunction();
    }, [getDataFunction]);

    return {
        selectedItem,
        modalType,
        page,
        rowsPerPage,
        searchQuery,
        sortField,
        sortOrder,
        handlePageChange,
        handleRowsPerPageChange,
        handleOpenModal,
        handleCloseModal,
        handleSearchChange,
        handleSortChange,
    };
};

export default useManageData;
