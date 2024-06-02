import React, { useState, useEffect, useCallback } from 'react';
import { Table, Container, Row, Col, Form, Button, Modal, Pagination } from 'react-bootstrap';
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import { FaCirclePlus } from "react-icons/fa6";
import { Tooltip } from "@mui/material";
import { format } from 'date-fns';
import useOrganizationService from '../../hooks/useOrganizationService';
import './OrganizationsStyles.css';
import OrganizationModal from './OrganizationModal';
import { ReactComponent as AddIcon } from '../../assets/svgIcons/add.svg';
import OpenModalButton from '../common/OpenModalButton';
import ProjectModal from '../projects/ProjectModal';

const Organizations = () => {
    const { getAllOrganizations } = useOrganizationService();
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [modalTypeForProject, setModalTypeForProject] = useState(null);

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

    const handleOpenModal = (organization, modalType) => {
        setSelectedOrganization(organization);
        setModalType(modalType);
    };

    const handleOpenProjectModal = (organization, modalType) => {
        setSelectedOrganization(organization);
        setModalTypeForProject(modalType);
    };

    const handleCloseModal = () => {
        setModalTypeForProject(null);
        setModalType(null);
        setSelectedOrganization(null);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    const handleSortChange = (field) => {
        setSortField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const fetchOrganizations = async () => {
        try {
            const data = await getAllOrganizations();
            setOrganizations(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const filteredOrganizations = organizations.filter((org) =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let sortedOrganizations = [...filteredOrganizations];
    if (sortField) {
        sortedOrganizations = sortedOrganizations.sort((a, b) => {
            const x = a[sortField];
            const y = b[sortField];
            return sortOrder === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
        });
    }

    const startIndex = (page - 1) * rowsPerPage;
    const paginatedOrganizations = sortedOrganizations.slice(startIndex, startIndex + rowsPerPage);

    return (
        <>
            <Container>
                <Row className="mb-3">
                    <Col>
                        <div className="col-span-1 flex items-center">
                            {/* It's open the add organization modal */}
                            <div onClick={() => handleOpenModal(null, "add")}>
                                <OpenModalButton label={"Add Organization"} icon={<AddIcon />} />
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </Col>
                </Row>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th onClick={() => handleSortChange('name')}>Name</th>
                            <th onClick={() => handleSortChange('createdAt')}>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedOrganizations.map((organization) => (
                            <tr key={organization.id}>
                                <td>{organization.name}</td>
                                <td>{format(new Date(organization.createdAt), 'MM/dd/yyyy')}</td>
                                <td>
                                    <Tooltip title={`Add Project to this ${organization.name} Organization`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-success border-0'>
                                            <FaCirclePlus onClick={() => handleOpenProjectModal(organization, "add")} />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title={`Edit this ${organization.name} Organization`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-primary border-0'>
                                            <FaEdit onClick={() => handleOpenModal(organization, "edit")} />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title={`View this ${organization.name} Organization`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-success border-0' onClick={() => handleOpenModal(organization, "view")}>
                                            <FaEye />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title={`Delete this ${organization.name} Organization`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-danger border-0' onClick={() => handleOpenModal(organization, "delete")}>
                                            <FaTrashAlt />
                                        </Button>
                                    </Tooltip>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination>
                    <Pagination.First onClick={() => handlePageChange(1)} />
                    <Pagination.Prev onClick={() => handlePageChange(page - 1)} />
                    {[...Array(Math.ceil(filteredOrganizations.length / rowsPerPage)).keys()].map(number => (
                        <Pagination.Item key={number + 1} active={number + 1 === page} onClick={() => handlePageChange(number + 1)}>
                            {number + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(page + 1)} />
                    <Pagination.Last onClick={() => handlePageChange(Math.ceil(filteredOrganizations.length / rowsPerPage))} />
                </Pagination>
            </Container>

            <OrganizationModal
                modalType={modalType}
                organization={selectedOrganization}
                closeModal={handleCloseModal}
                fetchOrganizations={fetchOrganizations}
            />

            <ProjectModal
                modalType={modalTypeForProject}
                topic={null}
                closeModal={handleCloseModal}
                fetchTopics={null}
                organization={selectedOrganization}
            />
        </>
    );
};

export default Organizations;
