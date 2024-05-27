import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Table, Container, Row, Col, Form, Button, Pagination } from 'react-bootstrap';
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import useEmailTemplateService from '../../hooks/useEmailTemplateService';
import './EmailTemplatesStyles.css';
import EmailTemplateModal from './EmailTemplateModal';
import { ReactComponent as AddIcon } from '../../assets/svgIcons/add.svg';
import { toast } from 'react-toastify';

const EmailTemplates = () => {
    const { getAllEmailTemplates } = useEmailTemplateService();
    const [emailTemplates, setEmailTemplates] = useState([]);
    const [selectedEmailTemplate, setSelectedEmailTemplate] = useState(null);
    const [modalType, setModalType] = useState(null);

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const isFirstRender = useRef(true); // Track the initial render

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
        console.log('Fetching email templates...');
        try {
            const data = await getAllEmailTemplates();
            setEmailTemplates(data);
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'An unexpected error occurred';
            toast.error(errorMessage, { toastId: 'fetch-email-templates-error' });
            console.error(errorMessage);
        }
    }, [getAllEmailTemplates]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            fetchEmailTemplates();
        }
    }, [fetchEmailTemplates]);

    const filteredEmailTemplates = emailTemplates.filter((template) =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                        <div className="col-span-1 flex items-center">
                            <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-start w-full">
                                <div
                                    style={{ background: "#303031" }}
                                    onClick={() => handleOpenModal(null, "add")}
                                    className="cursor-pointer rounded-full p-2 flex items-center justify-center text-gray-100 font-semibold text-sm uppercase"
                                >
                                    <AddIcon className="w-6 h-6 text-gray-100 mr-2" />
                                    Add Email Template
                                </div>
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
                                    <Button variant="standard" className='text-primary' onClick={() => handleOpenModal(emailTemplate, "edit")}>
                                        <FaEdit />
                                    </Button>{' '}
                                    <Button variant="standard" className='text-success' onClick={() => handleOpenModal(emailTemplate, "view")}>
                                        <FaEye />
                                    </Button>{' '}
                                    <Button variant="standard" className='text-danger' onClick={() => handleOpenModal(emailTemplate, "delete")}>
                                        <FaTrashAlt />
                                    </Button>
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
