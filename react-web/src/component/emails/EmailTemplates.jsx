import React, { useState, useEffect, useCallback } from 'react';
import { Table, Container, Row, Col, Form, Button, Pagination } from 'react-bootstrap';
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import { Tooltip } from "@mui/material";
import useEmailTemplateService from '../../hooks/useEmailTemplateService';
import './EmailTemplatesStyles.css';
import EmailTemplateModal from './EmailTemplateModal';
import { ReactComponent as AddIcon } from '../../assets/svgIcons/add.svg';
import OpenModalButton from '../common/OpenModalButton';

const EmailTemplates = () => {
    const { getAllEmailTemplates } = useEmailTemplateService();
    const [EmailTemplates, setEmailTemplates] = useState([]);
    const [selectedEmailTemplate, setSelectedEmailTemplate] = useState(null);
    const [modalType, setModalType] = useState(null);

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isLoaded, setLoaded] = useState(false)

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(1);
    };

    const handleOpenModal = (emailTemplate, modalType) => {
        setSelectedEmailTemplate(emailTemplate);
        setModalType(modalType);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedEmailTemplate(null);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    const handleSortChange = (field) => {
        setSortField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const fetchEmailTemplates = useCallback(async () => {
        try {
            const data = await getAllEmailTemplates();
            setEmailTemplates(data);
            // toast.success('Fetched Successfully')
        } catch (error) {
            // toast.error(error)
            console.log(error);
        }
    }, [getAllEmailTemplates]);

    useEffect(() => {
        // if (!isLoaded) {
        fetchEmailTemplates();

        //     setLoaded(true)
        // }     
    }, []);

    const filteredEmailTemplates = EmailTemplates.filter((org) =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let sortedEmailTemplates = [...filteredEmailTemplates];
    if (sortField) {
        sortedEmailTemplates = sortedEmailTemplates.sort((a, b) => {
            const x = a[sortField];
            const y = b[sortField];
            return sortOrder === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
        });
    }

    const startIndex = (page - 1) * rowsPerPage;
    const paginatedEmailTemplates = sortedEmailTemplates.slice(startIndex, startIndex + rowsPerPage);

    return (
        <>
            <Container>
                <Row className="mb-3">
                    <Col>
                        <div className="col-span-1 flex items-center" onClick={() => handleOpenModal(null, "add")}>
                            {/* It's open the add EmailTemplate modal */}
                            <OpenModalButton label={"Add Organization"} icon={<AddIcon />} />
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
                            <th onClick={() => handleSortChange('address')}>Address</th>
                            <th onClick={() => handleSortChange('createdAt')}>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedEmailTemplates.map((emailTemplate) => (
                            <tr key={emailTemplate.id}>
                                <td>{emailTemplate.name}</td>
                                <td>{emailTemplate.address}</td>
                                <td>{format(new Date(emailTemplate.createdAt), 'MM/dd/yyyy')}</td>
                                <td>
                                    <Tooltip title={`Edit this ${emailTemplate.name} Organization`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-primary border-0' onClick={() => handleOpenModal(emailTemplate, "edit")}>
                                            <FaEdit />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title={`View this ${emailTemplate.name} Organization`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-success border-0' onClick={() => handleOpenModal(emailTemplate, "view")}>
                                            <FaEye />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title={`Delete this ${emailTemplate.name} Organization`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-danger border-0' onClick={() => handleOpenModal(emailTemplate, "delete")}>
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
                    {[...Array(Math.ceil(filteredEmailTemplates.length / rowsPerPage)).keys()].map(number => (
                        <Pagination.Item key={number + 1} active={number + 1 === page} onClick={() => handlePageChange(number + 1)}>
                            {number + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(page + 1)} />
                    <Pagination.Last onClick={() => handlePageChange(Math.ceil(filteredEmailTemplates.length / rowsPerPage))} />
                </Pagination>
            </Container>

            <EmailTemplateModal
                modalType={modalType}
                emailTemplate={selectedEmailTemplate}
                closeModal={handleCloseModal}
                fetchEmailTemplates={fetchEmailTemplates}
            />
        </>
    );
};

export default EmailTemplates;
