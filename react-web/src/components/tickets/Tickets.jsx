import React, { useState, useEffect, useCallback } from 'react';
import { Table, Container, Row, Col, Form, Button, Modal, Pagination } from 'react-bootstrap';
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import { FaCirclePlus } from "react-icons/fa6";
import { Tooltip } from "@mui/material";
import { format } from 'date-fns';
import useCrud from '../../hooks/useCrud';
import './TicketsStyles.css';
import TicketModal from "./TicketModal";
import { ReactComponent as AddIcon } from '../../assets/svgIcons/add.svg';
import OpenModalButton from '../common/OpenModalButton';

const Tickets = () => {
    const { getAll } = useCrud();
    const ticketUrl = "/tickets";

    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
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

    const handleOpenModal = (ticket, modalType) => {
        setSelectedTicket(ticket);
        setModalType(modalType);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedTicket(null);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    const handleSortChange = (field) => {
        setSortField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const fetchTickets = async () => {
        try {
            const data = await getAll(ticketUrl);
            setTickets(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const filteredTickets = tickets.filter((ticket) =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let sortedTickets = [...filteredTickets];
    if (sortField) {
        sortedTickets = sortedTickets.sort((a, b) => {
            const x = a[sortField];
            const y = b[sortField];
            return sortOrder === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
        });
    }

    const startIndex = (page - 1) * rowsPerPage;
    const paginatedTickets = sortedTickets.slice(startIndex, startIndex + rowsPerPage);

    return (
        <>
            <Container>
                <Row className="mb-3">
                    <Col>
                        <div className="col-span-1 flex items-center">
                            {/* It's open the add ticket modal */}
                            <div onClick={() => handleOpenModal(null, "add")}>
                                <OpenModalButton label={"Create Ticket"} icon={<AddIcon />} />
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
                <Table hover striped bordered>
                    <thead>
                        <tr>
                            <th onClick={() => handleSortChange('title')}>Title</th>
                            <th onClick={() => handleSortChange('description')}>Description</th>
                            <th onClick={() => handleSortChange('createdAt')}>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedTickets.map((ticket) => (
                            <tr key={ticket.id}>
                                <td>{ticket.title}</td>
                                <td>{ticket.description}</td>
                                <td>{format(new Date(ticket.createdAt), 'MM/dd/yyyy')}</td>
                                <td>
                                    <Tooltip title={`Edit this ${ticket.name} Ticket`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-primary border-0'>
                                            <FaEdit onClick={() => handleOpenModal(ticket, "edit")} />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title={`View this ${ticket.name} Ticket`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-success border-0' onClick={() => handleOpenModal(ticket, "view")}>
                                            <FaEye />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title={`Delete this ${ticket.name} Ticket`} arrow placement="top">
                                        <Button style={{ padding: ".3rem", margin: "0 .6rem" }} variant="standard" className='text-danger border-0' onClick={() => handleOpenModal(ticket, "delete")}>
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
                    {[...Array(Math.ceil(filteredTickets.length / rowsPerPage)).keys()].map(number => (
                        <Pagination.Item key={number + 1} active={number + 1 === page} onClick={() => handlePageChange(number + 1)}>
                            {number + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(page + 1)} />
                    <Pagination.Last onClick={() => handlePageChange(Math.ceil(filteredTickets.length / rowsPerPage))} />
                </Pagination>
            </Container>

            <TicketModal
                modalType={modalType}
                ticket={selectedTicket}
                closeModal={handleCloseModal}
                fetchTickets={fetchTickets}
                topic={null}
            />
        </>
    );
};

export default Tickets;
