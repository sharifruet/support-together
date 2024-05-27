import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, IconButton, Modal, TablePagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import Pagination from '@mui/material/Pagination';
import { format } from 'date-fns';
import useOrganizationService from '../../hooks/useOrganizationService';
import './OrganizationsStyles.css';
import OrganizationModal from './OrganizationModal'

const Organizations = () => {
    const { getAllOrganizations } = useOrganizationService();
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [modalType, setModalType] = useState(null);

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleOpenModal = useCallback((organization, modalType) => {
        setSelectedOrganization(organization);
        setModalType(modalType);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalType(null);
        setSelectedOrganization(null);
    }, []);

    const handleOpenEditModal = useCallback((organization) => {
        setSelectedOrganization(organization);
        setOpenEditModal(true);
    }, []);

    const handleOpenViewModal = useCallback((organization) => {
        setSelectedOrganization(organization);
        setOpenViewModal(true);
    }, []);

    const handleOpenDeleteModal = useCallback((organization) => {
        setSelectedOrganization(organization);
        setOpenDeleteModal(true);
    }, []);

    const handleCloseEditModal = useCallback(() => {
        setOpenEditModal(false);
    }, []);

    const handleCloseViewModal = useCallback(() => {
        setOpenViewModal(false);
    }, []);

    const handleCloseDeleteModal = useCallback(() => {
        setOpenDeleteModal(false);
    }, []);

    const handlePageChange = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = useCallback((event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    }, []);

    const handleSearchChange = useCallback((event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    }, []);

    const handleSortChange = useCallback((field) => {
        setSortField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    }, [sortOrder]);

    const fetchOrganizations = async () => {
        try {
            const data = await getAllOrganizations();
            setOrganizations(data);
        } catch (error) {
            console.error('Error fetching organizations:', error);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    // Apply search filter
    const filteredOrganizations = organizations.filter((org) =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply sorting
    let sortedOrganizations = [...filteredOrganizations];
    if (sortField) {
        sortedOrganizations = sortedOrganizations.sort((a, b) => {
            const x = a[sortField];
            const y = b[sortField];
            return sortOrder === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
        });
    }

    // Pagination
    const startIndex = (page - 1) * rowsPerPage;
    const paginatedOrganizations = sortedOrganizations.slice(startIndex, startIndex + rowsPerPage);

    return (
        <>
            <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center w-full">
                {/* It's open the add category modal */}
                <div
                    style={{ background: "#303031" }}
                    onClick={() => handleOpenModal(null, "add")}
                    className="cursor-pointer rounded-full p-2 flex items-center justify-center text-gray-100 text-sm fs-5 uppercase"
                >
                    <svg
                        className="w-6 h-6 text-gray-100 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Add Organization
                </div>
            </div>
            <TextField
                label="Search"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            <TableContainer component={Paper} className="tableContainer">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Button onClick={() => handleSortChange('name')}>
                                    Name
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => handleSortChange('address')}>
                                    Address
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => handleSortChange('createdAt')}>
                                    Created At
                                </Button>
                            </TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedOrganizations.map((organization) => (
                            <TableRow key={organization.id}>
                                <TableCell>{organization.name}</TableCell>
                                <TableCell>{organization.address}</TableCell>
                                <TableCell>{format(new Date(organization.createdAt), 'MM/dd/yyyy')}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenModal(organization, "edit")}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenViewModal(organization)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDeleteModal(organization)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination
                count={Math.ceil(filteredOrganizations.length / rowsPerPage)}
                page={page}
                onChange={handlePageChange}
            />
            {/* <TablePagination
                rowsPerPageOptions={[3, 5, 10]}
                component="div"
                count={paginatedOrganizations.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
            {/* Edit Modal */}
            {/* <Modal
                open={openEditModal}
                onClose={handleCloseEditModal}
                aria-labelledby="edit-modal-title"
                aria-describedby="edit-modal-description"
            > */}
            <div>
                <OrganizationModal
                    modalType={modalType}
                    organization={selectedOrganization}
                    closeModal={handleCloseModal}
                    fetchOrganizations={fetchOrganizations}
                />
                {/* Edit Organization Component */}
                {/* You can create a separate component for editing an organization */}
            </div>
            {/* </Modal> */}
            {/* View Modal */}
            
            {/* Delete Modal */}
            <Modal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                aria-labelledby="delete-modal-title"
                aria-describedby="delete-modal-description"
            >
                <div className="modalContainer">
                    {/* Delete Organization Component */}
                    {/* You can create a separate component for deleting an organization */}
                </div>
            </Modal>
        </>
    );
};

export default Organizations;